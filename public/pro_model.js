/*
 * The model layer of Proactive. I handle all the data fatching and idb manipulation
 * The controller layer calls my functions, which are all async to get infos
 * I don't call other layers; If I have something to say I post a custom event
 * to the root document
 */

import {openDB, deleteDB} from './index_db.js';
import * as Items from './items.js';

// events I post to the controller
import {alertEvent, itemsLoadedEvent, shutDownEvent,
	itemUpdatedEvent, Selections} from "./pro_controller.js";

// exported client side functions. all return promises or null
export {init, shutdown, clearData, first, forward, backward, save, remove};

/*
 * callback side state and entry points
 */

let db = null;

// the init callback
async function cb_init(prev) {
    await prev;
    db = await openDB("Proactive", 1, (db) => {
	Items.upgrade(db);
    });
    let lenth = await Items.load(db);
    itemsLoadedEvent(length);
    let item = await Items.first(Selections.expired, db);
    itemUpdatedEvent(item);
}

// the shutdown callback
async function cb_shutdown(prev, type, msg) {
    await prev;
    if (db) {
	db.close();
	// so database is safe. future db operation will crash
	db = null;
    }
    shutDownEvent(type, msg);
}

async function cb_clearData(prev) {
    await prev;
    if (db) {
	db.close();
	db = null;
	await deleteDB("Proactive");
    }
    shutDownEvent("info", "Database deleted");
}

async function cb_first(prev, selection) {
    await prev;
    if (!db)
	return;
    let item = await Items.first(selection, db);
    itemUpdatedEvent(item);
}

async function cb_forward(prev, current, selection) {
    await prev;
    if (!db)
	return;
    if (!current) {
	alertEvent("warning", "Already at the end");
	return;
    }
    let item = await Items.next(current.id, selection, db);
    if (!item) {
	alertEvent("warning", "Already at the end");
    } else {
	itemUpdatedEvent(item);
    }
}

async function cb_backward(prev, current, selection) {
    await prev;
    if (!db)
	return;
    if (!current) {
	alertEvent("warning", "Already at the beginning");
	return;
    }
    let item = await Items.prev(current.id, selection, db);
    if (!item) {
	alertEvent("warning", "Already at the beginning");
    } else {
	itemUpdatedEvent(item);
    }
}

async function cb_save(prev, object, changes, selection) {
    await prev;
    if (!db)
	return;

    if (object) {
	// updating current item, must figure out the next item from current before the update
	let next = await Items.sensible_next(object.id, selection, db);
	try {
	    let id = await Items.update(object, changes, db);
	    itemUpdatedEvent(next);
	    return id;
	} catch (e) {
	    if (e instanceof DOMException) {
		alertEvent("error", "The item '" + changes.url +"' already exists");
	    } else {
		throw e;
	    }
	}
    } else {
	// adding an item, no need to figure out the next item. might throw
	try {
	    let id = await Items.add(changes, db);
	    alertEvent("info", "The item '" + changes.url +"' is added");
	    return id;
	} catch (e) {
	    if (e instanceof DOMException) {
		alertEvent("error", "The item '" + changes.url +"' already exists");
	    } else {
		throw e;
	    }
	}
    }
}

async function cb_remove(prev, current, selection) {
    await prev;
    if (!db)
	return;

    let next = await Items.sensible_next(current.id, selection, db);
    await Items.remove(current, db);
    itemUpdatedEvent(next);
}

/*
 * Client side state which is a promise
 * any client side function will await and replace the state
 */
let state = null;

function init() {
    state = cb_init(state);
}

// clear all local data
function clearData() {
    state = cb_clearData(state);
}

function shutdown(type, msg) {
    state = cb_shutdown(state, type, msg);
}

function first(selection) {
    state = cb_first(state, selection);
}

function forward(current, selection) {
    state = cb_forward(state, current, selection);
}

function backward(current, selection) {
    state = cb_backward(state, current, selection);
}

function save(template, changes, selection) {
    state = cb_save(state, template, changes, selection);
}

function remove(current, selection) {
    state = cb_remove(state, current, selection);
}

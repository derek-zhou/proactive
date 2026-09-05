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
	itemUpdatedEvent} from "./pro_controller.js";

// exported client side functions. all return promises or null
export {init, clearData, first, forward, backward, save};

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
    let item = await Items.first(Items.Selection.expired, db);
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
    if (!db || current)
	return;
    let item = await Items.next(current.id, selection, db);
    if (!item) {
	alertEvent("warning", "Already at the end");
    } else {
	itemUpdatedEvent(item);
    }
}

async function cb_backward(prev, current, selection) {
    await prev;
    if (!db || !current)
	return;
    let item = await Items.prev(current.id, selection, db);
    if (!item) {
	alertEvent("warning", "Already at the beginning");
    } else {
	itemUpdatedEvent(item);
    }
}

async function cb_save(prev, object) {
    await prev;
    if (!db)
	return;

    if (object.id) {
	await Items.update(object, db);
    } else {
	await Items.add(object, db);
    }
    itemUpdatedEvent(current);
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

function save(template, changes) {
    for (const prop in changes) {
	template[prop] = changes[prop];
    }
    state = cb_save(state, template);
}

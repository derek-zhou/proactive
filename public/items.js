/*
 * The items schema
 *
 * id: autoincrement id
 * url: the url of this item, nust be unque
 * lastChecked: datetime
 * checkInterval: in days, has to be 1, 7, 30, 90, 365,
 *                ie: daily, weekly, monthly, quarterly, or yearly
 *                the expirationDate is not stored; computed as lastChecked + checkInterval
 * note: additional not to myself
 */
import {openCursor, openCursorFromIndex, continueCursor, getObject, getObjectFromIndex,
	addObject, putObject, deleteObject} from './index_db.js';

// public apis
export {upgrade, load, Selection, first, next, previous, remove, add, update, template,
       sensible_next};

const Store = "items";
const UrlIndex = "url";

// in memory state
// summaries is a map from id => {lastChecked, checkInterval}
var summaries = new Map();

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// return a list of item id whose expirationDate is older than threshold,
// sorted by expirationDate ascending
function selectExpired(threshold) {
    let all_ids = summaries.keys();
    let map = new Map();

    for (const i of all_ids) {
	let node = summaries.get(i);
	let expired_date = addDays(node.lastChecked, node.checkInterval);
	if (expired_date < threshold) {
	    map.put(i, expired_date);
	}
    }

    let list = Array.from(map.keys);
    list.sort((a, b) => map.get(a) - map.get(b));
    return list;
}

// return a list of item id whose checkInterval is interval,
// sorted by expirationDate ascending
function selectInterval(interval) {
    let all_ids = summaries.keys();
    let map = new Map();

    for (const i of all_ids) {
	let node = summaries.get(i);
	let expired_date = addDays(node.lastChecked, node.checkInterval);
	if (node.checkInterval == interval) {
	    map.put(i, expired_date);
	}
    }

    let list = Array.from(map.keys);
    list.sort((a, b) => map.get(a) - map.get(b));
    return list;
}

const Selection = {
    expired: () => selectExpired(new Date()),
    nextWeek: () => selectExpired(addDays(new Date(), 7)),
    daily: () => selectInterval(1),
    weekly: () => selectInterval(7),
    monthly: () => selectInterval(30),
    quarterly: () => selectInterval(90),
    yearly: () => selectInterval(365)
};

function upgrade(db) {
    // the store holds all the feeds
    let store = db.createObjectStore(
	Store, {keyPath: "id", autoIncrement: true});
    store.createIndex(UrlIndex, UrlIndex, {unique: true});
}

function template() {
    return {
	url: "https://example.com",
	lastChecked: new Date(),
	checkInterval: 7,
	note: ""
    };
}

async function first(selection, db) {
    let list = selection();

    if (list.length > 0) {
	// getObject is async
	return getObject(db, Store, list[0]);
    } else {
	return null;
    }
}

async function next(cursor, selection, db) {
    let list = selection();
    let found = false;

    for (const id of list) {
	if (found) {
	    // getObject is async
	    return getObject(db, Store, id);
	} else if (cursor == id) {
	    found = true;
	}
    }
    return null;
}

async function previous(cursor, selection, db) {
    let list = selection();
    let pre = null;

    for (const id of list) {
	if (cursor == id) {
	    break;
	} else {
	    pre = id;
	}
    }

    if (pre != null) {
	// getObject is async
	return getObject(db, Store, pre);
    } else {
	return null;
    }
}

// either next or previous, if already at the last
async function sensible_next(cursor, selection, db) {
    let list = selection();
    let pre = null;
    let found = false;

    for (const id of list) {
	if (found) {
	    // getObject is async
	    return getObject(db, Store, id);
	} else if (cursor == id) {
	    found = true;
	} else {
	    pre = id;
	}
    }

    if (pre != null) {
	// getObject is async
	return getObject(db, Store, pre);
    } else {
	return null;
    }
}

async function remove(cursor, db) {
    await deleteObject(db, Store, cursor);
    summaries.delete(cursor);
}

async function add(item, db) {
    let id = await addObject(db, Store, item);
    summaries.put(id, {lastChecked: item.lastChecked, checkInterval: item.checkInterval});
    item.id = id;
    return id;
}

async function update(item, db) {
    let id = await putObject(db, Store, item);
    summaries.put(id, {lastChecked: item.lastChecked, checkInterval: item.checkInterval});
    item.id = id;
    return id;
}

async function load(db) {
    let cursor = await openCursor(db, Store, IDBKeyRange.lowerBound(0), "next");
    let count = 0;
    summaries = new Map();

    while (cursor) {
	let item = cursor.value;
	summaries.put(item.id, {lastChecked: item.lastChecked, checkInterval: item.checkInterval});
	count = count + 1;
	cursor = await continueCursor(cursor);
    }
    return count;
}

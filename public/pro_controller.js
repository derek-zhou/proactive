/*
 * The controller layer of AirSS.
 * The model layer also send events and change variables as the roots of reactivity
 * The model founctions are encapsulated for use by the view layer
 */

import {render} from './pro_view.js';
import * as Model from './pro_model.js';
import * as Asset from './assets.js';

// screen is fundimental content shown in the window
export const Screens = {
    browse: 1,
    shutdown: 2,
    trash: 3,
    edit: 4
};

// screen is fundimental content shown in the window
export const Selections = {
    expired: "expired",
    daily: "daily",
    weekly: "weekly",
    monthly: "monthly",
    quarterly: "quarterly",
    yearly: "yearly"
};

// the application state
var state = {
    screen: Screens.browse,
    selection: Selections.expired,
    length: 0,
    currentItem: null,
    template: null,
    alert: {
	text: "",
	type: "info"
    }
};

// the set of elements that contain local state
var dirtyElements = new Set();

// does the screen not refrect the state
var viewObsolete = false;

export function focus_element(e) {
    dirtyElements.add(e.currentTarget);
}

export function blur_element(e) {
    let elem = e.currentTarget;
    if (elem.value == "") {
	dirtyElements.delete(elem);
	may_render();
    }
}

function elementDirty() {
    // scroll position is also local state
    return window.scrollY != 0 || dirtyElements.size > 0;
}

function clearElementState() {
    window.scrollTo({top: 0});
    dirtyElements.clear();
}

function may_render() {
    if (!Asset.loaded || !viewObsolete || elementDirty())
	return;
    render(state);
    viewObsolete = false;
}

export function try_render() {
    viewObsolete = true;
    may_render();
}

function actionPreamble() {
    state.alert.text = "";
    clearElementState();
}

export function itemsLoadedEvent(length) {
    state.length = length;
    try_render();
}

export function itemUpdatedEvent(item) {
    state.currentItem = item;
    state.screen = Screens.browse;
    try_render();
}

export function alertEvent(type, text) {
    state.alert.type = type;
    state.alert.text = text;
    try_render();
}

export function shutDownEvent(type, text) {
    state.alert.type = type;
    state.alert.text = text;
    state.screen = Screens.shutdown;
    try_render();
}

// for swipes
let xDown = null;
let yDown = null;

export function touchStartEvent(e) {
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
}

export function touchMoveEvent(e) {
    if ( xDown && yDown && state.screen == Screens.browse ) {
	let xUp = e.touches[0].clientX;
	let yUp = e.touches[0].clientY;
	let xDiff = xDown - xUp;
	let yDiff = yDown - yUp;

	/*most significant*/
	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
	    if ( xDiff > 0 ) {
		/* left swipe */
		e.preventDefault();
		actionPreamble();
		Model.forward(state.currentItem, state.selection);
	    } else {
		/* right swipe */
		e.preventDefault();
		actionPreamble();
		Model.backward(state.currentItem, state.selection);
	    }
	} else {
	    may_render();
	}

    }
    /* reset values */
    xDown = null;
    yDown = null;
}

export function clickLeftEvent(e) {
    e.preventDefault();
    actionPreamble();
    Model.backward(state.currentItem, state.selection);
}

export function clickRightEvent(e) {
    e.preventDefault();
    actionPreamble();
    Model.forward(state.currentItem, state.selection);
}

export function clickAlertEvent(e) {
    e.preventDefault();
    actionPreamble();
    try_render();
}

export function clickReloadEvent(e) {
    e.preventDefault();
    location.reload();
}

export function clickExpiredEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.expired;
    Model.first(state.selection);
    try_render();
}

export function clickDailyEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.daily;
    Model.first(state.selection);
    try_render();
}

export function clickWeeklyEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.weekly;
    Model.first(state.selection);
    try_render();
}

export function clickMonthlyEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.monthly;
    Model.first(state.selection);
    try_render();
}

export function clickQuarterlyEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.quarterly;
    Model.first(state.selection);
    try_render();
}

export function clickYearlyEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.selection = Selections.yearly;
    Model.first(state.selection);
    try_render();
}

export function clickSnoozeEvent(e) {
    e.preventDefault();
    actionPreamble();
    Model.save(state.currentItem, {lastChecked: new Date()});
    try_render();
}

export function clickTrashEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.screen = Screens.trash;
    try_render();
}

export function clickEditEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.template = state.currentItem;
    state.screen = Screens.edit;
    try_render();
}

export function clickNewEvent(e) {
    e.preventDefault();
    actionPreamble();
    if (state.screen != Screens.edit) {
	state.template = null;
	state.screen = Screens.edit;
	try_render();
    }
}

export function resetDialogEvent(e) {
    e.preventDefault();
    actionPreamble();
    state.screen = Screens.browse;
    try_render();
}

export function submitEditEvent(e) {
    e.preventDefault();
    actionPreamble();
    let data = new FormData(e.currentTarget);
    let changes = {};
    addChanges(changes, "url", data);
    addChanges(changes, "note", data);
    addChanges(changes, "checkInterval", data);
    Model.save(state.template, changes, state.selection);
    try_render();
}

export function submitRemoveEvent(e) {
    e.preventDefault();
    actionPreamble();
    Model.remove(state.currentItem, state.selection);
    try_render();
}

function addChange(changes, key, data) {
    value = data.get(key);
    if (value)
	changes[key] = value;
}

Model.init();

document.addEventListener("keydown", (e) => {
    if (state.screen != Screens.browse)
	return;

    switch (e.key) {
    case 'n':
    case 'N':
	e.preventDefault();
	actionPreamble();
	Model.forwardItem();
	break;
    case 'p':
    case 'P':
	e.preventDefault();
	actionPreamble();
	Model.backwardItem();
	break;
    default:
	may_render();
    }
});

document.addEventListener("visibilitychange", (e) => {
    if (elementDirty())
	return;
    if (document.hidden) {
	Model.shutdown("info", "Shutdown due to inactivity");
    } else {
	state.screen = Screens.browse;
	state.alert.text = "";
	state.alert.type = "info";
	Model.init();
    }
});

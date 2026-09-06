import * as Controller from "./pro_controller.js";
import * as Asset from "./assets.js";
import {dialog} from "./dialog.js";
import {browse} from "./browse.js";
import {replay, hook, elem, text, attr, cl, div} from "./domfun.js";

// render everything from scratch
export function render(state) {
    document.title = render_title(state);
    replay(
	document.body, div(
	    cl("viewport"),
	    hook("touchstart", Controller.touchStartEvent),
	    hook("touchmove", Controller.touchMoveEvent),
	    div(alert(state)),
	    div(application(state)),
	    div(footer(state)))
    );
}

function render_title(state) {
    switch (state.screen) {
    case Controller.Screens.browse:
	return `Proactive ${state.selection} tasks`;
    case Controller.Screens.trash:
	return "Proactive: Are you sure?";
    case Controller.Screens.edit:
	return "Proactive: Edit your task";
    case Controller.Screens.shutdown:
	return "Proactive (zzz)";
    }
}

function footer(state) {
    return [
	cl("footer"),
	div(cl("left-half"),
	    elem("a", [
		attr({
		    href: "https://roastidio.us/roast",
		    referrerpolicy: "no-referrer-when-downgrade"
		}),
		text("Roast me at Roastidious")
	    ])),
	div(cl("right-half"),
	    elem("a", [
		attr({
		    href: "https://github.com/derek-zhou/proactive",
		    referrerpolicy: "no-referrer-when-downgrade"
		}),
		text("Fork me on GitHub")
	    ]))
    ];
}

function application(state) {
    if (state.screen == Controller.Screens.browse) {
	return [
	    navbar(state),
	    browse(state)
	];
    } else {
	return [
	    navbar(state),
	    dialog(state)
	];
    }
}

function navbar(state) {
    return [
	div(cl("navbar"),
	    div(elem("a", [
		attr({href: "index.html"}),
		elem("img", attr({src: Asset.at("logoImage"), class: "logo"})),
	    ])),
	    div(cl("toolbar"),
		elem("button", [
		    cl("button"),
		    hook("click", Controller.clickNewEvent),
		    text("➕")
		]),
		elem("button", [
		    cl("button"),
		    hook("click", Controller.clickLeftEvent),
		    text("◀")
		]),
		elem("button", [
		    cl("button"),
		    hook("click", Controller.clickRightEvent),
		    text("▶")
		])))
    ];
}

function alertClass(type) {
    switch (type) {
    case "error":
	return "alert-danger";
    case "warning":
	return "alert-warning";
    default:
	return "alert-info";
    }
}

function alert(state) {
    if (state.alert.text == "")
	return [];
    return elem("p", [
	cl("alert", alertClass(state.alert.type)),
	hook("click", Controller.clickAlertEvent),
	text(state.alert.text)
    ]);
}

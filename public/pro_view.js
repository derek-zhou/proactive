import * as Controller from "./pro_controller.js";
import * as Asset from "./assets.js";
import {replay, hook, elem, text, attr, cl, div} from "./domfun.js";

// render everything from scratch
export function render(state) {
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
		    href: "https://github.com/derek-zhou/airss",
		    referrerpolicy: "no-referrer-when-downgrade"
		}),
		text("Fork me on GitHub")
	    ]))
    ];
}

function application(state) {
    return [
	navbar(state),
	dialog(state)
    ];
}

function navbar(state) {
    return [
	div(cl("navbar"),
	    div(elem("a", [
		attr({href: "index.html"}),
		elem("img", attr({src: Asset.at("logoImage"), class: "logo"})),
		]),
		elem("span", [
		    cl("info"),
		    text(`${state.cursor+1}/${state.length}`)
		])),
	    div(cl("toolbar"),
		elem("button", [
		    cl("button"),
		    hook("click", Controller.clickConfigEvent),
		    text("🔧")
		]),
		elem("button", [
		    cl("button"),
		    hook("click", Controller.clickSubscribeEvent),
		    text("🍼")
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

function alert(state) {
    if (state.alert.text == "")
	return [];
    return elem("p", [
	cl("alert", alertClass(state.alert.type)),
	hook("click", Controller.clickAlertEvent),
	text(state.alert.text)
    ]);
}

function dialog(state) {
    return [];
}

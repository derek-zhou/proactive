import * as Controller from "./pro_controller.js";
import * as Asset from './assets.js';
import {hook, elem, text, attr, cl, div, shadow_div} from "./domfun.js";
import {intervalString} from "./items.js";

export function browse(state) {
    return shadow_div(
	[Asset.at("preflightCSS"), Asset.at("browseCSS")],
	div(cl("browser"),
	    div(cl("content"), item_view(state.currentItem, state.selection)),
	    div(cl("tablist"), tab_list(state.selection))
	   ));
}

function item_view(item, selection) {
    if (item) {
	return [
	    elem("h2", text(`A ${selection} task`)),
	    div(cl("twoside"),
		elem("label", text("Url: ")),
		elem("span", [
		    cl("value"),
		    elem("a", [attr({href: item.url, target: "_blank"}), text(item.url)])
		])),
	    div(cl("twoside"),
		elem("label", text("Last Checked: ")),
		elem("span", [
		    cl("value"),
		    text(item.lastChecked.toString())
		])),
	    div(cl("twoside"),
		elem("label", text("Check interval: ")),
		elem("span", [
		    cl("value"),
		    text(intervalString(item.checkInterval))
		])),
	    div(cl("twoside"), elem("label", text("Note to myself: "))),
	    div(cl("line"), div(cl("value"), text(item.note)))
	];
    } else if (selection == Controller.Selections.expired) {
	return elem("h2", text("You are all caught up, Yay!"));
    } else {
	return elem("h2", text(`No tasks in the selected view: ${selection}`));
    }
}

function tab_attr(tab, selected) {
    if (tab == selected)
	return attr({disabled: true, class: "tab"});
    else
	return attr({class: "tab"});
}

function tab_list(selection) {
    return [
	elem("button", [
	    tab_attr("expired", selection),
	    hook("click", Controller.clickExpiredEvent),
	    text("Expired")
	]),
	elem("button", [
	    tab_attr("daily", selection),
	    hook("click", Controller.clickDailyEvent),
	    text("Daily")
	]),
	elem("button", [
	    tab_attr("weekly", selection),
	    hook("click", Controller.clickWeeklyEvent),
	    text("Weekly")
	]),
	elem("button", [
	    tab_attr("monthly", selection),
	    hook("click", Controller.clickMonthlyEvent),
	    text("Monthly")
	]),
	elem("button", [
	    tab_attr("quarterly", selection),
	    hook("click", Controller.clickQuarterlyEvent),
	    text("Quarterly")
	]),
	elem("button", [
	    tab_attr("yearly", selection),
	    hook("click", Controller.clickYearlyEvent),
	    text("Yearly")
	])
    ];
}

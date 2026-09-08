import * as Controller from "./pro_controller.js";
import * as Asset from './assets.js';
import {hook, elem, text, attr, cl, div, shadow_div} from "./domfun.js";

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
		    elem("a", [attr({href: item.url}), text(item.url)])
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
		    text(interval_string(item.checkInterval))
		])),
	    div(cl("twoside"), elem("label", text("Note to myself: "))),
	    div(cl("line"), div(cl("value"), text(item.note)))
	];
    } else if (selection == Controller.Selections.expired) {
	return elem("h2", text("You are all caught up, Yay!"));
    } else {
	return elem("h2", text(`No tasks is the selected view: ${selection}`));
    }
}

function interval_string(interval) {
    switch (interval) {
    case 1:
	return "daily";
    case 7:
	return "weekly";
    case 30:
	return "monthly";
    case 90:
	return "quarterly";
    case 365:
	return "yearly";
    default:
	return `every ${interval} days`;
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

import * as Controller from "./pro_controller.js";
import * as Asset from './assets.js';
import {hook, elem, text, attr, cl, div, style} from "./domfun.js";

export function browse(state) {
    return div(
	style(Asset.at("preflightCSS")),
	style(Asset.at("browseCSS")),
	div(cl("content"), item_view(state.currentItem, state.selection, state.now)),
	div(cl("tablist"), tab_list(state.selection))
    );
}

function daysString(d1, d2, interval) {
    let diff = d2 - d1;
    let days = Math.round(diff / 1000 / 3600 / 24 - interval);

    if (days > 0)
	return `${days} days ago`;
    else if (days < 0)
	return `${0 - days} days later`;
    else
	return "Today";
}

function item_view(item, selection, now) {
    if (item) {
	return [
	    elem("h2", text(`Task information:`)),
	    div(
		cl("twoside"),
		elem("label", text("Url: ")),
		elem(
		    "span",
		    cl("value"),
		    elem("a", [attr({href: item.url, target: "_blank"}), text(item.url)])
		)
	    ),
	    div(
		cl("twoside"),
		elem("label", text("Checked by: ")),
		elem(
		    "span",
		    cl("value"),
		    text(daysString(item.lastChecked, now, item.checkInterval))
		)
	    ),
	    div(cl("twoside"), elem("label", text("Note to myself: "))),
	    div(cl("line"), div(cl("value"), text(item.note)))
	];
    } else if (selection == Controller.Selections.outstanding) {
	return elem("h2", text("You are all caught up, Yay!"));
    } else {
	return elem("h2", text(`No tasks in the selected view: ${selection}`));
    }
}

function tab_attr(tab, selected) {
    return tab == selected ? attr({disabled: true}) : [];
}

function tab_list(selection) {
    return [
	div(cl("filler")),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("outstanding", selection),
	    hook("click", Controller.clickOutstandingEvent),
	    text("Outstanding")
	),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("daily", selection),
	    hook("click", Controller.clickDailyEvent),
	    text("Daily")
	),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("weekly", selection),
	    hook("click", Controller.clickWeeklyEvent),
	    text("Weekly")
	),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("monthly", selection),
	    hook("click", Controller.clickMonthlyEvent),
	    text("Monthly")
	),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("quarterly", selection),
	    hook("click", Controller.clickQuarterlyEvent),
	    text("Quarterly")
	),
	elem(
	    "button",
	    cl("tab"),
	    tab_attr("yearly", selection),
	    hook("click", Controller.clickYearlyEvent),
	    text("Yearly")
	),
	div(cl("filler"))
    ];
}

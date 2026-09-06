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
    return item ? real_item(item) : dummy_item(selection);
}

function dummy_item(selection) {
    if (selection == Controller.Selections.expired) {
	return elem("h2", text("You are all caught up, Yay!"));
    } else {
	return elem("h2", text(`No tasks is the selected view: ${selection}`));
    }
}

function real_item(item) {
    return [
	div(cl("item-detail"), item_detail(item)),
	div(cl("item-toolbar"), item_toolbar())
    ];
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
	return "randomly";
    }
}

function item_detail(item) {
    return [
	div(cl("line"), elem("a", [attr({class: "url", href: item.url}), text(item.url)])),
	div(cl("line"),
	    elem("span", [cl("item-attr"), text("Last checked")]),
	    elem("span", [cl("item-value"), text(item.lastChecked.to_string())])),
	div(cl("line"),
	    elem("span", [cl("item-attr"), text("Check interval")]),
	    elem("span", [cl("item-value"), text(interval_sgtring(item.checkInterval))])),
	div(cl("line"), text("Note to myself")),
	div(cl("note"), text(item.note))
    ];
}

function item_toolbar() {
    return [
	elem("button", [
	    cl("button"),
	    hook("click", Controller.clickSnoozeEvent),
	    text("⏰")
	]),
	elem("button", [
	    cl("button"),
	    hook("click", Controller.clickEditEvent),
	    text("📃")
	]),
	elem("button", [
	    cl("button"),
	    hook("click", Controller.clickTrashEvent),
	    text("🗑 ")
	])
    ];
}

function tab_attr(tab, selected) {
    if (tab == selected)
	return attr({disabled: true, class: "tab selected"});
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

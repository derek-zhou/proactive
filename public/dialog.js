import * as Controller from "./pro_controller.js";
import * as Asset from './assets.js';
import {hook, elem, text, attr, cl, div, shadow_div} from "./domfun.js";
import {intervalString, IntervalChoices} from "./items.js";

export function dialog(state) {
    switch (state.screen) {
    case Controller.Screens.edit:
	return edit_dialog(state.template);
    case Controller.Screens.trash:
	return trash_dialog(state.currentItem);
    case Controller.Screens.shutdown:
	return reload_dialog();
    default:
	return [];
    }
}

function reload_dialog() {
    return custom_form(
	Controller.clickReloadEvent,
	null,
	"Proactive is shut down",
	[elem("p", text("Proactive is shut down. Reload?"))]
    );
}

function trash_dialog(item) {
    return custom_form(
	Controller.submitRemoveEvent,
	Controller.resetDialogEvent,
	"Are you sure you want to delete this item?",
	[
	    div(cl("twoside"),
		elem("label", text("URL: ")),
		elem("span", [
		    cl("value"),
		    text(item.url)
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
	]
    );
}

function check_interval_options(default_value) {
    let choices = IntervalChoices.map((i) => ({value: i, text: intervalString(i)}));
    return build_options(choices, default_value);
}

function default_url(template) {
    if (template.url)
	return template.url;
    else
	return "";
}

function default_check_interval(template) {
    if (template.checkInterval)
	return template.checkInterval;
    else
	return 7;
}

function default_note(template) {
    if (template.note)
	return template.note;
    else
	return "";
}

function edit_title(template) {
    if (template.id)
	return "Modifying a task";
    else
	return "Adding a task";
}

function edit_dialog(template) {
    return custom_form(
	Controller.submitEditEvent,
	Controller.resetDialogEvent,
	edit_title(template),
	[
	    div(cl("twoside"),
		elem("label", text("URL: ")),
		elem("input", [
		    attr({type: "text", name: "url",
		      value: default_url(template), class:"long"})
		])
	       ),
	    div(cl("twoside"),
		elem("label", text("Check interval:")),
		elem("select", [
		    attr({name: "checkInterval"}),
		    check_interval_options(default_check_interval(template))
		])
	       ),
	    div(cl("twoside"), elem("label", text("Note to myself: "))),
	    div(cl("line"),
		elem("textarea", [
		    attr({name: "note"}),
		    text(default_note(template))
		])
	       )
	]
    );
}

function build_options(options, default_value) {
    return options.map((each) =>
	elem("option", [
	    attr({value: each.value}),
	    each.value == default_value ? attr({selected: true}) : [],
	    text(each.text)
	])
    );
}

function custom_form(submit_action, reset_action, title, inner) {
    return shadow_div(
	[Asset.at("preflightCSS"), Asset.at("dialogCSS")],
	elem("form", [
	    hook("submit", submit_action),
	    reset_action ? hook("reset", reset_action) : [],
	    elem("h2", text(title)),
	    elem("section", inner),
	    div(cl("toolbar"),
		submit_button(),
		reset_action ? reset_button() : [])
	])
    );
}

function submit_button() {
    return elem("input", [attr({type: "submit", value: "👌", class: "button"})]);
}

function reset_button() {
    return elem("input", [attr({type: "reset", value: "👎", class: "button"})]);
}

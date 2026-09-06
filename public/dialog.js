import * as Controller from "./pro_controller.js";
import * as Asset from './assets.js';
import {hook, elem, text, attr, cl, div, shadow_div} from "./domfun.js";

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
    return custom_form(Controller.clickReloadEvent, null, [
	elem("p", text("Proactive is shut down. Reload?"))
    ]);
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

function trash_dialog(item) {
    return custom_form(Controller.submitRemoveEvent, Controller.resetDialogEvent, [
	elem("p", [
	    cl("line"),
	    text("Are you sure you want to delete this item?")
	]),
	div(cl("field", "long"),
	    elem("label", [
		text("URL: "),
		elem("span", [
		    cl("focus"),
		    text(item.url)
		])
	    ])),
	div(cl("field", "long"),
	    elem("label", [
		text("Last checked: "),
		elem("span", [
		    cl("focus"),
		    text(item.lastChecked.to_string())
		])
	    ])),
	div(cl("field", "long"),
	    elem("label", [
		text("Check interval: "),
		elem("span", [
		    cl("focus"),
		    text(interval_string(item.checkInterval))
		])
	    ]))
    ]);
}

function check_interval_options(default_value) {
    return build_options([
	{value: 1, text: "daily"},
	{value: 7, text: "weekly"},
	{value: 30, text: "monthly"},
	{value: 90, text: "quarterly"},
	{value: 365, text: "yearly"}
    ], default_value);
}

function default_url(template) {
    if (template)
	return template.url;
    else
	return "https://example.com";
}

function default_check_interval(template) {
    if (template)
	return template.checkInterval;
    else
	return 7;
}

function default_note(template) {
    if (template)
	return template.note;
    else
	return "";
}

function edit_dialog(template) {
    return custom_form(Controller.submitEditEvent, Controller.resetDialogEvent, [
	div(cl("field", "long"),
	    elem("label", [
		text("URL: "),
		elem("input", [
		    attr({type: "text", name: "url",
			  value: default_url(template), class:"short"})
		])
	    ])),
	div(cl("field", "long"),
	    elem("label", [
		text("Check interval:"),
		elem("select", [
		    attr({name: "checkInterval"}),
		    check_interval_options(default_check_interval(template))
		])
	    ])),
	div(cl("field", "long"),
	    elem("label", [
		text("Note to myself: "),
		elem("textarea", [
		    attr({name: "note"}),
		    text(default_note(template))
		])
	    ]))
    ]);
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

function custom_form(submit_action, reset_action, inner) {
    return shadow_div(
	[Asset.at("preflightCSS"), Asset.at("dialogCSS")],
	elem("form", [
	    hook("submit", submit_action),
	    reset_action ? hook("reset", reset_action) : [],
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

import '../css/tailwind.css';

import { basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { basicDark } from "@fsegurai/codemirror-theme-bundle";
import { safeEval } from './main.js';
import $ from "jquery"
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";

let view = new EditorView({
    extensions: [basicSetup, keymap.of(indentWithTab), javascript(), basicDark],
    parent: $("#editor")[0]
})
const code = `// Code Example
const amICool = true

if (amICool) {
    console.log("I am very cool!")
}
else {
    console.log("I am not very cool :(")
}
`

view.dispatch({
    changes: {
        from: 0, to: view.state.doc.length, insert: code
    }
});

$("#run").on("click", () => {
    const content = view.state.doc.toString()
    $("#output").text("")
    for (const log of safeEval(content, null).logs) {
        $("#output").append($("<span/>").text(log))
    }
})
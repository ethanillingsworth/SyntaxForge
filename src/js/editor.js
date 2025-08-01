import '../css/tailwind.css';


import { Editor } from './main.js';
import $ from "jquery"



const code = `// Code Example
const amICool = true

if (amICool) {
    console.log("I am very cool!")
}
else {
    console.log("I am not very cool :(")
}
`

// Load saved code from localStorage or use default
const savedCode = localStorage.getItem('playground-code') || code;

const editor = new Editor($("#editor"), savedCode)

// Save code to localStorage whenever it changes
let saveTimeout;
editor.view.dom.addEventListener('input', () => {
    // Debounce saving to avoid excessive localStorage writes
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const currentCode = editor.getContent();
        localStorage.setItem('playground-code', currentCode);
    }, 500); 
});

// Also save when run button is clicked
editor.runButton.on("click", () => {
    const currentCode = editor.getContent();
    localStorage.setItem('playground-code', currentCode);
});



// $("#run").on("click", () => {
//     const content = view.state.doc.toString()
//     $("#output").text("")
//     for (const log of safeEval(content, null).logs) {
//         $("#output").append($("<span/>").text(log))
//     }
// })
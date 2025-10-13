

import '../css/tailwind.css';
import { Editor } from './main.js';
import { initializeApp, CodeExecutor, StorageUtils } from './utils/common.js';
import $ from "jquery";

// Initialize common app functionality
initializeApp();

const defaultCode = `// Welcome to SyntaxForge Playground!
const amICool = true

if (amICool) {
    console.log("I am very cool!")
} else {
    console.log("I am not very cool :(")
}

// Try editing this code!
const skills = ["JavaScript", "Python", "Ruby"]
console.log("My skills:", skills.join(", "))`;

// Load saved code from localStorage or use default
const savedCode = StorageUtils.load('playground-code', defaultCode);

const editor = new Editor($("#editor"), savedCode);
const codeExecutor = new CodeExecutor(editor);

// Enhanced run button functionality with better feedback
editor.runButton.off('click'); // Remove default handler
editor.runButton.on("click", () => {
    const currentCode = editor.getContent();
    StorageUtils.save('playground-code', currentCode);
    
    // Use the common code executor
    codeExecutor.execute(currentCode);
});



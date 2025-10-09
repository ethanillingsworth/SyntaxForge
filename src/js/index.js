import '../css/tailwind.css'

import { Editor } from './main.js';
import { initMobileMenu } from './mobile-menu.js';
import $ from "jquery"

// Initialize mobile menu
initMobileMenu();

const code = `// Code Example
const amICool = true

if (amICool) {
    console.log("I am very cool!")
}
else {
    console.log("I am not very cool :(")
}
`

const editor = new Editor($("#editor"), code)


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

const editor = new Editor($("#editor"), code)




// $("#run").on("click", () => {
//     const content = view.state.doc.toString()
//     $("#output").text("")
//     for (const log of safeEval(content, null).logs) {
//         $("#output").append($("<span/>").text(log))
//     }
// })
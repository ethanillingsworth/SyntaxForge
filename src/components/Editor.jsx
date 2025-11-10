import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import Terminal from "./Terminal";
import { useState } from "react";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function Editor({ className, windowed = false, windowTitle = "main.js", runBehavior = () => { } }) {
    const [lines, setLines] = useState([<span className="text-yellow-400">SyntaxForge Terminal v1</span>])

    function addLine(line) {
        lines.push(line)
        setLines(line)
    }


    const def = `// Welcome to SyntaxForge!
const amICool = true

if (amICool) {
    console.log("I am very cool!")
} else {
    console.log("I am not very cool :(")
}

// Try editing this code!
const skills = ["JavaScript", "Python", "Ruby"]
console.log("My skills:", skills.join(", "))

// Click "Run Code" to see the magic! ✨`


    return (
        <div className={`col gap-0 w-full h-full ${className} rounded-2xl overflow-hidden`}>
            {windowed ? <div className="row gap-2 p-3 place-items-center border-b border-forge-accent/20 bg-forge-surface">
                <div className="rounded-full w-3 h-3 bg-red-500"></div>
                <div className="rounded-full w-3 h-3 bg-yellow-500"></div>
                <div className="rounded-full w-3 h-3 bg-green-500"></div>

                <span className="text-forge-subtext">{windowTitle}</span>

            </div> : null}
            <div className="flex h-full w-full">

                <div className={`col w-full gap-0 ${windowed ? "h-96" : "h-full"}`}>

                    <CodeMirror
                        className="flex-1 overflow-auto border-forge-accent/20 border-r"
                        value={def}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                    />
                    <div className="p-2 border-t border-forge-accent/20 bg-forge-surface flex">
                        <button className="p-1 px-4 ml-auto" onClick={runBehavior}>
                            Run Code
                        </button>
                    </div>

                </div>



                <Terminal lines={lines} />


            </div>
        </div>
    );
}
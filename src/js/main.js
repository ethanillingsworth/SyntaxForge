// Firebase funcs
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

// DOM libs
import '../css/tailwind.css';
import $ from "jquery"

// Code Editor stuff
import { basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { basicDark } from "@fsegurai/codemirror-theme-bundle";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";

// Load JSON data
const lessons = await (await fetch("/data/lessons.json")).json() || {}
const courses = await (await fetch("/data/courses.json")).json() || {}



export class User {
    constructor(uid) {
        this.uid = uid
    }

    async get() {
        if (this.uid == "nouser") {
            return {}
        }
        const r = await getDoc(doc(db, `public/${this.uid}`))

        if (r.exists()) {
            return r.data()
        }
        else {
            return {}
        }
    }

    async admin() {

        if (this.uid == "nouser") {
            return false
        }

        const r = await getDoc(doc(db, `adminOnly/${this.uid}`))

        if (r.exists()) {
            return r.data().admin
        }

        return false

    }

    async update(data) {
        if (this.uid == "nouser") {
            return
        }
        await setDoc(doc(db, `public/${this.uid}`), data, { merge: true })
    }

    static async create(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                if (user) {
                    setDoc(doc(db, `public/${user.uid}`), {
                        uid: user.uid,
                        // username: username
                    })
                    setDoc(doc(db, `private/${user.uid}`), {
                        email: email
                    })
                }

                // ...
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }
}

export class Lesson {
    constructor(id) {
        this.id = id
    }

    async get() {

        return lessons[this.id] || {}
    }
}

export class Course {
    constructor(id) {
        this.id = id
    }

    async getLessons() {
        const filtered = Object.entries(lessons)
            .filter(([key, lesson]) => lesson.parent === this.id)
            .sort((a, b) => {
                const idA = parseInt(a[1].id)
                const idB = parseInt(b[1].id)
                return idA - idB
            })

        const l = filtered.map(([key]) => new Lesson(key))
        return l
    }

    static async getAll() {
        return Object.keys(courses).map((id) => { return new Course(id) })
    }

    async getLessonID(num) {
        const match = Object.entries(lessons)
            .find(
                ([key, lesson]) => lesson.parent === this.id && lesson.id === num
            )

        return match ? match[0] : null
    }

    async get() {
        return courses[this.id] || {}
    }

    async display(id = "nouser") {

        const userData = await new User(id).get()

        const data = await this.get()

        const link = $("<a/>").addClass("card").attr("href", `/course/${this.id}`)
        const name = $("<h3/>").text(data.name)
        const desc = $("<p/>").text(data.desc)
        const progress = $("<progress/>").attr("max", 100).val(0)


        let num = 0;
        let percent = 0
        if (Object.keys(data).length > 0) {
            const l = await this.getLessons()
            const total = l.length

            for (const lesson of l) {
                if (userData && userData.lessons && userData.lessons[lesson.id] && userData.lessons[lesson.id].finished) {
                    $(`#${lesson.id}`).addClass("gradient-bg")
                    num++
                }
            }

            percent = Math.round((num / total) * 100) || 0
            progress.val(percent)

        }
        link.append(name, desc, progress)
        let on = $("#yours")
        if (percent == 0) {
            on = $("#avail")
        }
        $(on).append(link)


    }
}


export class Editor {
    constructor(parent = $("#editor"), defaultCode = "") {
        this.wrapper = $("<div>").addClass("editor row gap-0")

        this.col = $("<div/>").addClass("col h-full w-full gap-0 place-content-start place-items-start")

        this.buttons = $("<div/>").addClass("row w-full bg-forge-surface p-2 place-content-end border-t-2 border-t-forge-accent text-sm")

        this.buttonsBack = $("<div/>").addClass("row mr-auto")

        this.buttons.append(this.buttonsBack)

        this.terminal = $("<div/>").addClass("terminal").text("SyntaxForge Terminal v1.0.0")

        this.wrapper.append(this.col, this.terminal)

        this.view = new EditorView({
            extensions: [basicSetup, keymap.of(indentWithTab), javascript(), basicDark],
            parent: this.col[0]
        })

        this.fontSize = $("<select/>").html(`
            <option>10px</option>
            <option>12px</option>
            <option>14px</option>
            <option selected>16px</option>
            <option>18px</option>
            <option>20px</option>`).addClass("muted")
        
        const editorSize = localStorage.getItem("editorSize") || "16px"
        
        this.fontSize.val(editorSize)
        
        this.fontSize.on("change", () => {
            $(".cm-editor").css("font-size", this.fontSize.val())
            localStorage.setItem("editorSize", this.fontSize.val())
        })

        this.runButton = $("<button/>").text("Run Code")

        this.runButton.on("click", () => {
            this.terminal.text("")
            for (const log of this.safeEval(this.getContent()).logs) {
                this.terminal.append($("<span/>").text(log))
            }
            this.terminal.scrollTop(this.terminal.get(0).scrollHeight)
        })

        this.addCustomButton(this.runButton)
        this.addCustomButton(this.fontSize, true)


        this.col.append(this.buttons)

        this.setContent(defaultCode)

        parent.append(this.wrapper)
        $(".cm-editor").css("font-size", editorSize)
        
    }

    disableTerminal() {
        this.terminal.addClass("hidden")
    }

    enableTerminal() {
        this.terminal.removeClass("hidden")
    }


    addCustomButton(e, back=false) {
        if (back) {
            this.buttonsBack.append(e)
        }
        else {
            this.buttons.append(e)
        }
    }

    safeEval(input, test=null) {

        let logs = []

        var console = {
            log: function (text) {
                logs.push(text)
            }
        }
        var window = function () { }
        var document = function () { }
        var editor = function () { }
        var print = function () { }

        const a = function () { return eval(input + (test || "")) }


        // Return the eval'd result
        return { res: a(), logs: logs };

    }

    getContent() {
        return this.view.state.doc.toString();
    }

    setContent(code) {
        this.view.dispatch({
            changes: {
                from: 0, to: this.view.state.doc.length, insert: code
            }
        });
    }
}

export function safeEval() {}

onAuthStateChanged(auth, (user) => {
    if (user) {
        $("#login").addClass("hidden")
    }
})
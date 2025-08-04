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
import { Prec } from "@codemirror/state";

// Load JSON data
const lessons = await (await fetch("/data/lessons.json")).json() || {}
const courses = await (await fetch("/data/courses.json")).json() || {}


/**
* Creates a new user object
*
* @param {string} uid - User's unique id
* @returns {User} The new User object
*
* @example
* const user = new User("nouser")
* const user = new User("ejnf24h24ufn2")
*/
export class User {
    constructor(uid) {
        this.uid = uid
    }

    /**
    * Get the users public data from firebase
    *
    * @returns {object} The data returned in the form of a dict
    *
    * @example
    * const data = user.get() // returns {} if user.uid == "nouser" or data not found
    * const data = user.get() // returns data if found
    */
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
    /**
    * Check if a user is an admin or not
    *
    * @returns {boolean} True if admin, false if not
    *
    * @example
    * const admin = user.admin() // true or false
    */
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
    /**
    * Add data to users public directory
    * 
    * @param {object} data - Data to add users public dir
    *
    * @returns {null}
    *
    * @example
    * user.update({"name": "test"}) // adds "name": "test" to public
    */
    async update(data) {
        if (this.uid == "nouser") {
            return
        }
        await setDoc(doc(db, `public/${this.uid}`), data, { merge: true })
    }
    /**
    * Creates a new user
    * 
    * @param {string} email - Users email
    * @param {string} password - Users password
    *
    * @returns {null}
    *
    * @example
    * User.create("sample@syntaxforge.dev", "1234") // Creates user
    */
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
/**
* Creates a new lesson object
* 
* @param {string} id - Lesson id (from lessons.json)
*
* @returns {Lesson} - Lesson object created
*
* @example
* const lesson = new Lesson("zXtKRwB1rw4XMRXcE5Fn")
*/
export class Lesson {
    constructor(id) {
        this.id = id
    }
    /**
    * Returns Lesson data
    *
    * @returns {object} - Lesson data or {}
    *
    * @example
    * const lessonData = lesson.get()
    */
    async get() {

        return lessons[this.id] || {}
    }
}
/**
* Creates a new course object
* 
* @param {string} id - Course id (from courses.json)
*
* @returns {Course} - Course object created
*
* @example
* const course = new Course("js101")
*/
export class Course {
    constructor(id) {
        this.id = id
    }
    /**
    * Get all lessons with this course as a parent
    *
    * @returns {Lesson[]} - Sorted list of lessons by id in ascending order
    *
    * @example
    * course.getLessons() // [Lesson1, Lesson2]
    */
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
    /**
    * Get all courses in courses.json
    *
    * @returns {Course[]} - List of courses
    *
    * @example
    * Course.getAll() // [Course1, Course2]
    */
    static async getAll() {
        return Object.keys(courses).map((id) => { return new Course(id) })
    }
    /**
    * Get a lesson from an index number
    * 
    * @param {string} num - Index number
    *
    * @returns {Lesson} - Lesson from course
    *
    * @example
    * course.getLessonID(4) // Will get the lesson with index 4 under this course
    */
    async getLessonID(num) {
        const match = Object.entries(lessons)
            .find(
                ([key, lesson]) => lesson.parent === this.id && lesson.id === num
            )

        return match ? match[0] : null
    }
    /**
    * Returns Course data
    *
    * @returns {object} - Course data or {}
    *
    * @example
    * const courseData = course.get()
    */
    async get() {
        return courses[this.id] || {}
    }
    /**
    * Displays course info on /courses
    * 
    * @param {string} id - Id of the user to check for where to display courses
    *
    * @returns {object} - Course data or {}
    *
    * @example
    * Course.display("SOMEUSERID")
    * Course.display() // for a user logged out
    */
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

/**
* Creates a new editor object
* 
* @param {JQuery.<HTMLElement>} [parent = $("#editor")] - Element to place editor on
* @param {string} [defaultCode = ""] - Element to place editor on
*
* @returns {Editor} - New editor object
*
* @example
* const editor = new Editor()
* const editor = new Editor($("#SOMEELEMENT")) // with parent
* const editor = new Editor($("#SOMEELEMENT"), SOMECODEVAR) // with parent & default code
*/
export class Editor {
    constructor(parent = $("#editor"), defaultCode = "") {
        this.wrapper = $("<div>").addClass("editor gap-0")

        this.col = $("<div/>").addClass("col h-full w-full gap-0 place-content-start place-items-start")

        this.buttons = $("<div/>").addClass("row w-full bg-forge-surface p-2 place-content-end border-t-2 border-t-forge-accent text-sm")

        this.buttonsBack = $("<div/>").addClass("row mr-auto")

        this.buttons.append(this.buttonsBack)

        this.terminal = $("<div/>").addClass("terminal order-last md:order-none").text("SyntaxForge Terminal v1.0.0")

        this.wrapper.append(this.col, this.terminal)

        this.view = new EditorView({
            extensions: [
                basicSetup,
                javascript(),
                basicDark,
                Prec.highest(
                    keymap.of([
                        indentWithTab,
                        {
                            key: "Mod-Enter",
                            run: () => {
                            console.log("Mod-Enter triggered");
                            this.runButton.trigger("click");
                            return true;
                            }
                        }
                    ])
                )
            ],
            parent: this.col[0]
        });


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

        $(document).on('keypress', (e) => {
            if (e.ctrlKey && e.key == "Enter") {
                this.runButton.trigger("click")
            }
        });
        
    }
    /**
    * Disables the editors terminal
    * 
    * @example
    * editor.disableTerminal() // Terminal gets hidden
    */
    disableTerminal() {
        this.terminal.addClass("hidden")
    }
    /**
    * Enables the editors terminal
    * 
    * @example
    * editor.enableTerminal() // Terminal gets unhidden
    */
    enableTerminal() {
        this.terminal.removeClass("hidden")
    }

    /**
    * Adds an element to the editors buttons
    * 
    * @param {JQuery.<HTMLElement>} e - Element to add
    * @param {boolean} [back = false] - Place on the backside or frontside
    *
    * @example
    * editor.addCustomButton($("#SOMEELMT"))
    * editor.addCustomButton($("#SOMEELMT"), true) // adds to other side
    */
    addCustomButton(e, back=false) {
        if (back) {
            this.buttonsBack.append(e)
        }
        else {
            this.buttons.append(e)
        }
    }
    /**
    * Safely evaluate users js on the frontend with a test case added if wanted
    * 
    * @param {string} input - Code to test
    * @param {string} [test = null] - Test case or null for none
    *
    * @example
    * editor.saveEval(editor.getContent()) // tests current content
    * editor.saveEval(editor.getContent(), ";test == true") // tests current content with test case
    */
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
    /**
    * Gets the editors current content
    * 
    * @returns {string} - Editors current content
    * 
    * @example
    * editor.getContent() // "Some string"
    */
    getContent() {
        return this.view.state.doc.toString();
    }
    /**
    * Sets editor content to a piece of code
    * 
    * @param {code} input - Code to set content to
    *
    * @example
    * editor.setContent("// This is some codes")
    */
    setContent(code) {
        this.view.dispatch({
            changes: {
                from: 0, to: this.view.state.doc.length, insert: code
            }
        });
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        $("#login").addClass("hidden")
    }
})
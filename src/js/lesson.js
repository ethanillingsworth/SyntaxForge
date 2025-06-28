import { Course, Lesson, User } from "./main.js";
import $ from "jquery"
import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { basicDark } from "@fsegurai/codemirror-theme-bundle";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";



let view = new EditorView({
    extensions: [basicSetup, javascript(), basicDark],
    parent: $("#edit")[0]
})


const pathParts = window.location.pathname.split('/');
const lessonId = pathParts[pathParts.length - 1];

const lesson = new Lesson(lessonId)

let currentUser;
let admin = false

let raw;

onAuthStateChanged(auth, async () => {
    currentUser = new User(auth.currentUser.uid)
    admin = await currentUser.admin()

    const dat = await currentUser.get()

    if (dat.lessons && dat.lessons[lesson.id]) {
        const saveData = dat.lessons[lesson.id]
        // update editor
        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: saveData.code }
        });

        // update tasks
        for (let num = 0; num < saveData.checks.length; num++) {
            const val = saveData.checks[num];
            if (val) {
                $(`#task-${num}`).attr("checked", true)
            }
            else {
                $(`#task-${num}`).removeAttr("checked")
            }
        }

        // if complete show next button

        if (saveData.finished) {
            $("#next").removeClass("hidden")
        }


    }

    $("#run").on("click", () => {
        runUserCode()

    })

    function safeEval(input, test) {


        var console = function () { }
        var window = function () { }
        var document = function () { }
        var editor = function () { }

        const a = function () { return eval(input + test) }


        // Return the eval'd result
        return a();

    }

    function runUserCode() {
        const content = view.state.doc.toString()
        let count = 0;
        let checks = []
        let finished = false
        for (let index = 0; index < data.tasks.length; index++) {
            const test = data.tasks[index]
            try {
                const res = safeEval(content, ';' + test.check)
                if (res == true) {
                    $(`#task-${index}`).attr("checked", true)
                    count++
                    checks.push(true)
                }
                else {
                    $(`#task-${index}`).removeAttr("checked")
                    checks.push(false)
                }

                if (count == data.tasks.length) {
                    $("#next").removeClass("hidden")
                    finished = true
                }
                else {
                    $("#next").addClass("hidden")
                }
            }
            catch {

            }
        }

        currentUser.update({
            lessons: {
                [lesson.id]: {
                    code: content,
                    checks: checks,
                    finished: finished,
                }
            }
        })
    }
})

const editorSize = localStorage.getItem("editorSize") || "16px"

$("#fontsize").val(editorSize)

$(".cm-editor").css("font-size", editorSize)

$("#fontsize").on("change", () => {
    $(".cm-editor").css("font-size", $("#fontsize").val())
    localStorage.setItem("editorSize", $("#fontsize").val())
})

let editing = false;

$("#title").on("click", async () => {
    if (admin) {
        if (editing == false) {
            $("#rendered").addClass("hidden")
            $("#raw").removeClass("hidden")
            editing = true
        }
        else {
            editing = false
            raw = $("#raw").val()
            $("#rendered").html(raw)
            $("#rendered").removeClass("hidden")
            $("#raw").addClass("hidden")

            await lesson.update({ content: raw })
        }
    }

})

const data = await lesson.get()

$("#rendered").html(data.content)

$("#raw").val(data.content)

$("#title").text(data.title)

raw = data.content
const parent = new Course(data.parent)

document.title = `SyntaxForge - ${data.title}`

$("#next").on("click", async () => {
    const nextLesson = await parent.getLessonID(data.id + 1)

    if (nextLesson == null) {
        window.location.href = "/course/" + parent.id
    }
    else {
        window.location.href = "/lesson/" + nextLesson
    }
})

for (let index = 0; index < data.tasks.length; index++) {
    const test = data.tasks[index]

    const task = $("<div/>").addClass("card row place-content-start").addClass("w-full nohover")
    const checkbox = $("<input/>").attr("type", "checkbox").attr("id", `task-${index}`).attr("disabled", true)
    const text = $("<h3/>").text(test.text)

    task.append(checkbox, text)

    $("#tasks").append(task)

}




function setupResizer() {
    const resizer = $('#resizer');
    const left = $('#content');
    const right = $('#editor');
    const container = resizer.parent();
    let isDragging = false;

    resizer.on('mousedown', function (e) {
        e.preventDefault();
        isDragging = true;
        $('body').css('cursor', 'col-resize');
    });

    $(document).on('mousemove', function (e) {
        if (!isDragging) return;

        const containerWidth = container.width();
        const newLeftWidth = e.clientX - container.offset().left;
        const resizerWidth = resizer.outerWidth();
        const newRightWidth = containerWidth - newLeftWidth - resizerWidth;

        left.css('width', newLeftWidth + 'px');
        right.css('width', newRightWidth + 'px');
    });

    $(document).on('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            $('body').css('cursor', 'default');
        }
    });
}

setupResizer()
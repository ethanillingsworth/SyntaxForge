import { Course, Lesson, safeEval, User } from "./main.js";
import $ from "jquery"
import { basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { basicDark } from "@fsegurai/codemirror-theme-bundle";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";



let view = new EditorView({
    extensions: [basicSetup, keymap.of(indentWithTab), javascript(), basicDark],

    parent: $("#edit")[0]

})


const pathParts = window.location.pathname.split('/');
const lessonId = pathParts[pathParts.length - 1];

const lesson = new Lesson(lessonId)

let currentUser;
let admin = false

let raw;

onAuthStateChanged(auth, async () => {
    const cu = auth.currentUser
    let id;

    if (cu) {
        id = cu.uid
    }
    else {
        id = "nouser"
        const returnToLogin = !confirm("Progress will not be saved unless you are logged in\nOK - Contiune without saving\nCANCEL - Take me to the login page")

        if (returnToLogin) {
            window.location.href = "/login"
        }
    }

    currentUser = new User(id)
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


    function runUserCode() {
        const content = view.state.doc.toString()
        let count = 0;
        let checks = []
        let finished = false
        for (let index = 0; index < data.tasks.length; index++) {
            const test = data.tasks[index]
            try {
                const res = safeEval(content, ';' + test.check).res
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

if (data.default) {
    view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: data.default }
    });

}

raw = data.content
const parent = new Course(data.parent)

const parentData = await parent.get()

$("#parent").text(parentData.name).attr("href", "/course/" + parent.id)
document.title = `SyntaxForge | ${parentData.name}/${data.title}`

$("#next").on("click", async () => {
    const nextLesson = await parent.getLessonID(data.id + 1)

    if (nextLesson == null) {
        window.location.href = "/course/" + parent.id
    }
    else {
        window.location.href = "/lesson/" + nextLesson
    }
})

if (data.tasks) {
    for (let index = 0; index < data.tasks.length; index++) {
        const test = data.tasks[index]

        const task = $("<div/>").addClass("card row place-content-start").addClass("w-full nohover")
        const checkbox = $("<input/>").attr("type", "checkbox").attr("id", `task-${index}`).attr("disabled", true)
        const text = $("<h3/>").text(test.text)

        task.append(checkbox, text)

        $("#tasks").append(task)

    }
}

// window.Lesson = lesson




function setupResizer() {
    const resizer = $('#resizer');
    const left = $('#content');
    const right = $('#editor');
    const container = resizer.parent();
    let isDragging = false;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    resizer.on('mousedown touchstart', function (e) {
        e.preventDefault();
        isDragging = true;
        $('body').css('cursor', isMobile ? 'row-resize' : 'col-resize');
    });

    $(document).on('mousemove touchmove', function (e) {
        if (!isDragging) return;

        let clientX, clientY;
        if (e.type.startsWith('touch')) {
            clientX = e.originalEvent.touches[0].clientX;
            clientY = e.originalEvent.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (isMobile) {
            // Vertical resizing on mobile
            const containerHeight = container.height();
            const newTopHeight = clientY - container.offset().top;
            const resizerHeight = resizer.outerHeight();
            const newBottomHeight = containerHeight - newTopHeight - resizerHeight;

            left.css('height', newTopHeight + 'px');
            right.css('height', newBottomHeight + 'px');
        } else {
            // Horizontal resizing on desktop
            const containerWidth = container.width();
            const newLeftWidth = clientX - container.offset().left;
            const resizerWidth = resizer.outerWidth();
            const newRightWidth = containerWidth - newLeftWidth - resizerWidth;

            left.css('width', newLeftWidth + 'px');
            right.css('width', newRightWidth + 'px');
        }
    });

    $(document).on('mouseup touchend', function () {
        if (isDragging) {
            isDragging = false;
            $('body').css('cursor', 'default');
        }
    });
}


setupResizer()
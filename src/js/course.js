import { onAuthStateChanged } from "firebase/auth";
import { Course, User } from "./main.js";
import $ from "jquery"
import { auth } from "./firebase.js";

const pathParts = window.location.pathname.split('/');
const courseId = pathParts[pathParts.length - 1];

const course = new Course(courseId)

const data = await course.get()

document.title = `SyntaxForge | ${data.name}`

$("#name").text(data.name)
$("#desc").text(data.desc)


const lessons = await course.getLessons()

for (const lesson of lessons) {
    const ldata = await lesson.get()

    const card = $("<a/>").attr("href", `/lesson/${lesson.id}`).addClass("card w-full").attr("id", lesson.id)

    const title = $("<h3/>").text(ldata.title).addClass("text-center")

    card.append(title)

    $("#lessons").append(card)

}

onAuthStateChanged(auth, async () => {
    const cu = auth.currentUser
    let id;

    if (cu) {
        id = cu.uid
    }
    else {
        id = "nouser"
    }

    const user = new User(id)

    const dat = await user.get()

    let num = 0;
    if (Object.keys(dat).length > 0) {
        const lessons = await course.getLessons()
        const total = lessons.length

        for (const lesson of lessons) {
            if (dat.lessons[lesson.id] && dat.lessons[lesson.id].finished) {
                $(`#${lesson.id}`).addClass("gradient-bg")
                num++
            }
        }


        let percent = Math.round((num / total) * 100) || 0
        $("#pbar").val(percent)

        if (percent == 0) {
            $("#per").text("Not started")
        }
        else if (percent == 100) {
            $("#per").text("DONE!")
        }
        else {
            $("#per").text(`${percent}% Done`)
        }
    }
    else {
        $("#per").text("Not started")
    }


})


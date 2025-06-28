import { onAuthStateChanged } from "firebase/auth";
import { Course, User } from "./main.js";
import $ from "jquery"
import { auth } from "./firebase.js";

const pathParts = window.location.pathname.split('/');
const courseId = pathParts[pathParts.length - 1];

const course = new Course(courseId)

const data = await course.get()

document.title = `SyntaxForge - ${data.name}`

$("#name").text(data.name)
$("#desc").text(data.desc)


const lessons = await course.getLessons()

for (const lesson of lessons) {
    const ldata = await lesson.get()

    const card = $("<a/>").attr("href", `/lesson/${lesson.id}`).addClass("card w-full").attr("id", lesson.id)

    const title = $("<h3/>").text(ldata.title).addClass("text-2xl text-center")

    card.append(title)

    $("#lessons").append(card)

}

onAuthStateChanged(auth, async () => {
    const user = new User(auth.currentUser.uid)

    const dat = await user.get()

    let num = 0;

    const total = Object.keys(dat.lessons).length

    for (const key of Object.keys(dat.lessons)) {
        if (dat.lessons[key].finished) {
            $(`#${key}`).addClass("gradient-bg")
            num++
        }
    }

    let percent = Math.round((num / total) * 100)
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


})

// $("#pbar").val(data.value)

// if (data.value == 0) {
//     $("#per").text("Not started")
// }
// else if (data.value == 100) {
//     $("#per").text("DONE!")
// }
// else {
//     $("#per").text(`${data.value}% Done`)
// }


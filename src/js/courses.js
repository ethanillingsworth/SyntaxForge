import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { Course, User } from "./main.js";
import $ from "jquery"
const courses = await Course.getAll()

onAuthStateChanged(auth, async () => {
    const cu = auth.currentUser
    let id;
    if (cu) {
        id = cu.uid
    }
    else {
        id = "nouser"
    }

    for (const course of courses) {

        await course.display(id)
    }
})
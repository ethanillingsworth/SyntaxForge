import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { Course, User } from "./main.js";

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

    const userData = await new User(id).get()
    for (const course of courses) {
        await course.display(userData)
    }
})
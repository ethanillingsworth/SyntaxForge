import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { Course, User } from "./main.js";

const courses = await Course.getAll()

onAuthStateChanged(auth, async () => {
    const userData = await new User(auth.currentUser.uid).get()
    for (const course of courses) {
        await course.display(userData)
    }
})
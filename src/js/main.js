import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import '../css/tailwind.css';
import $ from "jquery"



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

    async display(userData, on = "#avail") {

        const data = await this.get()

        const link = $("<a/>").addClass("card").attr("href", `/course/${this.id}`)
        const name = $("<h3/>").text(data.name)
        const desc = $("<p/>").text(data.desc)
        const progress = $("<progress/>").attr("max", 100).val(0)


        let num = 0;
        if (Object.keys(data).length > 0) {
            const l = await this.getLessons()
            const total = l.length

            for (const lesson of l) {
                if (userData.lessons[lesson.id] && userData.lessons[lesson.id].finished) {
                    $(`#${lesson.id}`).addClass("gradient-bg")
                    num++
                }
            }

            let percent = Math.round((num / total) * 100)
            progress.val(percent)

        }
        link.append(name, desc, progress)

        $(on).append(link)


    }
}

export function safeEval(input, test) {

    let logs = []

    var console = {
        log: function (text) {
            logs.push(text)
        }
    }
    var window = function () { }
    var document = function () { }
    var editor = function () { }

    const a = function () { return eval(input + (test || "")) }


    // Return the eval'd result
    return { res: a(), logs: logs };

}

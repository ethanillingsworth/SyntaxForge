import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import '../css/tailwind.css';
import $ from "jquery"

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

    static async create(email, password, username) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                if (user) {
                    setDoc(doc(db, `public/${user.uid}`), {
                        uid: user.uid,
                        username: username
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

    async update(data) {
        await setDoc(doc(db, `lessons/${this.id}`), data, { merge: true })
    }

    async get() {
        const r = await getDoc(doc(db, `lessons/${this.id}`))

        if (r.exists()) {
            return r.data()
        }
        else {
            return {}
        }
    }
}

export class Course {
    constructor(id) {
        this.id = id
    }

    async getLessons() {
        const q = query(collection(db, "lessons"), where("parent", "==", this.id), orderBy("id"))
        const d = await getDocs(q)
        const l = []

        for (const lesson of d.docs) {
            l.push(new Lesson(lesson.id))
        }

        return l
    }

    static async getAll() {
        const q = query(collection(db, "courses"))
        const d = await getDocs(q)
        const l = []

        for (const course of d.docs) {
            l.push(new Course(course.id))
        }

        return l
    }

    async getLessonID(num) {
        const q = query(collection(db, "lessons"), where("parent", "==", this.id), where("id", "==", num))
        const d = await getDocs(q)

        return d.docs[0] || null
    }

    async get() {
        const r = await getDoc(doc(db, `courses/${this.id}`))

        if (r.exists()) {
            return r.data()
        }
        else {
            return {}
        }
    }

    async display(userData, on = "#avail") {

        const data = await this.get()

        const link = $("<a/>").addClass("card").attr("href", `/course/${this.id}`)
        const name = $("<h3/>").text(data.name)
        const desc = $("<p/>").text(data.desc)
        const progress = $("<progress/>").attr("max", 100).val(0)


        let num = 0;
        if (Object.keys(userData).length > 0) {

            const total = Object.keys(userData.lessons).length

            for (const key of Object.keys(userData.lessons)) {
                if (userData.lessons[key].finished) {
                    $(`#${key}`).addClass("gradient-bg")
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
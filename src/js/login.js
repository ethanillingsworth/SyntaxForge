import { signInWithEmailAndPassword } from "firebase/auth"
import { User } from "./main.js"
import $ from "jquery"
import { auth } from "./firebase.js"

const email = $("#email")
const password = $("#password")
const username = $("#username")



$("#signup").on("click", async () => {
    User.create(email.val(), password.val(), username.val())
    window.location.href = "/"
})

$("#login").on("click", () => {
    signInWithEmailAndPassword(auth, email.val(), password.val())
        .then(() => {
            window.location.href = "/"
        })
})
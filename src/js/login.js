import { signInWithEmailAndPassword } from "firebase/auth"
import { User } from "./main.js"
import $ from "jquery"
import { auth } from "./firebase.js"

const email = $("#email")[0].value
const password = $("#password").val()
const username = $("#username").val()



$("#signup").on("click", async () => {
    User.create(email, password, username)
    window.location.href = "/"
})

$("#login").on("click", () => {
    console.log(email)
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "/"
        })
})
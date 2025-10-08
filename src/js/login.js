import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GithubAuthProvider,
} from "firebase/auth";
import { User } from "./main.js";
import $ from "jquery";
import { auth } from "./firebase.js";

const email = $("#email");
const password = $("#password");
// const username = $("#username")

$("#signup").on("click", async () => {
	User.create(email.val(), password.val());
	window.location.href = "/";
});

$("#login").on("click", () => {
	signInWithEmailAndPassword(auth, email.val(), password.val()).then(() => {
		window.location.href = "/";
	});
});

const provider = new GithubAuthProvider();

$("#github").on("click", () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			const credential = GithubAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			// The signed-in user info.
			const user = result.user;
			// IdP data available using getAdditionalUserInfo(result)
			// ...

			console.log(1);

			window.location.href = "/";
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GithubAuthProvider.credentialFromError(error);
			// ...

			console.log(error);
		});
});

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

$("#login-button").on("click", () => {
	signInWithEmailAndPassword(auth, email.val(), password.val())
		.then(() => {
			// Redirect to the intended page or home if none specified
			const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
			sessionStorage.removeItem('redirectAfterLogin');
			window.location.href = redirectPath;
		})
		.catch((error) => {
			console.error("Login failed:", error);
			// Handle login error (e.g., show error message to user)
		});
});

const provider = new GithubAuthProvider();

$("#github").on("click", () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// Redirect to the intended page or home if none specified
			const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
			sessionStorage.removeItem('redirectAfterLogin');
			window.location.href = redirectPath;
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

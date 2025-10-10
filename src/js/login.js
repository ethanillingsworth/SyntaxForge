import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GithubAuthProvider,
	GoogleAuthProvider,
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
	signInWithEmailAndPassword(auth, email.val(), password.val()).then(() => {
		window.location.href = "/";
	});
});

const githubProvider = new GithubAuthProvider();

$("#github").on("click", () => {
	signInWithPopup(auth, githubProvider)
		.then((result) => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			const credential = GithubAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			// The signed-in user info.
			const user = result.user;
			// IdP data available using getAdditionalUserInfo(result)
			// ...
			localStorage.setItem("auth_token",token);
			localStorage.setItem("user",JSON.stringify(user));

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

const googleProvider = new GoogleAuthProvider();

$("#google").on("click", () => {
	signInWithPopup(auth, googleProvider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access Google APIs.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			// The signed-in user info.
			const user = result.user;
			// user.displayName, user.email, user.photoURL available
			
			console.log("Google login successful");

			window.location.href = "/";
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);

			console.log(error);
		});
});
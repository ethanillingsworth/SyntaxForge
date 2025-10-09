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

const provider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

$("#github").on("click", () => {
	signInWithPopup(auth, provider)
		.then(async (result) => {
			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			const credential = GithubAuthProvider.credentialFromResult(result);
			const accessToken = credential?.accessToken;

			// The signed-in user info.
			const user = result.user;
			console.log(user);
			
			// Get Firebase ID token (more reliable than access token)
			const idToken = await user.getIdToken();
			localStorage.setItem("token", idToken);
			
			// Store access token if available (for GitHub API access)
			if (accessToken) {
				localStorage.setItem("github_token", accessToken);
			}
			
			// Store user info
			localStorage.setItem("user", JSON.stringify({
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL
			}));

			console.log("GitHub sign-in successful");
			window.location.href = "/";
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData?.email;
			// The AuthCredential type that was used.
			const credential = GithubAuthProvider.credentialFromError(error);

			console.log("GitHub sign-in error:", error);
		});
});

$("#google").on("click", () => {
	signInWithPopup(auth, googleProvider)
		.then(async (result) => {
			// The signed-in user info.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const user = result.user;
			console.log(user);
			
			// Get Firebase ID token instead of access token
			const idToken = await user.getIdToken();
			localStorage.setItem("token", idToken);
			localStorage.setItem("accessToken:",credential?.token)
			
			// Store user info if needed
			localStorage.setItem("user", JSON.stringify({
				uid: user.uid,
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL
			}));

			window.location.href = "/";
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData?.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);

			console.log("Google sign-in error:", error);
		});
});

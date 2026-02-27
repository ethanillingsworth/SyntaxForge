import {
	GoogleLoginButton,
	GithubLoginButton,
} from "react-social-login-buttons";
import {
	GithubAuthProvider,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/init";
import { User } from "../firebase/Firebase";
import { useEffect } from "react";

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

githubProvider.addScope("user:email");

export default function LoginPage() {
	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			if (user) {
				window.location.href = "/home";
			}
		});
	}, []);

	function createNewUser(result) {
		if (result._tokenResponse.isNewUser) {
			const user = new User(result.user.uid);

			user.set("private", {});
			user.set("public", {});
		}
	}

	function githubLogin() {
		try {
			signInWithPopup(auth, githubProvider).then((result) => {
				console.log(result);
				createNewUser(result);

				// window.location.href = "/home";
			});
		} catch (error) {
			console.log(error);
		}
	}

	function googleLogin() {
		try {
			signInWithPopup(auth, googleProvider).then(() => {
				window.location.href = "/home";
			});
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="flex flex-col place-content-center place-items-center w-full h-full m-0">
			<h1 className="text-3xl">
				Welcome to <span className="gradient-text">SyntaxForge</span>
			</h1>

			<div className="flex flex-row gap-1.5">
				<GoogleLoginButton
					iconSize={20}
					size="40px"
					text="Google"
					className="hover:scale-100"
					onClick={googleLogin}
				></GoogleLoginButton>
				<GithubLoginButton
					iconSize={20}
					size="40px"
					text="Github"
					className="hover:scale-100"
					onClick={githubLogin}
				></GithubLoginButton>
			</div>
		</div>
	);
}

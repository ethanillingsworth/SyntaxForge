import {
    GoogleLoginButton,
    GithubLoginButton,
} from "react-social-login-buttons";
import {
    getAdditionalUserInfo,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/init";
import { User } from "../../firebase/Firebase";
import { useEffect, useState } from "react";

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

githubProvider.addScope("user:email");
googleProvider.addScope("email");

export default function LoginPage() {
    const [signUpDone, setSignUpDone] = useState(false);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user && signUpDone) {
                window.location.href = "/home";
            }
        });
    }, [signUpDone]);

    function generateUsername(email) {
        // 1. Take the part before the @
        const namePart = email.split("@")[0];

        // 2. Clean up non-alphanumeric characters
        const cleanName = namePart.replace(/[^a-zA-Z0-9]/g, "");

        // 3. Add a small random "Forge ID"
        const randomId = Math.floor(Math.random() * 9000) + 1000;

        return `${cleanName}${randomId}`;
    }

    async function createNewUser(result) {
        if (
            result._tokenResponse.isNewUser ||
            getAdditionalUserInfo(result).isNewUser
        ) {
            const user = new User(result.user.uid);
            await user.set("public", {
                username: generateUsername(result.user.providerData[0].email),
            });
            await user.set("private", {});
            setSignUpDone(true);
        }
    }

    async function githubLogin() {
        try {
            signInWithPopup(auth, githubProvider).then(async (result) => {
                await createNewUser(result);
                setSignUpDone(true);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function googleLogin() {
        try {
            signInWithPopup(auth, googleProvider).then(async (result) => {
                await createNewUser(result);
                setSignUpDone(true);
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

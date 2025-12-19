import { GoogleLoginButton, GithubLoginButton } from 'react-social-login-buttons'
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase/init';

const provider = new GithubAuthProvider();

export default function LoginPage() {
    function githubLogin() {
        console.log(1)
        signInWithPopup(auth, provider)
            .then(() => {
                window.location.href = "/"
            }).catch((error) => {

                console.log(error)
            });
    }
    return (
        <div className='flex flex-col place-content-center place-items-center w-full gap-3'>
            <h1 className='text-3xl'>Welcome to <span className='gradient-text'>SyntaxForge</span></h1>

            <div className='flex flex-row gap-3'>
                <GoogleLoginButton iconSize={20} size='32px' text='Google'></GoogleLoginButton>
                <GithubLoginButton iconSize={20} size='32px' text='Github' onClick={githubLogin}></GithubLoginButton>
            </div>
        </div>
    );
}
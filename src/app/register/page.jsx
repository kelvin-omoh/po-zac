"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../../firebaseConfig'

const Page = () => {
    const [formData, updateFormData] = useState({
        name: "",
        password: "",
        email: ""
    });
    const [registrationError, updateRegistrationError] = useState({
        state: false,
        message: ""
    })
    const [isNameValid, updateIsNameValid] = useState(false);
    const [isEmailValid, updateIsEmailValid] = useState(false);
    const [isPasswordValid, updateIsPasswordValid] = useState(false);

    const [signupLoading, updateSignupLoading] = useState(false);
    const [success, updateSuccessState] = useState(false);

    const provider = new GoogleAuthProvider();
    const router = useRouter();

    const Spinner = (
        <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )

    const controlFormDataChanges = (e) => {
        // specify the expected target datatype
        const name = e.target.name;
        const value = e.target.value;

        updateFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    const verifyEmail = (e) => {
        // we can use module validator.js to validate emails better
        const inputtedEmail = (e.target.value).trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const emailValid = emailRegex.test(inputtedEmail);
        emailValid ? updateIsEmailValid(true) : updateIsEmailValid(false);
    }

    const verifyName = (e) => {
        // simple validation for name
        const inputtedName = (e.target.value).trim();
        const nameRegex = /^[a-zA-Z ]+$/;

        const nameValid = nameRegex.test(inputtedName);
        updateIsNameValid(nameValid);
    }

    const verifyPassword = (e) => {
        const inputtedPassword = (e.target.value).trim();
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/; // password should characters
        // const passwordValid = passwordRegex.test(inputtedPassword);

        inputtedPassword.length < 6 ? updateIsPasswordValid(false) : updateIsPasswordValid(true);
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            updateSignupLoading(true);
            const formValid = isEmailValid && isNameValid && isPasswordValid;

            e.currentTarget.disabled = formValid;

            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Update user's display name with formData.name
            await updateProfile(user, { displayName: formData.name });

            // Display success state after setting the display name
            updateSuccessState(true);
            updateSignupLoading(false);
            console.log("User signed up with display name:", user.displayName);
        } catch (error) {
            const errorMessage = error.message;

            if (errorMessage.includes("network"))
                updateRegistrationError({ state: true, message: "There was a network error. Please check your connection" });
            else if (errorMessage.includes("email-already-in-use"))
                updateRegistrationError({ state: true, message: "The email is already in use. Try another" });
            else
                updateRegistrationError({ state: true, message: errorMessage.slice(9) });

            updateSignupLoading(false);
            e.currentTarget.disabled = false;
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...

                    // on successful authentication, route user to game (If user already exists, it still routes them to game page)
                    router.push("/game");
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // console.log(errorMessage, errorCode)

                    updateRegistrationError({ state: true, message: `Google Auth: ${errorMessage}` })
                    // ...
                });
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={`bg-green-50 max-w-full relative text-[#575A65] ${success ? "h-screen" : ""} sm:overflow-hidden`}>
            <div className="bg-green-100 -z-10 w-[28rem] sm:-top-[25%] h-[180%] transform rotate-45 md:-top-[49%] md:-left-[20%] absolute hidden sm:block"></div>
            <div className="bg-green-100 w-[35%] h-[180%] transform rotate-45 md:-right-[5%] absolute hidden sm:block"></div>

            <div id="content" className="flex flex-col z-50 relative max-w-screen">
                {/* <Image src={"/logo-sdg-2.png"} priority width={150} height={150} alt="sdg-game-logo" className="z-10 self-center sm:self-start" /> */}
                <div id="logos" className="z-10 flex justify-center w-full md:justify-between md:pr-6 lg:pr-10">
                    <Image src={"/logo-sdg-2.png"} priority width={150} height={150} alt="sdg-game-logo" className="z-10 self-center sm:self-start" />
                    <Image src={"/inventors-logo.svg"} priority width={60} height={60} alt="sdg-game-logo" className="z-10 hidden cursor-pointer self-center md:block" />
                </div>


                {!success && <div id="register" className="self-center rounded-md bg-white p-4 mx-4 sm:p-16 sm:mx-0 py-8 sm:py-10 flex flex-col gap-3 relative -top-16
                sm:-top-20 border border-[#00977F]">
                    <div id="header-text">
                        <h2 className="text-[20px] sm:text-[32px] py-2 text-black font-georama font-[700]">Register an Account</h2>
                        <p className="text-xs">Ready to work on your positive reinforcement? yes you are, let the journey begin!</p>
                    </div>

                    <input type="name" name='name' placeholder="Full Name" className="w-full py-3 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
                        onChange={(e) => { controlFormDataChanges(e); verifyName(e) }} onBlur={(e) => verifyName(e)} />
                    <p className={`text-[12px] text-red-500 ${isNameValid ? "hidden" : ""}`}>Please enter a valid name</p>

                    <input type="password" name='password' placeholder="Password" className="w-full py-3 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
                        onChange={(e) => { controlFormDataChanges(e); verifyPassword(e) }} onBlur={(e) => verifyPassword(e)} />
                    <p className={`text-[12px] text-red-500 ${isPasswordValid ? "hidden" : ""}`}>Enter at least 5 characters</p>

                    <input type="email" name="email" placeholder="Email Address" className="w-full py-3 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
                        onChange={(e) => { controlFormDataChanges(e); verifyEmail(e) }} onBlur={(e) => verifyEmail(e)} />
                    <p className={`text-[12px] text-red-500 ${isEmailValid ? "hidden" : ""}`}>Please enter a valid email address</p>

                    <button className="text-white bg-[#00B598] cursor-pointer py-3 px-auto rounded ease-transition hover:bg-[#007965] disabled:opacity-50"
                        onClick={(e) => handleFormSubmission(e)}>
                        {signupLoading ? Spinner : "Register"}
                    </button>

                    {registrationError.state ? <p className="text-red-500 text-sm">{registrationError.message}</p> : ""}

                    <Image src={"/or-login-with.png"} alt="or-login-with" width={420} height={25} loading="lazy" className='self-center w-full' />

                    <button id="google-btn" className="flex px-auto py-3 border border-gray-200 rounded justify-center gap-3 ease-transition hover:border-[#00B598]
                    hover:text-[#00B598]" onClick={() => handleGoogleSignUp()}>
                        <Image src={"/google-icon.png"} width={25} height={25} alt="google-logo" />
                        <span className="font-[500] text-[16px]">Sign up with Google</span>
                    </button>
                </div>}

                {!success && <p className="self-center font-[400] text-[10px] w-[80%] xs:text-[14px] text-center sm:text-[18px] relative -top-14 sm:-top-16">Already have an account?
                    <Link href={"/"} className="text-[#007965] font-bold pl-2">Log In to your account</Link>
                </p>}

                {/* On successful registration, show the following... */}
                {success &&
                    <div id="success-modal" className='bg-white w-fit self-center flex flex-col gap-4 items-center p-8 rounded-md'>
                        <p className='text-[14px] font-[400] text-[#161616]'>Congratulations</p>
                        <Image src={"/success-b-new.svg"} width={150} height={150} alt='success-modal-logo' />
                        <h1 className='font-[700] text-[#00B598]'>Awesome!</h1>
                        <p className='text-[14px] text-gray-500'>Account has been created successfully</p>
                        <Link href={"/"} className='w-full cursor-pointer text-center py-3 px-2 rounded-md text-white bg-[#003C33]'>Proceed to login</Link>
                    </div>
                }

                {/* Built by Inventors */}
                <div id="built-by-inventors" className={`flex items-center cursor-pointer gap-1 scale-90 absolute bottom-0 left-[45%] xs:left-[50%]
                ${success ? "hidden" : ""} sm:hidden`} style={{ transform: "translate(-50%, -50%)" }}>
                    <Image src={"/inventors-logo.svg"} priority width={35} height={35} alt="sdg-game-logo" className="" />
                    <p className="text-sm text-nowrap"> - Built by the inventors community ❤️</p>
                </div>
            </div>
        </div>
    );
}

export default Page;

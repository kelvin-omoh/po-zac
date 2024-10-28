"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const Page = () => {
    const [hasEmailBeenSent, updateHasEmailBeenSent] = useState(false);
    const [formData, updateFormData] = useState({
        email: ""
    });
    const [isEmailValid, updateIsEmailValid] = useState(false);
    const [sendResetEmailError, updateSendResetEmailError] = useState({
        state: false,
        message: ""
    });
    const [resetLinkSending, updateResetLinkSending] = useState(false);
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

    const validateEmail = (e) => {
        const inputtedEmail = e.target.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailValid = emailRegex.test(inputtedEmail);

        updateIsEmailValid(emailValid);
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        updateFormData({ ...formData, [name]: value });
    };


    const sendResetEmail = async () => {
        updateResetLinkSending(true);
        updateSendResetEmailError({
            state: false,
            message: ""
        });

        try {
            console.log(formData.email)
            sendPasswordResetEmail(auth, formData.email)
                .then(() => {
                    // Password reset email has been sent sent!
                    // alert("A reset link has been sent to your mail.");
                    updateHasEmailBeenSent(true);
                    updateResetLinkSending(false);
                })
                .catch((error) => {
                    // const errorCode = error.code;  // Remove or comment out this line
                    const errorMessage = error.message;

                    console.log(errorMessage);

                    if (errorMessage.includes("network")) {
                        updateSendResetEmailError({ state: true, message: "There was a network error. Please check your connection" });
                    } else {
                        updateSendResetEmailError({ state: true, message: errorMessage.slice(9) });
                    }

                    updateResetLinkSending(false);
                });
        } catch (error) {
            console.error(error)
            updateResetLinkSending(false);
        }
    }

    return (
        <div className="bg-green-50 w-full h-screen relative text-[#575A65] sm:overflow-hidden">
            <div className="bg-green-100 -z-10 w-[28rem] sm:-top-[25%] h-[180%] transform rotate-45 md:-top-[49%] md:-left-[20%] absolute hidden sm:block"></div>
            <div className="bg-green-100 w-[35%] h-[180%] transform rotate-45 md:-right-[5%] absolute hidden sm:block"></div>

            <div id="content" className="flex flex-col z-50 relative max-w-screen">
                {/* <Image src={"/logo-sdg-2.png"} priority width={150} height={150} alt="sdg-game-logo" className="z-10 self-center sm:self-start" /> */}
                <div id="logos" className="z-10 flex justify-center w-full md:justify-between md:pr-6 lg:pr-10">
                    <Image src={"/logo-sdg-2.png"} priority width={150} height={150} alt="sdg-game-logo" className="z-10 self-center sm:self-start" />
                    <Image src={"/inventors-logo.svg"} priority width={60} height={60} alt="sdg-game-logo" className="z-10 hidden self-center cursor-pointer md:block" />
                </div>

                {!hasEmailBeenSent ?

                    <div id="forgot-password" className="self-center rounded-md bg-white p-4 mx-4 sm:p-16 sm:mx-0 py-8 sm:py-10 flex flex-col gap-3 relative -top-16
                sm:-top-20 border border-[#00977F]">
                        <div id="header-text">
                            <h2 className="text-[20px] sm:text-[32px] py-2 text-black font-georama font-[700]">Forgot Password</h2>
                            <p className="text-xs">Don`&apos;`t worry, it happens! <br /> Type in your registered Email Address to receive reset password link.</p>
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full py-3 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
                            onChange={(e) => { handleChange(e); validateEmail(e); }}
                            onBlur={(e) => { handleChange(e); validateEmail(e); }}
                        />
                        {!isEmailValid ? <p className='text-sm text-red-500'>Enter a valid email.</p> : ""}

                        <button className="text-white bg-[#00B598] py-3 px-auto rounded ease-transition hover:bg-green-600" onClick={sendResetEmail}>
                            {resetLinkSending ? Spinner : "Send Passoword Reset Link"}
                        </button>
                        {sendResetEmailError.state ? <p className='text-sm text-red-500'>{sendResetEmailError.message}</p> : ""}
                    </div> : ""}

                {/* On successful link request, show the following... */}
                {hasEmailBeenSent ?
                    <div id="success-modal" className='bg-white w-fit self-center flex flex-col gap-4 items-center p-8 rounded-md'>
                        <Image src={"/success-b-new.svg"} width={150} height={150} alt='success-modal-logo' />
                        <h1 className='font-[700] text-[#00B598]'>Email has been sent.</h1>
                        <p className='text-[14px] text-gray-500'>Click the link in your mail to change your password then login.</p>
                        <Link href={"/"} className='w-full'>
                            <button className='w-full py-3 px-2 rounded-md text-white bg-[#003C33]'>
                                Proceed to login
                            </button>
                        </Link>
                    </div>
                    : ""}
            </div>
        </div>
    );
}

export default Page;
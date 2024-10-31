"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CustomCheckbox from "../components/CustomCheckBox/CustomCheckBox";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";

// The home is the login page.
export default function Home() {
  const [formData, updateFormData] = useState({
    email: "",
    password: "",
    isChecked: false
  })
  const [isEmailValid, updateIsEmailValid] = useState(false);
  const [isPasswordValid, updateIsPasswordValid] = useState(false);
  const [loginLoading, updateLoginLoading] = useState(false);
  const [loginLoading1, updateLoginLoading1] = useState(false);
  const [loginError, updateLoginError] = useState({
    message: "",
    state: false
  });
  const [googleLoginError, updateGoogleLoginError] = useState({
    state: false,
    message: ""
  })
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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
    const name = e.target.name;
    const value = e.target.value;

    updateFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmission = (e) => {
    updateGoogleLoginError({ state: false, message: "" });
    updateLoginLoading(true);

    // disable button while loading 
    e.target.disabled = true;

    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        const user = userCredential.user;



        updateLoginLoading(false);
        e.target.disabled = false;

        localStorage.setItem("userDetails", JSON.stringify(user));
        router.push("/game");
      })
      .catch((error) => {
        const errorMessage = error.message;

        updateLoginLoading(false);
        e.target.disabled = false;

        // empty the inputs
        emailRef.current.value = "";
        passwordRef.current.value = "";

        // update error state
        if (errorMessage.includes("network-request-failed")) {
          updateLoginError({ state: true, message: "There was a network error. Please check your connection" });
        } else if (errorMessage.includes("invalid-credential")) {
          updateLoginError({ state: true, message: "Invalid credentials. Please confirm your details" });
        } else {
          updateLoginError({ state: true, message: errorMessage.slice(9) });
        }
      });
  };


  const handleWithGoogle = async () => {
    updateGoogleLoginError({ state: false, message: "" });
    updateLoginLoading1(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // console.log(user);
        updateLoginLoading1(false);
        localStorage.setItem("userDetails", JSON.stringify(user));

        router.push("/game");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        updateLoginLoading1(false);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        // update error state
        if (errorMessage.includes("network-request-failed"))
          updateGoogleLoginError({ state: true, message: "There was a network error. Please check your connection" });

      }).finally(() => updateLoginLoading1(false));
  }

  return (
    <main className="bg-green-50 h-screen  max-w-screen relative text-[#575A65] sm:overflow-hidden">
      <div className="bg-green-100 -z-10 w-[28rem] sm:-top-[25%] h-[180%] transform rotate-45 md:-top-[49%] md:-left-[20%] absolute hidden sm:block"></div>
      <div className="bg-green-100 w-[35%] h-[180%] transform rotate-45 md:-right-[5%] absolute hidden sm:block"></div>

      <div id="content" className="flex flex-col z-50 relative max-w-screen">
        <div id="logos" className="z-10 flex justify-center w-full md:justify-between md:pr-6 lg:pr-10">
          <Image src={"/logo-sdg-2.jpeg"} priority width={100} height={100} alt="sdg-game-logo" className="z-10  sm:p-0 p-[1.3rem] mt-[2rem] rounded-full self-center sm:self-start" />
          <Image src={"/inventors-logo.svg"} priority width={60} height={60} alt="sdg-game-logo" className="z-10 hidden self-center cursor-pointer md:block" />
        </div>

        <div id="login" className="self-center rounded-md bg-white p-4 mx-4 sm:p-16 sm:mx-0 py-8 sm:py-10 flex flex-col gap-5 relative -top-16 border border-[#00977F]">
          <div id="header-text">
            <h2 className="text-[20px] sm:text-[32px] py-2 text-black font-georama font-[700]">Welcome back, <span className="text-[#00977F]">my friend!</span></h2>
            <p className="text-xs">Good to see you again. Login now and access your account.</p>
          </div>

          {/* The onBlur attribute checks if the user has taken cursor away from the input, That is, out of focus.  */}
          <input type="email" placeholder="Email Address" name="email" className="w-full py-4 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
            onChange={(e) => { controlFormDataChanges(e) }} ref={emailRef} />
          {isEmailValid ? <p className="text-red-500 text-sm">Enter a valid email</p> : ""}

          <input type="password" placeholder="Password" name="password" className="w-full py-4 border text-[#6B6B6B] border-gray-200 rounded-md px-4"
            onChange={(e) => { controlFormDataChanges(e) }} ref={passwordRef} />
          {isPasswordValid ? <p className="text-red-500 text-sm">Password can not be empty</p> : ""}

          <div id="remember-me" className="flex justify-between text-[15px]">
            <div className="flex gap-2">
              <CustomCheckbox updateCheckedState={(checked) => updateFormData((prevState) => ({ ...prevState, isChecked: !checked }))} />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <Link href={"/forgot-password"} className="text-[#007965] font-[500]">Forgot Password ?</Link>
          </div>

          <button className="text-white bg-[#007965] cursor-pointer py-3 px-auto rounded ease-transition
          disabled:opacity-50 hover:bg-[#1d6e61a4]" onClick={(e) => handleFormSubmission(e)}>{loginLoading ? Spinner : "Log In"}</button>

          {loginError.state ? <p className="text-red-500 text-sm">{loginError.message}</p> : ""}

          <Image src={"/or-login-with.png"} alt="or-login-with" width={420} height={25} loading="lazy" />

          <button id="google-btn" className="flex px-auto py-3 border border-gray-200 rounded justify-center gap-3 hover:border-[#00B598] hover:text-[#00B598]"
            onClick={() => handleWithGoogle()}>
            <Image src={"/google-icon.png"} width={25} height={25} alt="google-logo" />
            <span className="font-[500] text-[16px]">
              {loginLoading1 ?
                'Loading...' : ' Log In with Google'
              }
            </span>
          </button>

          {googleLoginError.state ? <p className="text-red-500 text-sm">{googleLoginError.message}</p> : ""}
        </div>

        <p className="self-center font-[400] text-[14px] text-center sm:text-[18px] w-full relative -top-14">Don&apos;t have an account?
          <Link href={"/register"} className="text-[#007965] font-bold pl-2">Create an account</Link>
        </p>

        {/* Built by Inventors */}
        <div id="built-by-inventors" className="flex items-center cursor-pointer gap-1 scale-90 absolute bottom-0 left-[45%] xs:left-[50%] sm:hidden"
          style={{ transform: "translate(-50%, -50%)" }}>
          <Image src={"/inventors-logo.svg"} priority width={35} height={35} alt="sdg-game-logo" className="" />
          <p className="text-sm text-nowrap"> - Built by the inventors community ❤️</p>
        </div>
      </div>
    </main>
  );
}

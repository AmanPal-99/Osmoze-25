"use client";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import bg from "../../../public/images/SignUpBG.png"
import toast, { Toaster } from 'react-hot-toast';


export default function SignUp() {
    const router = useRouter();

    const signUpWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user || !user.email) {
                throw new Error('No user data available');
            }

            const email = user.email.toLowerCase();
            if (!email.endsWith('@itbhu.ac.in') && !email.endsWith('@iitbhu.ac.in')) {
                await auth.signOut();
                toast.error('Please use your institute email address to sign up 🎓');
                return;
            }

            localStorage.setItem('user', JSON.stringify({
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL
            }));

            toast.success('Signed up successfully! 🎉');
            window.dispatchEvent(new Event('userStateChange'));
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (err) {
            console.error("Error signing up: ", err);
            toast.error("An error occurred while signing up. Please try again. ❌");
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${bg.src})` }}>
                <div className="w-full h-full backdrop-blur-sm flex justify-center">
                    <main>
                        <div className="px-8 lg:px-8 h-[60rem] min-w-[25rem] ">
                            <div className="flex justify-center items-center h-[100vh] overflow-hidden bg-inherit">
                                <div className="bg-[#180F40] shadow-md rounded-lg p-8 w-full max-w-  flex-shrink-0">
                                    <div className="flex justify-center mb-6">
                                        <Image
                                            src="/images/OsmozeLogoLogin.png"
                                            alt="Logo"
                                            width={150}
                                            height={150}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="text-center pb-4">
                                        <h2 className="text-3xl font-bold mb-1  text-white">
                                            Osmoze<span className="text-sky-600">'25</span>
                                        </h2>
                                    </div>

                                    <button
                                        className="flex items-center border-s border-sky-400 border-2
                                        justify-center w-full bg-[#180F40] text-white py-2 px-4 rounded-[15px]
                                        hover:bg-[#281287] transition duration-300"
                                        onClick={signUpWithGoogle}>
                                        <FaGoogle className="mr-2 text-red-500" />
                                        Sign Up with Google
                                    </button>
                                    <p className="text-center text-white-600 mt-6">
                                        Already signed up?{" "}
                                        <Link href={"/login"} passHref>
                                            <button className="text-yellow-200 hover:underline">
                                                Log In
                                            </button>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
};


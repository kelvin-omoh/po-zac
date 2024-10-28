"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    return (
        <div className='bg-blue-950 p-16 w-full h-screen' id='main-game-page'>
           <div id="main-game-page-content" className='bg-[url("/game/wood-bg.jpg")] rounded-2xl w-full h-full'>
                <header className='grid grid-cols-3 py-8 px-8 justify-center w-full my-4 mb-12'>
                    <div id='back-button' className='p-6 block fixed col-span-1 ease-transition cursor-pointer bg-black rounded-full hover:scale-[102%]' 
                    onClick={() => router.back()}>
                        <Image src={"/game/back-icon.svg"} className='w-[50px] h-[50px]' priority width={50} height={50} alt='menu-icon'/>
                    </div>

                    <h1 className='text-5xl font-[500] self-center col-start-2 items-center justify-center pt-6 col-span-1 text-center'>Main Menu</h1>
                </header>

                <div className='flex justify-center items-center gap-24 pt-12'>
                    <Link href={"/game/start"} id='menu-item' className='menu-item'>
                        <div className='p-6 bg-black rounded-lg'><Image src={"/game/play-icon.svg"} className='w-[50px] h-[50px]' priority width={50} height={50} alt='menu-icon'/></div>
                        <p>Start Game</p>
                    </Link>
                    
                    <Link href={"#"} id='settings-item' className='menu-item'>
                        <div className='p-6 bg-black rounded-lg'><Image src={"/game/rewards-icon.svg"} priority width={50} height={50} alt='menu-icon'/></div>
                        <p>Rewards</p>
                    </Link>

                    <Link href={"#"} id='profile-item' className='menu-item'>
                        <div className='p-6 bg-black rounded-lg'><Image src={"/game/leaderboard-icon.svg"} priority width={50} height={50} alt='menu-icon'/></div>
                        <p>Leaderboard</p>
                    </Link>
                </div>

            </div> 
        </div>
    );
}

export default Page;

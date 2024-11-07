"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    return (
        <div className='bg-blue-950 p-16 w-full h-full' id='main-game-page'>
            <div id="main-game-page-content" className='bg-[url("/game/wood-bg.jpg")] rounded-2xl w-full h-screen '>
                <header className='grid grid-cols-3 py-8 px-8 items-center justify-center w-full my-4 mb-12'>
                    <div id='back-button' className=''
                        onClick={() => router.push('/game')}>
                        <Image src={"/game/back-icon.svg"} className='w-[25px] h-[25px]' priority width={15} height={15} alt='menu-icon' />
                    </div>

                    <h1 className='text-xl text-white sm:text-5xl font-[500] self-center col-start-2 items-center justify-center w-[7rem] md:w-[30rem]  col-span-1 text-center'>Main Menu</h1>
                </header>

                <div className='flex flex-col md:flex-row justify-center items-center gap-[20px] md:gap-24 pt-0 md:pt-12'>
                    <Link href={"/game/start"} id='menu-item' className='menu-item'>
                        <div className='p-6 bg-black rounded-lg'><Image src={"/game/play-icon.svg"} className='w-[30px] h-[30px]' priority width={30} height={30} alt='menu-icon' /></div>
                        <p>Start Game</p>
                    </Link>

                    <Link href={"#"} id='settings-item' className='  cursor-not-allowed menu-item '>
                        <div className='p-6 bg-[#343333ef] rounded-lg'><Image src={"/game/rewards-icon.svg"} className='w-[30px] h-[30px]' priority width={30} height={30} alt='menu-icon' /></div>
                        <p className=' text-[#1717179f] '>Rewards</p>
                    </Link>

                    <Link href={"#"} id='profile-item' className='menu-item'>
                        <div className='p-6 bg-[#343333ef]  rounded-lg'><Image src={"/game/leaderboard-icon.svg"} className='w-[30px] h-[30px]' priority width={30} height={30} alt='menu-icon' /></div>
                        <p className=' text-[#1717179f] '>Leaderboard</p>
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Page;

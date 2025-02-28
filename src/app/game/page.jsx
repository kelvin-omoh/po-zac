import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
    return (
        <div className='bg-blue-950 p-16 w-full h-screen' id='main-game-page'>
            <div id="main-game-page-content" className='bg-[url("/game/wood-bg.jpg")] rounded-2xl w-full h-full flex justify-center flex-col md:flex-row items-center gap-24'>
                <Link href={"/game/menu"} id='menu-item' className='menu-item'>
                    <div className='p-6 bg-black rounded-lg'><Image src={"/game/menu-icon.svg"} className='w-[50px] h-[50px]' priority width={50} height={50} alt='menu-icon' /></div>
                    <p className='font-arsenal font-bold'>Main Menu</p>
                </Link>

                {/* <Link href={"#"} id='settings-item' className='menu-item'>
                    <div className='p-6 bg-black rounded-lg'><Image src={"/game/settings-icon.svg"} priority width={50} height={50} alt='menu-icon' /></div>
                    <p>Leader Board </p>
                </Link> */}

                {/* <Link href={"#"} id='profile-item' className='menu-item'>
                    <div className='p-6 bg-black rounded-lg'><Image src={"/game/profile-icon.svg"} priority width={50} height={50} alt='menu-icon' /></div>
                    <p>Profile</p>
                </Link> */}
            </div>
        </div>
    );
}

export default Page;

"use client";
import React from 'react';
import Modal from '@/components/Modal/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { Howl } from "howler";
import { useState, useRef, useEffect } from 'react';
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { HiMiniSpeakerXMark } from "react-icons/hi2";

// Acronym data
export interface AcronymData {
    acronym: string;
    options: string[];
    correct: string[];
}

const gameData: AcronymData[] = [
    {
        acronym: "FAIL",
        options: [
            "Forget",
            "Forgive",
            "Failure",
            "Attempt",
            "In",
            "Learning",
            "First",
            "Impact",
            "Launch",
            "Forward",
            "Aim",
            "Improve",
        ],
        correct: ["First", "Attempt", "In", "Learning"],
    },
    {
        acronym: "MAD",
        options: [
            "Make",
            "Move",
            "Motivate",
            "Alter",
            "Difference",
            "A",
            "Achieve",
            "Aspire",
            "Act",
            "Mind",
            "Mark",
            "Develop",
        ],
        correct: ["Make", "A", "Difference"],
    },
    {
        acronym: "HARD",
        options: [
            "Ambitious",
            "Driven",
            "Hopeful",
            "Resilient",
            "Reinvent",
            "Dream",
            "Dare",
            "Diligent",
            "Adapt",
            "Rise",
            "Heart",
            "Action",
        ],
        correct: ["Hopeful", "Ambitious", "Resilient", "Driven"],
    },
    {
        acronym: "FEAR",
        options: [
            "Face",
            "And",
            "Rise",
            "Expect",
            "Revive",
            "Accept",
            "Everything",
            "Adapt",
            "Fail",
            "Action",
            "Endure",
            "Realize",
        ],
        correct: ["Face", "Everything", "And", "Rise"],
    },
    {
        acronym: "PAIN",
        options: [
            "Positive",
            "Attitude",
            "Increases",
            "Awareness",
            "Inspire",
            "Now",
            "Navigate",
            "Apply",
            "Integrity",
            "Persistence",
            "Allow",
            "Impact",
        ],
        correct: ["Positive", "Attitude", "Increases", "Now"],
    },
    {
        acronym: "RAGE",
        options: [
            "Rise",
            "Above",
            "Revive",
            "Aspire",
            "Generate",
            "Grow",
            "Empower",
            "Achieve",
            "Everyday",
            "Adapt",
            "Guide",
            "Explore",
        ],
        correct: ["Rise", "Above", "Grow", "Everyday"],
    },
    {
        acronym: "SICK",
        options: [
            "Strong",
            "Sustain",
            "Innovate",
            "Change",
            "Inspired",
            "Courageous",
            "Keen",
            "Knowledge",
            "Support",
            "Care",
            "See",
            "Kind",
        ],
        correct: ["Strong", "Inspired", "Courageous", "Kind"],
    },
    {
        acronym: "LOSER",
        options: [
            "Onward",
            "Every",
            "Result",
            "Resilience",
            "Learning",
            "Opportunity",
            "Explore",
            "Succeed",
            "Open",
            "Effort",
            "Rise",
            "Risk",
        ],
        correct: ["Learning", "Opportunity", "Succeed", "Effort", "Result"],
    },
    {
        acronym: "WIMP",
        options: [
            "Mature",
            "Wise",
            "Positive",
            "Willing",
            "Inspire",
            "Intelligent",
            "Motivated",
            "Persevere",
            "Will",
            "Influence",
            "Perfect",
            "Master",
        ],
        correct: ["Wise", "Intelligent", "Motivated", "Persevere"],
    },
    {
        acronym: "GUILT",
        options: [
            "Great",
            "In",
            "Learning",
            "Generate",
            "Uplift",
            "Understanding",
            "Inspire",
            "Transform",
            "Grow",
            "Unify",
            "Lead",
            "Improve",
        ],
        correct: ["Great", "Understanding", "Inspire", "Lead", "Transform"],
    },
    {
        acronym: "CRY",
        options: [
            "Courageous",
            "Resilient",
            "Youth",
            "Create",
            "Reflect",
            "Yield",
            "Reach",
            "Yearn",
            "Root",
            "Year",
            "Change",
            "Connect",
        ],
        correct: ["Courageous", "Resilient", "Yearn"],
    },
    {
        acronym: "STUCK",
        options: [
            "Tenacious",
            "Unique",
            "Courageous",
            "Kind",
            "Seek",
            "Strong",
            "Understand",
            "Communicate",
            "Support",
            "Teach",
            "Stand",
            "Trust",
        ],
        correct: ["Strong", "Tenacious", "Unique", "Courageous", "Kind"],
    },
    {
        acronym: "BOLD",
        options: [
            "Brave",
            "Optimistic",
            "Lively",
            "Determined",
            "Bold",
            "Open",
            "Learn",
            "Drive",
            "Believe",
            "Order",
            "Lift",
            "Organize",
        ],
        correct: ["Brave", "Optimistic", "Lively", "Determined"],
    },
    {
        acronym: "RISK",
        options: [
            "Strong",
            "Knowledgeable",
            "Reflect",
            "Innovate",
            "Strategize",
            "Keep",
            "Resilient",
            "Invest",
            "Safe",
            "Inspired",
            "Insight",
            "Kick",
        ],
        correct: ["Resilient", "Inspired", "Strong", "Knowledgeable"],
    },
    {
        acronym: "LOVE",
        options: [
            "Open",
            "Learn",
            "Everyone",
            "Lend",
            "Observe",
            "Vibe",
            "Lift",
            "Offer",
            "Endure",
            "Look",
            "Value",
            "Express",
        ],
        correct: ["Learn", "Open", "Value", "Everyone"],
    },
    {
        acronym: "TIME",
        options: [
            "Innovate",
            "Tackle",
            "Inspire",
            "Manage",
            "Empower",
            "Team",
            "Integrity",
            "Move",
            "Motivate",
            "Think",
            "Meet",
            "Trust",
        ],
        correct: ["Trust", "Innovate", "Motivate", "Empower"],
    },
];


// Game state interface
interface GameState {
    lives: number;
    score: number;
    currentQuestion: number;
    userAnswers: string[];
    gameStatus: "playing" | "gameOver" | "won";
    settings: {
        sound: boolean;
        darkMode: boolean;
    };
}


const Page = () => {
    const compliments = ["Keep going!! 💯", "You're almost there!! 💪", "Just WOW!!! 🔥", "const's go!! 👻", "Keep it up!!! 👏", "Incredible!! 🔥", "Amazing work!! ✨", "Super speed!! 😎"];
    // const randomIndexFromGameData = Math.floor(Math.random() * gameData.length);

    const [gameState, setGameState] = useState<GameState>({
        lives: 3,
        score: 0,
        currentQuestion: 0,
        userAnswers: [],
        gameStatus: "playing",
        settings: {
            sound: true,
            darkMode: false,
        },
    });

    const router = useRouter();
    const optionsRef = useRef(null);
    const [showModal, updateShowModal] = useState(false);

    const { currentQuestion, score, lives, gameStatus, userAnswers, settings } = gameState;
    const currentData = gameData[currentQuestion];
    // const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // const [user, loading, error] = useAuthState(auth);

    // Sound Effects
    const successSound = new Howl({ src: ["/sounds/success.wav"], volume: 0.5 });
    const failSound = new Howl({ src: ["/sounds/fail.wav"], volume: 0.5 });
    const gameOverSound = new Howl({ src: ["/sounds/gameover.wav"], volume: 0.5 });

    useEffect(() => {
        currentData.options = (shuffleArray(currentData.options) as string[]);
    }, [currentData])

    useEffect(() => {
        if (currentData.options) {
            currentData.options = shuffleArray(currentData.options) as string[];
        }
    }, [currentData, currentData.acronym])

    // Handle Click option
    const handleOptionClick = (event: React.MouseEvent<HTMLElement>, option: string) => {

        const correctAnswer = currentData.correct[userAnswers.length];

        if (option === correctAnswer) {
            if (settings.sound) successSound.play();
            setGameState((prevState) => ({
                ...prevState,
                score: prevState.score + 5,
                userAnswers: [...prevState.userAnswers, option],
            }));

            (event.target as HTMLElement).classList.add("option-success");

            // clear success or failure styling placed on all options 
            Array.from((optionsRef.current as unknown as HTMLDivElement).children).forEach(element => {
                element.classList.remove('option-failure');
            });

            // Once the score is 25, 50, 75, etc
            if (score != 0 && score % 50 == 0) {
                temporarilyShowModal();
            }

            if (userAnswers.length + 1 === currentData.correct.length) {
                if (currentQuestion + 1 >= gameData.length) {
                    setGameState((prevState) => ({
                        ...prevState,
                        gameStatus: "won", // Player won the game
                    }));
                } else {
                    // clear success or failure styling placed on all options 
                    Array.from((optionsRef.current as unknown as HTMLDivElement).children).forEach(element => {
                        element.classList.remove('option-success');
                        element.classList.remove('option-failure');
                    });

                    currentData.options = (shuffleArray(currentData.options) as any);
                    nextQuestion();
                }
            }
        } else {
            if (settings.sound) failSound.play();
            (event.target as HTMLElement).classList.add("option-failure");
            setGameState((prevState) => {
                const newLives = prevState.lives - 1;

                // Check if lives reach zero
                if (newLives <= 0) {
                    if (settings.sound) gameOverSound.play();
                    return {
                        ...prevState,
                        lives: newLives,
                        gameStatus: "gameOver",
                    };
                }

                return {
                    ...prevState,
                    lives: newLives,
                };
            });
        }
    };

    const temporarilyShowModal = () => {
        updateShowModal(true);

        setTimeout(() => {
            updateShowModal(false);
        }, 1500)
    }

    function shuffleArray(array: Array<string>) {
        const length = array.length;
        const shuffle = array.slice(); // copy of array
        // loop over the array
        for (let i: number = length - 1; i > 0; i -= 1) {
            const random = Math.floor(Math.random() * (i + 1)); // random card position
            const current = shuffle[i]; // current card
            // swap the random card and the current card
            shuffle[i] = shuffle[random]; // move the random card to the current position
            shuffle[random] = current; // put the current card in the random position
        }
        return shuffle; // return shuffled array
    };

    // NEXT QUESTION
    const nextQuestion = () => {
        currentData.options = (shuffleArray(currentData.options) as any);

        setGameState((prevState) => ({
            ...prevState,
            currentQuestion: prevState.currentQuestion + 1,
            userAnswers: [],
        }));
    };

    // RESET GAME STATE
    const resetGame = () => {
        setGameState({
            lives: 3,
            score: 0,
            currentQuestion: 0,
            userAnswers: [],
            gameStatus: "playing",
            settings: { ...gameState.settings }, // Retain settings on reset
        });
    };

    // TOGGLE SOUND
    const toggleSound = () => {
        setGameState((prevState) => ({
            ...prevState,
            settings: { ...prevState.settings, sound: !prevState.settings.sound },
        }));
    };

    // // TOGGLE DARK MODE
    // const toggleDarkMode = () => {
    //     setGameState((prevState) => ({
    //         ...prevState,
    //         settings: { ...prevState.settings, darkMode: !prevState.settings.darkMode },
    //     }));
    // };

    if (gameStatus === "gameOver") {
        return (
            <Modal blur={false} show={true}>
                <div className='p-2 flex flex-col items-center gap-4 px-8'>
                    <h1 className='text-white font-[800] text-[32px] leading-[39px]'>GAME OVER</h1>
                    <Image src={"/game/heartbreak-icon.svg"} alt='Heart break icon' width={83} height={80} />

                    <h3 className='text-2xl text-white font-bold'>Your Final score is: {score}</h3>

                    <div id="buttons" className='flex gap-6 py-2 pb-8'>
                        <div id='restart' className='cursor-pointer' onClick={resetGame}>
                            <div className='p-6 bg-black rounded-lg shadow-xl'><Image src={"/game/restart-icon.svg"} className='w-[34px] h-[41px]' priority width={50} height={50} alt='restart-icon' /></div>
                        </div>

                        <div id='options-icon' className='cursor-pointer'>
                            <div className='p-6 bg-black rounded-lg shadow-xl'><Image src={"/game/options-icon.svg"} className='w-[34px] h-[41px]' priority width={50} height={50} alt='options-icon' /></div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

    if (gameStatus === "won") {
        return (
            <Modal blur={false} show={true}>
                <div className='p-2 flex flex-col items-center gap-2'>
                    <h1 className='text-white font-800 text-[32px] leading-[39px]'>Congratulations!</h1>
                    <video autoPlay src='/game/success.gif' />

                    <p className="text-2xl">You won with a score of {score} / {currentData.correct.length * 5}!</p>

                    <div id="buttons" className='flex gap-3 py-2 pb-8'>
                        <div id='restart' className='' onClick={resetGame}>
                            <div className='p-6 bg-black rounded-lg shadow-xl'><Image src={"/game/restart-icon.svg"} className='w-[34px] h-[41px]' priority width={50} height={50} alt='restart-icon' /></div>
                        </div>

                        <Link href={"/game/menu"} id='menu-icon' className=''>
                            <div className='p-6 bg-black rounded-lg shadow-xl'><Image src={"/game/menu-icon.svg"} className='w-[34px] h-[41px]' priority width={50} height={50} alt='options-icon' /></div>
                        </Link>
                    </div>
                </div>
            </Modal>
        );
    }

    if (!currentData) {
        router.push("/game/menu");
    }

    return (
        <div id='game-page' className='bg-blue-950 p-3 md:p-8 w-full h-screen'>
            {showModal ? <Modal blur show={true}>
                <h1 className='text-white text-4xl font-extrabold p-12'>{compliments[Math.floor(compliments.length * Math.random())]}</h1>
            </Modal> : ""}

            <div id="game-content" className='bg-[url("/game/wood-bg.jpg")] rounded-2xl w-full h-full gap-0 md:pt-6 flex justify-center flex-col md:flex-row lg:gap-5'>

                <div id="sound-pause" className='flex gap-2 lg:gap-6 relative justify-center bottom-12 mt-20 md:pl-3 md:flex-col md:justify-start lg:pt-0'>
                    <div id="sound" onClick={toggleSound} className={`${!gameState.settings.sound ? "bg-red-500" : " bg-white"} scale-75 p-6  rounded-[20px] 
                    cursor-pointer object-contain shadow-lg ease-transition hover:scale-[103%] md:scale-100`}>
                        {!gameState.settings.sound ?
                            <HiMiniSpeakerXMark className=' size-[31px] object-contain' /> :
                            <Image src={"/game/sound-icon.svg"} className='  size-[31px] object-contain ' width={32} height={25} alt='sound icon' />
                        }
                    </div>

                    <div id='pause' className='p-6 bg-white rounded-[20px] scale-75 cursor-pointer object-contain shadow-lg ease-transition hover:scale-[103%]
                    md:scale-100'>
                        <Image src={"/game/pause-icon.svg"} className='w-[28px] h-[25px]' width={28} height={25} alt='pause icon' />
                    </div>
                </div>

                <div id="game-content" className='flex flex-col pb-10 sm:pb-0 md:mr-4 xl:mr-0'>
                    <div id="display-board" className='w-[95%] flex self-center flex-col gap-4 p-4 bg-white rounded-[20px] sm:p-8 lg:mt-4 lg:w-full'>
                        <div id="board-top-section" className='flex w-full gap-1 justify-between'>
                            <span className='leading-[29px] font-[500] text-sm text-nowrap sm:text-[24px] text-black'>Score: {score}</span>
                            <p className='font-[300] text-sm sm:text-[20px] text-nowrap leading-[24px]'>Select the correct words</p>
                            <div id="lives" className='flex gap-1 self-center'>
                                {Array.from({ length: lives }, (_, index) => (
                                    <FaHeart key={index} className="text-red-500" />
                                ))}
                                {Array.from({ length: 3 - lives }, (_, index) => (
                                    <FaHeartBroken key={index} className="text-gray-400" />
                                ))}
                            </div>
                        </div>

                        <div id="acronym" className='w-full flex justify-center items-center gap-3 flex-col py-4'>
                            <h1 className='text-[24px] font-[500] leading-[29px]'>Current Acronym:</h1>
                            <h2 className='text-[24px] font-[700] leading-[29px]'>{currentData.acronym}</h2>
                        </div>

                        <div id="selected-options" className='flex justify-evenly gap-8 pb-2'>
                            {gameState.userAnswers.map(answer => <div key={answer} className='selected-option'>{answer}</div>)}
                        </div>
                    </div>

                    <div id="options" className='grid self-center grid-cols-3 sm:grid-cols-4 gap-8 mt-4 px-8 lg:mt-6' ref={optionsRef}>
                        {currentData.options.map((option: any) => (
                            <div onClick={(e: any) => handleOptionClick(e, (option as string))} className='option' id='option' key={(option as string)}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;

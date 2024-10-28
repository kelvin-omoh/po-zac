'use client';
import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import Image from 'next/image';
import Modal from '../components/Modal/Modal'; // Assume you have a modal component

// Define the structure for each acronym object


// Positive Acronyms Data
const positiveAcronyms = [
    {
        acronym: "SMART",
        options: [
            "A) Specific, Measurable, Achievable, Relevant, Time-bound",
            "B) Strategic, Meaningful, Actionable, Realistic, Tangible",
            "C) Simple, Modest, Attractive, Rewarding, Time-sensitive",
            "D) Systematic, Methodical, Ambitious, Resourceful, Transparent",
        ],
        correct: "A) Specific, Measurable, Achievable, Relevant, Time-bound",
    },
    {
        acronym: "FIGHT",
        options: [
            "A) Focus Intensely, Gain Hope and Trust",
            "B) Finding Inner Growth Helps Transform",
            "C) Fearless Individuals Generate Hope Together",
            "D) Fighting Internal Grit Helps Triumph",
        ],
        correct: "B) Finding Inner Growth Helps Transform",
    },
    {
        acronym: "PEACE",
        options: [
            "A) Promoting Empathy And Community Engagement",
            "B) Practicing Equality And Community Education",
            "C) Providing Every Adult Constructive Education",
            "D) Proposing Everyone Accepts Calm Energy",
        ],
        correct: "A) Promoting Empathy And Community Engagement",
    },
];



const GamePage = () => {
    const [gameState, setGameState] = useState({
        lives: 3,
        score: 0,
        currentQuestion: 0,
        userAnswers: [],
        gameStatus: 'playing',
        settings: {
            sound: true,
            darkMode: false,
        },
    });

    const { currentQuestion, score, lives, gameStatus, userAnswers, settings } = gameState;
    const currentData = positiveAcronyms[currentQuestion];

    const successSound = new Howl({ src: ['/sounds/success.wav'], volume: 0.5 });
    const failSound = new Howl({ src: ['/sounds/fail.wav'], volume: 0.5 });
    const gameOverSound = new Howl({ src: ['/sounds/gameover.wav'], volume: 0.5 });

    const handleOptionClick = (event) => {
        const correctAnswer = currentData.correct;

        if (option === correctAnswer) {
            if (settings.sound) successSound.play();
            setGameState((prevState) => ({
                ...prevState,
                score: prevState.score + 5,
                userAnswers: [...prevState.userAnswers, option],
            }));
            event.currentTarget.classList.add('option-success');
            nextQuestion();
        } else {
            if (settings.sound) failSound.play();
            event.currentTarget.classList.add('option-failure');
            setGameState((prevState) => {
                const newLives = prevState.lives - 1;
                if (newLives <= 0) {
                    if (settings.sound) gameOverSound.play();
                    return {
                        ...prevState,
                        lives: newLives,
                        gameStatus: 'gameOver',
                    };
                }
                return {
                    ...prevState,
                    lives: newLives,
                };
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestion + 1 < positiveAcronyms.length) {
            setGameState((prevState) => ({
                ...prevState,
                currentQuestion: prevState.currentQuestion + 1,
                userAnswers: [],
            }));
        } else {
            setGameState((prevState) => ({
                ...prevState,
                gameStatus: 'won',
            }));
        }
    };

    const resetGame = () => {
        setGameState({
            lives: 3,
            score: 0,
            currentQuestion: 0,
            userAnswers: [],
            gameStatus: 'playing',
            settings: { ...gameState.settings },
        });
    };

    const calculatePercentage = () => {
        return (score / (positiveAcronyms.length * 5)) * 100; // Assuming each correct answer is worth 5 points
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    };

    if (gameStatus === 'gameOver') {
        return (
            <Modal show={true}>
                <div className="flex flex-col items-center gap-4 px-8 py-6">
                    <h1 className="text-black font-extrabold text-4xl">GAME OVER</h1>
                    <Image src="/game/heartbreak-icon.svg" alt="Heartbreak Icon" width={80} height={80} />
                    <h3 className="text-2xl text-white">Final Score: {score}</h3>
                    <button onClick={resetGame} className="p-4 bg-red-600 text-white rounded-lg">Restart Game</button>
                </div>
            </Modal>
        );
    }

    if (gameStatus === 'won') {
        const percentage = calculatePercentage();
        const grade = getGrade(percentage);

        return (
            <Modal show={true}>
                <div className="flex flex-col items-center gap-4 px-8 py-6">
                    <h1 className="text-transparent underline  bg-clip-text bg-gradient-to-r from-[green] via-[#840303] to-[#366f04] font-extrabold text-4xl">Congratulations!</h1>
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[red] to-[white] font-bold text-3xl">Final Score: <span className=' font-mono font-extrabold'>{score}</span> </h3>
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[orange] to-[white] font-bold text-3xl">Percentage: {percentage.toFixed(2)}%</h3>
                    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[orange] via-[black] to-[white] font-bold text-3xl">Grade: {grade}</h3>
                    <button onClick={resetGame} className="p-4 bg-green-600 text-white rounded-lg">Restart Game</button>
                </div>
            </Modal>
        );
    }

    return (
        <div className="relative h-screen flex items-center justify-center">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="/vid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Game Content */}
            <div className="relative z-10 w-full h-full rounded-xl p-6 flex flex-col items-center">
                <div className="flex justify-between w-full">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-[white] font-bold text-5xl">
                        Score: {score}
                    </div>

                    <div className="flex">
                        {Array.from({ length: lives }, (_, i) => (
                            <FaHeart key={i} className="text-red-500 mx-1" />
                        ))}
                        {Array.from({ length: 3 - lives }, (_, i) => (
                            <FaHeartBroken key={i} className="text-gray-500 mx-1" />
                        ))}
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-xl text-center">
                    <h2 className="text-2xl font-bold">{currentData.acronym}</h2>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {currentData.options.map((option) => (
                            <button
                                key={option}
                                onClick={(e) => handleOptionClick(e, option)}
                                className="bg-blue-200 p-4 rounded-lg hover:bg-blue-300"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;

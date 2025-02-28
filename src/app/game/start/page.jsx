"use client";
import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { Howl } from "howler";
import {gameAcronyms, compliments} from "./utils";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { HiMiniSpeakerXMark } from "react-icons/hi2";
import { db, leaderboardCollection } from '../../../../firebaseConfig';
import { addDoc, collection } from "firebase/firestore";
import {
    query, where, getDocs, updateDoc, doc, onSnapshot
} from 'firebase/firestore';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Page = () => {
    const router = useRouter();
    const optionsRef = useRef(null);
    const [showComplimentModal, updateShowComplimentModal] = useState(false);
    // const [user, loading, error] = useAuthState(auth, options);
    const [gameState, setGameState] = useState({
        lives: 3,
        score: 0,
        currentQuestion: 0,
        userAnswers: [],
        gameStatus: "playing",
        currentLevel: 0,
        settings: { sound: true, darkMode: false }
    });
    const [gameData, updateGameData] = useState(gameAcronyms);

    const { currentQuestion, score, lives, gameStatus, userAnswers, settings, currentLevel } = gameState;
    const [leaderboard, setLeaderboard] = useState([]);
    const [numberOfPlayers, setnumberOfPlayers] = useState(0);
    const currentData = gameData[currentLevel]; // Use gameData for currentLevel

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const LeaderboardChart = ({ leaderboard }) => {
        const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768); // Adjust the width as needed

        useEffect(() => {
            const handleResize = () => {
                setIsSmallScreen(window.innerWidth < 768);
            };

            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);

        // console.log(leaderboard);

        // Get top 5 players
        const top5Leaderboard = leaderboard
            .sort((a, b) => b.score - a.score) // Sort in descending order by score
            .slice(0, 5); // Take only the top 5 players

        // console.log(top5Leaderboard);
        const leadershipColors = [
            '#FFD700', // Gold for the top rank (Yellow-Gold, typical of gold medals)
            '#C0C0C0', // Silver for the second rank (Standard metallic silver)
            '#B87333', // Bronze (A darker, more authentic bronze color)
            '#4682B4', // Steel Blue (A slightly muted blue for a strong, serious tone)
            '#228B22', // Forest Green (A deeper green for a grounded, mature rank)
        ];
        const data = {
            labels: top5Leaderboard.map(user => formatName(user?.displayName || user?.name)),
            datasets: [
                {
                    label: 'High Scores',
                    data: top5Leaderboard.map(user => user?.score),
                    backgroundColor: top5Leaderboard.map((_, index) => leadershipColors[index] || '#808080'), // Map colors or default to gray
                    borderColor: 'rgba(255, 255, 255, 0.8)', // White border for clarity
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            indexAxis: 'y', // Horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'white', // Light grid lines
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)', // Light color for x-axis labels
                    },
                },
                y: {
                    grid: {
                        color: '#818180', // Light grid lines
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.8)', // Light color for y-axis labels
                        font: {
                            size: isSmallScreen ? 10 : 14, // Dynamic font size based on screen size
                            weight: '500',
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 1)', // White legend text
                        font: {
                            size: isSmallScreen ? 10 : 10, // Dynamic font size for legend
                            weight: 'bold',
                        },
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark tooltip background
                    titleColor: 'rgba(255, 255, 255, 1)', // White title in tooltip
                    bodyColor: 'rgba(255, 255, 255, 0.9)', // White body text in tooltip
                    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle border for tooltip
                    borderWidth: 1,
                },
            },
        };

        return (
            <div className="w-full hidden lg:block">
                {isSmallScreen ? (
                    // Render Pie chart for small screens
                    <Bar data={data} options={options} />
                ) : (
                    // Render Bar chart for larger screens
                    <Bar data={data} options={options} />
                )}
            </div>
        );
    };

    const getAward = (rank) => {
        if (rank === 1) return '🏆🥇';  // Gold and big cup for first place
        if (rank === 2) return '🥈';   // Silver medal for second place
        if (rank === 3) return '🥉';   // Bronze medal for third place
        return '🎖'; // General award for others
    };


    const formatName = (name) => {
        const nameParts = name?.split(' ');
        if (nameParts?.length > 1) {
            // If there are multiple names, return "FirstName.LastInitial"
            return `${nameParts[0]} .${nameParts[1][0]}  `;
        }
        return name; // Otherwise, return the name as it is
    };

    useEffect(() => {
        // randomize the gateData // comment this out for easier testing
        updateGameData(shuffleArray(gameAcronyms));
        
        const fetchLeaderboard = async () => {
            try {
                const scoresSnapshot = await getDocs(leaderboardCollection);
                const scoresList = scoresSnapshot.docs.map(doc => doc.data());

                setnumberOfPlayers(scoresList.length)

                // Filter and sort by score in descending order
                const sortedList = scoresList
                    .filter(user => user.name || user.displayName && user.score !== undefined)
                    .sort((a, b) => b.score - a.score);

                setLeaderboard(sortedList);
                // console.log(sortedList); // Debugging to check sorted list output

            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };

        fetchLeaderboard();
    }, []);


    const [user, setUser] = useState(null);

    useEffect(() => {
        // This code runs only on the client side
        const userDetails = localStorage.getItem("userDetails");
        const parsedUser = userDetails ? JSON.parse(userDetails) : null;
        // console.log(parsedUser);

        setUser(parsedUser);
    }, []);

    const saveScoreToFirebase = async (user, score) => {
        const userDetails = localStorage.getItem("userDetails");
        const parsedUser = userDetails ? JSON.parse(userDetails) : null;
        // console.log(parsedUser);

        setUser(parsedUser);
        // console.log(user);
        // console.log(localStorage.getItem("userDetails"));


        if (!user) {
            console.error("User not found. Cannot save score.");
            return;
        }

        try {
            const userQuery = query(
                leaderboardCollection,
                where("email", "==", user.email)
            );

            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const existingUserDoc = querySnapshot.docs[0];
                const userDocRef = doc(leaderboardCollection, existingUserDoc.id);

                await updateDoc(userDocRef, { score });
                // console.log("Score updated successfully.");
            } else {
                await addDoc(leaderboardCollection, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    score: score
                });
                // console.log("Score saved successfully.");
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(leaderboardCollection, (snapshot) => {
            const updatedLeaderboard = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            setLeaderboard(updatedLeaderboard);
        });

        return () => unsubscribe();
    }, []);




    const successSound = new Howl({ src: ["/sounds/success.wav"], volume: 0.5 });
    const failSound = new Howl({ src: ["/sounds/fail.wav"], volume: 0.5 });
    const gameOverSound = new Howl({ src: ["/sounds/gameover.wav"], volume: 0.5 });
    useEffect(() => {
        if (currentData?.options) {
            currentData.options = shuffleArray(currentData.options);
        }
    }, [currentData]);

    const chartData = {
        labels: leaderboard.map((_, i) => `User ${i + 1}`),
        datasets: [{
            label: 'Scores',
            data: leaderboard.map(entry => entry.score),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const handleOptionClick = (event, option) => {
        const correctAnswer = currentData?.correct[userAnswers.length];

        if (option === correctAnswer) {
            if (settings.sound) successSound.play();
            setGameState(prevState => ({
                ...prevState,
                score: prevState.score + 5,
                userAnswers: [...prevState.userAnswers, option]
            }));

            event.target.classList.add("option-success");
            Array.from(optionsRef.current.children).forEach(element => element.classList.remove('option-failure'));

            if (score !== 0 && score % 50 === 0) temporarilyShowModal();

            if (userAnswers.length + 1 === currentData.correct.length) {
                if (currentQuestion + 1 >= gameData.length) {
                    setGameState(prevState => ({ ...prevState, gameStatus: "won" }));
                } else {
                    Array.from(optionsRef.current.children).forEach(element => {
                        element.classList.remove('option-success', 'option-failure');
                    });
                    currentData.options = shuffleArray(currentData.options);
                    nextQuestion();
                }
            }
        } else {
            if (settings.sound) failSound.play();
            event.target.classList.add("option-failure");
            setGameState(prevState => {
                const newLives = prevState.lives - 1;
                if (newLives <= 0) {
                    if (settings.sound) gameOverSound.play();
                    return { ...prevState, lives: newLives, gameStatus: "gameOver" };
                }
                return { ...prevState, lives: newLives };
            });
        }
    };

    const temporarilyShowModal = () => {
        updateShowComplimentModal(true);
        setTimeout(() => updateShowComplimentModal(false), 1500);
    }

    function shuffleArray(array) {
        const shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[random]] = [shuffledArray[random], shuffledArray[i]];
        }
        return shuffledArray;
    }

    const nextQuestion = () => {
        currentData.options = shuffleArray(currentData.options);

        if (userAnswers.length + 1 === currentData.correct.length) {
            const nextLevelIndex = currentLevel + 1;
            if (nextLevelIndex < gameData.length) {
                setGameState(prevState => ({ ...prevState, currentLevel: nextLevelIndex, userAnswers: [] }));
            } else {
                setGameState(prevState => ({ ...prevState, gameStatus: "won" }));
            }
        } else {
            setGameState(prevState => ({ ...prevState, userAnswers: [] }));
        }
    };

    const resetGame = () => {
        setGameState({
            lives: 3,
            score: 0,
            currentQuestion: 0,
            currentLevel: 0,
            userAnswers: [],
            gameStatus: "playing",
            settings: { ...gameState.settings }
        });

        // shuffle all the acronyms for each game session
        const previousGameData = [...gameData];
        updateGameData(shuffleArray(previousGameData));        
    };

    const toggleSound = () => {
        setGameState(prevState => ({ ...prevState, settings: { ...prevState.settings, sound: !prevState.settings.sound } }));
    };

    if (!currentData) {
        router.push("/game/menu");
    }

    useEffect(() => {
        if (gameStatus === "gameOver" || gameStatus === "won") {
            saveScoreToFirebase(user, score);
        }
    }, [gameStatus, score]);


    useEffect(() => {
        currentData.options = shuffleArray(currentData.options);
    }, [currentData])

    useEffect(() => {
        if (currentData.options) {
            currentData.options = shuffleArray(currentData.options);
        }
    }, [currentData, currentData.acronym])



    function shuffleArray(array) {
        const length = array.length;
        const shuffle = array.slice(); // copy of array
        // loop over the array
        for (let i = length - 1; i > 0; i -= 1) {
            const random = Math.floor(Math.random() * (i + 1)); // random card position
            const current = shuffle[i]; // current card
            // swap the random card and the current card
            shuffle[i] = shuffle[random]; // move the random card to the current position
            shuffle[random] = current; // put the current card in the random position
        }
        return shuffle; // return shuffled array
    };


    const renderLeaderboard = (leaderboard) => {
        let displayRank = 1;
        let previousScore = null;
        let rankOffset = 0; // Offset to handle rank progression after ties


        return leaderboard
            .sort((a, b) => b.score - a.score) // Sort in descending order by score
            .slice(0, 5) // Take only the top 5 users
            .map((user, index) => {
                if (user.score !== previousScore) {
                    displayRank = index + 1 - rankOffset; // Update display rank for a new score
                } else {
                    rankOffset++; // Increment rank offset if scores are tied
                }
                previousScore = user.score;
                return (
                    <li className=' text-white text-nowrap py-2 text-[16px] md:text-[18px]' key={index}>
                        {index + 1} - {formatName(user.displayName || user.name)}
                        <span className='text-sm  font-bold lg:text-[35px]'>{getAward(displayRank)}
                        </span> ~ {user.score}
                    </li>
                );
            });
    };

    const fetchLeaderboardData = async () => {
        const leaderboardCollection = collection(db, 'leaderboard'); // Adjust your collection name
        const querySnapshot = await getDocs(leaderboardCollection);
        const userScores = {};

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const { displayName, score } = data;

            // Store the highest score for each user
            if (!userScores[displayName] || userScores[displayName] < score) {
                userScores[displayName] = score;
            }
        });

        // Convert to an array of { name, score } objects
        return Object.entries(userScores).map(([name, score]) => ({ name, score }));
    };


    useEffect(() => {
        const getData = async () => {
            const data = await fetchLeaderboardData();
            setLeaderboard(data);
        };
        getData();
    }, []);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        setShowLeaderboard(false);
        if (gameStatus === "gameOver") {
            // Show leaderboard after 5 seconds
            const timer = setTimeout(() => {
                setShowLeaderboard(true);
            }, 3500);

            // Clear the timer if the component unmounts or game status changes
            return () => clearTimeout(timer);
        }
    }, [gameStatus]);

    if (gameStatus === "gameOver") {
        // saveScoreToFirebase(score);
        return (
            // <Modal blur={false} show={true}>
            <div className='w-screen absolute min-h-[100vh] max-w-screen z-[500] top-0 left-0 p-8 flex justify-center items-center bg-blue-950 backdrop-blur-[15px] cursor-pointer'>
                {!showLeaderboard ? (
                    // First Div (GAME OVER Screen)
                    <div className='bg-[url("/game/wood-bg.jpg")] md:h-[100%] md:w-[40%]  w-full p-4 rounded-2xl mx-4 sm:mx-0 sm:p-8 cursor-default'>
                        <div className='p-2 flex flex-col justify-center  items-center gap-4 px-8'>
                            <h1 className='text-white font-[800] text-[32px] leading-[39px]'>GAME OVER</h1>
                            <Image src={"/game/heartbreak-icon.svg"} alt='Heart break icon' width={83} height={80} />
                            <h3 className='text-2xl text-white font-bold'>Your Final score is: {score}</h3>
                            <div id="buttons" className='flex gap-6 py-2 pb-8'>
                                {/* <div id='restart' className='cursor-pointer' onClick={resetGame}>
                                    <div className='p-6 bg-black rounded-lg shadow-xl'>
                                        <Image src={"/game/restart-icon.svg"} className='w-[34px] h-[41px]' priority width={50} height={50} alt='restart-icon' />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Second Div (Highest Rank)
                    <div className='bg-[url("/game/wood-bg.jpg")] max-w-screen p-4 rounded-lg sm:p-8 '>
                        <div className="bg-[#313131cc] w-[70vw] rounded backdrop-blur-sm flex flex-col p-8 max-h-screen">
                            <p className='text-white top-3 left-9 text-center mt-[12px]'>Total Number of Players : <span className=' text-[#f89b06] text-[18px] font-semibold'>{300 + numberOfPlayers}</span></p>
                            <h1 className=" text-2xl md:text-3xl font-extrabold underline text-center font-arsenal text-white  pb-4">THE BIG 5 (RANKING)</h1>

                            <div id="leaderboard-list-and-chart-wrapper" className='flex justify-center'>
                                <ul className='basis-[80%] text-sm lg:basis-[65%]'>{renderLeaderboard(leaderboard)}</ul>
                                <LeaderboardChart leaderboard={leaderboard} />
                            </div>
                            <div id='restart' className='cursor-pointer self-center' onClick={resetGame}>
                                <div className='p-3 mt-[.9rem] text-center self-center justify-center  w-[15rem] bg-[#dd8c23] rounded-full flex gap-2 items-center  text-[1.2rem] text-white  shadow-xl'>
                                    <Image src={"/game/restart-icon.svg"} className='w-[24px] h-[21px]' priority width={50} height={50} alt='restart-icon' />
                                    Try again
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (gameStatus === "won") {
        // saveScoreToFirebase(score);
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


                <div>
                    <h2>Leaderboard</h2>
                    <ul>
                        {leaderboard.map((entry, index) => (
                            <li key={index}>{entry.score}</li>
                        ))}
                        {LeaderboardChart(leaderboard)}
                    </ul>
                </div>

                <div>
                    <h2>Leaderboard Chart</h2>
                    <Bar data={chartData} />
                </div>
            </Modal>
        );
    }

    if (!currentData) {
        router.push("/game/menu");
    }


    // useEffect(() => {
    //     if (gameStatus === "gameOver" || gameStatus === "won") {
    //         // saveScoreToFirebase(score);
    //     }
    // }, [gameStatus, score]);

    return (
        <div id='game-page' className='bg-blue-950 p-3 grid max-w-screen  md:p-0 w-full min-h-screen md:h-screen'>
            {showComplimentModal ? <Modal blur show={true}>
                <h1 className='text-white text-4xl text-center font-extrabold p-12'>{compliments[Math.floor(compliments.length * Math.random())]}</h1>
            </Modal> : ""}

            <div id="game-content" className='bg-[url("/game/wood-bg.jpg")] max-w-screen rounded-2xl w-full  gap-0 md:pt-6 flex justify-center flex-col md:flex-row lg:gap-5'>

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

                <div id="details-options" className='flex flex-col pb-10 max-w-screen sm:pb-0 md:mr-4 xl:mr-0'>
                    <div id="display-board" className='w-[95%] flex self-center flex-col gap-4  bg-white rounded-[20px] p-8 lg:mt-4 lg:w-full'>
                        <div id="board-top-section" className='flex flex-col w-full gap-1 justify-between items-center xs:flex-row xs:items-start'>
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
                        {currentData.options.map((option) => (
                            <div onClick={(e) => handleOptionClick(e, option)} className='option' id='option' key={option}>
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

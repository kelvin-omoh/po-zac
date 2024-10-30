'use client'
import { Bar } from 'react-chartjs-2';

const LeaderboardChart = ({ leaderboard }) => {
    const data = {
        labels: leaderboard.map(user => user.name),
        datasets: [
            {
                label: 'High Scores',
                data: leaderboard.map(user => user.score),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
};



export default LeaderboardChart 
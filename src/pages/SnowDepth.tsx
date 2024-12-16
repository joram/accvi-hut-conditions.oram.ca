import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "../components/Header.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function SnowDepth() {
    let [depths, setDepths] = React.useState([]);

    React.useEffect(() => {
        const url = `https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/snow_depths.json`;
        fetch(url).then((response) => {

            response.text().then((data) => {
                const dataJson = JSON.parse(data.replace(/'/g, '"'));
                setDepths(dataJson);
            });
        });
    }, []);

    console.log(depths);
    let labels = Object.keys(depths); // Extract timestamps
    const values = Object.values(depths); // Extract numeric values

    // Chart.js data
    const chartData = {
        labels, // x-axis labels
        datasets: [
            {
                data: values, // y-axis values
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.3, // Smooth lines
            }

        ],
    };

    // Chart.js options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Snow Depth (cm)',
                },
            },
        },
        elements: {
            line: {
                tension: 0.8 // Adjust smoothing level
            },
            point: {
                radius: 3
            }
        }
    };

    return <>
        <Header/>
        <Line data={chartData} options={options} />
        </>

}

export default SnowDepth;
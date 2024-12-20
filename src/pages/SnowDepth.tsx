import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "../components/Header.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function SnowDepth() {
    let [depths, setDepths] = React.useState({});

    React.useEffect(() => {
        const url = `https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/snow_depth/summary.json`;

        fetch(url)
            .then((response) => response.json()) // Directly parse as JSON
            .then((dataJson) => {
                const bucketed: any  = {};

                // Process each entry in the barometer
                Object.entries(dataJson.values).forEach(([key, value]) => {
                    if (value === 0) return; // Skip zero values

                    // Format the date
                    const [dateStr, timeStr] = key.split("T");
                    const timeFormatted = timeStr.replace(/-/g, ":").replace("Z", ""); // Replace '-' with ':' in time
                    const isoString = `${dateStr}T${timeFormatted}Z`;
                    const date = new Date(isoString);

                    // Filter hours between 6 AM and 6 PM
                    const hour = date.getHours();
                    if (hour < 6 || hour > 18) return;

                    // Bucket by "MM/DD AM/PM"
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const bucketKey = `${date.getMonth() + 1}/${date.getDate()} ${ampm}`;

                    // Initialize and push values to the bucket
                    if (!bucketed[bucketKey]) bucketed[bucketKey] = [];
                    bucketed[bucketKey].push(value);
                });

                // Calculate averages for each bucket
                const bucketedAverages: any = {};
                Object.entries(bucketed).forEach(([key, values]: [string, any]) => {
                    const sum = values.reduce((a: any, b: any) => a + b, 0);
                    bucketedAverages[key] = sum / values.length;
                });

                // Update state with bucketed averages
                setDepths(bucketedAverages);
            })
            .catch((error) => console.error("Error fetching or parsing barometer:", error));
    }, []);

    let labels = Object.keys(depths); // Extract timestamps
    const values = Object.values(depths); // Extract numeric values

    // Chart.js barometer
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
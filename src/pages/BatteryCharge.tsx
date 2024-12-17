import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "../components/Header.tsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function BatteryCharge() {
    let [batteryCharge, setBatteryCharge] = React.useState({});

    React.useEffect(() => {
        const url = `https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/inverter_data/summary.json`;

        fetch(url)
            .then((response) => response.json()) // Directly parse as JSON
            .then((dataJson) => {
                const values: any = {};
                Object.keys(dataJson.values).forEach((k) => {
                    const dateStr = k.split("T")[0];
                    let hourStr = k.split("T")[1];
                    if(hourStr.length==1){
                        hourStr = "0"+hourStr;
                    }
                    const isoString = `${dateStr}T${hourStr}:00:00Z`;
                    const date = new Date(isoString);
                    const ampm = date.getHours() >= 12 ? "PM" : "AM";
                    const key = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}${ampm}`;
                    values[key] = dataJson.values[k];

                })
                setBatteryCharge(values);
            })
            .catch((error) => console.error("Error fetching or parsing data:", error));
    }, []);

    let labels = Object.keys(batteryCharge); // Extract timestamps
    labels = labels.sort()

    const values: any [] = []
    labels.forEach((k) => {
        // @ts-ignore
        const v = batteryCharge[k];
        values.push(v);
    })

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
                    text: '% charged)',
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

export default BatteryCharge;
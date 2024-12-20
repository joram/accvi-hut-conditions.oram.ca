import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Plugin} from 'chart.js';
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
                    values[isoString] = dataJson.values[k];

                })
                setBatteryCharge(values);
            })
            .catch((error) => console.error("Error fetching or parsing barometer:", error));
    }, []);

    let labelStrings = Object.keys(batteryCharge); // Extract timestamps
    labelStrings = labelStrings.sort()
    let labels: any[] = []
    const values: any [] = []
    labelStrings.forEach((k) => {
        // @ts-ignore
        const v = batteryCharge[k];
        values.push(v);

        const date = new Date(k);
        let hours = date.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        const key = `${date.getMonth() + 1}/${date.getDate()} ${hours}${ampm}`;
        labels.push(key);
    })

    const horizontalLinePlugin: Plugin = {
        id: 'horizontalLine',
        beforeDraw(chart:any) {
            const {ctx, chartArea: {top, bottom, left, right}, scales: {y}} = chart;

            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;

            // Horizontal line at y=35
            ctx.beginPath();
            ctx.moveTo(left, y.getPixelForValue(35));
            ctx.lineTo(right, y.getPixelForValue(35));
            ctx.stroke();

            // Horizontal line at y=75
            ctx.beginPath();
            ctx.moveTo(left, y.getPixelForValue(75));
            ctx.lineTo(right, y.getPixelForValue(75));
            ctx.stroke();

            ctx.restore();
        }
    };

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
        <Line data={chartData} options={options} plugins={[horizontalLinePlugin]}/>
        </>

}

export default BatteryCharge;
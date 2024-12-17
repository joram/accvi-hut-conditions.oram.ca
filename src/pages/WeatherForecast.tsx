import React from "react";
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
// @ts-ignore
import { Bar, Line } from 'react-chartjs-2';
import Header from "../components/Header.tsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Hourly Temperature and Precipitation",
        },
    },
    scales: {

        x: {
            title: {
                display: true,
                text: "Day",
            },
        },
        y: {
            display: false,
            position: "right",
        },
    },
};

function WeatherForecast() {
    let [forecast, setForecast]:[any, any] = React.useState(null);

    React.useEffect(() => {
        fetch("https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/weather_forecast/latest.json").then((response) => {
            response.json().then((data) => {
                setForecast(data);
            });
        });
    }, []);

    if (!forecast) {
        return <div>Loading...</div>;
    }
    let weatherData: any[] = [];

    // @ts-ignore
    forecast.properties.timeseries.forEach((entry) => {
        const date = new Date(entry.time);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });
        let precipitation = 0;
        let symbol = null;
        if (entry.data.next_1_hours) {
            precipitation = entry.data.next_1_hours.details.precipitation_amount || 0;
            symbol = entry.data.next_1_hours.summary.symbol_code;
        }
        weatherData.push({
            day: day,
            temperature: entry.data.instant.details.air_temperature,
            precipitation: precipitation,
            symbol: symbol,
        })
    })

    const chartData = {
        labels: weatherData.map((entry) => entry.day), // X-axis labels (days)
        datasets: [
            {
                type: "line",
                label: "Temperature (°C)",
                data: weatherData.map((entry) => entry.temperature),
                borderColor: "#ff7300",
                backgroundColor: "rgba(255, 115, 0, 0.2)",
                yAxisID: "y-temperature",
            },
            {
                label: "Precipitation (mm)",
                data: weatherData.map((entry) => entry.precipitation),
                backgroundColor: "rgba(0, 136, 254, 0.7)",
                borderColor: "#0088fe",
                borderWidth: 1,
                yAxisID: "y-precipitation",
            },
        ],
    };


    // @ts-ignore
    let line = <Line data={chartData} options={options} />
    return (
        <div>
            <Header/>
            {line}
        </div>
    );
}

export default WeatherForecast;``

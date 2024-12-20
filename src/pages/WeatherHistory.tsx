import React, {useEffect} from "react";
import Header from "../components/Header.tsx";
import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Plugin
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



function WeatherStationGraph(props: { barometer: any, temperature: any, humidity: any, windSpeed: any, solarRadiation: any, snowDepth: any, sunSet: any, sunRise: any, rainDay: any }) {
    let labels = Object.keys(props.barometer); // Extract timestamps
    const barometerValues = Object.values(props.barometer); // Extract numeric values
    const temperatureValues = Object.values(props.temperature); // Extract numeric values
    const humidityValues = Object.values(props.humidity); // Extract numeric values
    const windSpeedValues = Object.values(props.windSpeed); // Extract numeric values
    const solarRadiationValues = Object.values(props.solarRadiation); // Extract numeric
    // const rainDayValues = Object.values(props.rainDay); // Extract numeric
    const snowDepthValues = Object.values(props.snowDepth); // Extract numeric

    let keys = Object.keys(props.sunSet)
    let visitedDates: any = {}
    let nighttimes: any = []
    keys.forEach((k: any) => {
        if (visitedDates[k.split(" ")[0]] !== undefined) {
            return
        } else {
            visitedDates[k.split(" ")[0]] = true
        }
        const sunSet = props.sunSet[k]
        const sunRiseKey = keys[keys.indexOf(k) + 1]
        if (sunRiseKey === undefined) {
            return
        }
        const sunRiseTomorrow = props.sunRise[sunRiseKey]
        nighttimes.push({
            sunSet:sunSet,
            sunRise: sunRiseTomorrow,
            sunSetDate:k.split(" ")[0],
            sunRiseDate:keys[keys.indexOf(k) + 1].split(" ")[0],
        })
    })
    function onlyUnique(value:any, index:any, array:any) {
        return array.indexOf(value) === index;
    }
    nighttimes = nighttimes.filter(onlyUnique);
    console.log(nighttimes)

    // @ts-ignore
    const nighttimePlugin: Plugin = {
        id: "nighttimeBackground",
        beforeDraw: (chart:any) => {
            const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;

            ctx.save();
            ctx.fillStyle = "rgba(128,128,128,0.2)"; // Gray with transparency

            nighttimes.forEach((nighttime: any) => {
                // format MM/DD HHAM/PM
                const start = nighttime.sunSetDate+" "+(nighttime.sunSet-12)+"PM";
                const end = nighttime.sunRiseDate+" "+nighttime.sunRise+"AM";
                const startX = x.getPixelForValue(start);
                const endX = x.getPixelForValue(end);

                ctx.fillRect(startX, top, endX - startX, bottom - top);
            });

            ctx.restore();
        },
    };

    // Chart.js barometer
    const chartData = {
        labels, // x-axis labels
        datasets: [
            {
                label: "Barometer",
                data: barometerValues,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.3,
                yAxisID: 'yBarometer',
            }, {
                label: "Temperature",
                data: temperatureValues,
                borderColor: 'rgba(192,75,192,1)',
                backgroundColor: 'rgba(192,75,192,0.2)',
                tension: 0.3,
                yAxisID: 'y',
            }, {
                label: "Humidity",
                data: humidityValues,
                borderColor: 'rgba(75,75,192,1)',
                backgroundColor: 'rgba(75,75,192,0.2)',
                tension: 0.3,
                yAxisID: 'y',
                hidden: true,
            }, {
                label: "Wind Speed",
                data: windSpeedValues,
                borderColor: 'rgba(192,75,75,1)',
                backgroundColor: 'rgba(192,75,75,0.2)',
                tension: 0.3,
                yAxisID: 'y',
                hidden: true,
            }, {
                label: "Solar Radiation",
                data: solarRadiationValues,
                borderColor: 'rgba(192,192,75,1)',
                backgroundColor: 'rgba(192,192,75,0.2)',
                tension: 0.3,
                hidden: true,
                yAxisID: 'ySolar',
            }, {
                label: "Snow Depth",
                data: snowDepthValues,
                borderColor: 'rgba(75,192,75,1)',
                backgroundColor: 'rgba(75,192,75,0.2)',
                tension: 0.3,
                yAxisID: 'ySnow',
            }
        ],
    };

    // Chart.js options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
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
                type: "linear",
                position: "left",
            },
            yBarometer: {
                type: "linear",
                position: "left",
                title: {
                    display: true,
                    text: "Barometric Pressure (hPa)",
                },
            },
            ySolar: {
                type: "linear",
                position: "right",
                title: {
                    display: true,
                    text: "Solar (°C)",
                },
                grid: {
                    drawOnChartArea: false, // Prevent gridlines from overlapping
                },
            },
            ySnow: {
                type: "linear",
                position: "right",
                title: {
                    display: true,
                    text: "Snow Depth (cm)",
                },
                grid: {
                    drawOnChartArea: false, // Prevent gridlines from overlapping
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

    // @ts-ignore
    const line = <Line data={chartData} options={options} plugins={[nighttimePlugin]}/>
    return <>
        <Header/>
        {line}
    </>
}


function WeatherHistory() {
    let [data, setData] = React.useState(null);
    let [barometer, setBarometer] = React.useState(null);
    let [temperature, setTemperature] = React.useState(null);
    let [humidity, setHumidity] = React.useState(null);
    let [windSpeed, setWindSpeed] = React.useState(null);
    let [solarRadiation, setSolarRadiation] = React.useState(null);
    let [rainDay, setRainDay] = React.useState(null);
    let [sunSet, setSunSet] = React.useState(null);
    let [sunRise, setSunRise] = React.useState(null);
    let [snowDepth, setSnowDepth] = React.useState(null);


    function extractValues(data: any, attribute: string) {
        const keys = Object.keys(data.values)
        let barometerValues: any = {}
        keys.forEach((k: any) => {
            const dt = new Date(k)
            const shortKey = `${dt.getMonth() + 1}/${dt.getDate()} ${dt.getHours() % 12}${dt.getHours() >= 12 ? "PM" : "AM"}`
            barometerValues[shortKey] = parseFloat(data.values[k][attribute])
        })
        return barometerValues
    }

    function convertFareignheitToCelsius(data: any) {
        const keys = Object.keys(data)
        let celsiusValues: any = {}
        keys.forEach((k: any) => {
            celsiusValues[k] = (data[k] - 32) * 5 / 9
        })
        return celsiusValues
    }

    function cleanSnowData(data: any) {
        let keys = Object.keys(data)
        keys = keys.sort()
        let snowValues: any = {}
        let lastGoodValue = 0
        keys.forEach((k: any) => {
            const date = k.split("T")[0]
            const time = k.split("T")[1].replace("-", ":").split("-")[0]
            const s = `${date}T${time}`
            let dt = new Date(s)
            const shortKey = `${dt.getMonth() + 1}/${dt.getDate()} ${dt.getHours() % 12}${dt.getHours() >= 12 ? "PM" : "AM"}`
            const value = data[k]
            snowValues[shortKey] = value
            if (value === 0) {
                snowValues[shortKey] = lastGoodValue
            } else if (value > 600) {
                snowValues[shortKey] = lastGoodValue
            } else {
                lastGoodValue = value
            }
            const hr = dt.getHours()
            if (hr < 9 || hr > 17) {
                snowValues[shortKey] = undefined
            }
        })
        return snowValues
    }

    useEffect(() => {
        let url = "https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/weather_station/summary.json"
        fetch(url).then((response) => response.json()).then((dataJson) => {
            url = `https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/snow_depth/summary.json`;
            fetch(url).then((response) => response.json()).then((snowData) => {
                setData(dataJson);
                setBarometer(extractValues(dataJson, "Barometer"))
                setTemperature(convertFareignheitToCelsius(extractValues(dataJson, "TempOut")))
                setHumidity(extractValues(dataJson, "HumOut"))
                setWindSpeed(extractValues(dataJson, "WindSpeed"))
                setSolarRadiation(extractValues(dataJson, "SolarRad"))
                setRainDay(extractValues(dataJson, "RainDay"))
                setSunSet(extractValues(dataJson, "SunSet"))
                setSunRise(extractValues(dataJson, "SunRise"))
                setSnowDepth(cleanSnowData(snowData.values))

            })
        })

    }, []);


    if (data === null) {
        return <div>Loading...</div>
    }

    return <>
        <WeatherStationGraph
            barometer={barometer}
            temperature={temperature}
            humidity={humidity}
            windSpeed={windSpeed}
            solarRadiation={solarRadiation}
            snowDepth={snowDepth}
            sunSet={sunSet}
            sunRise={sunRise}
            rainDay={rainDay}
        />
    </>

}

export default WeatherHistory;
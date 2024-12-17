function renderForecast(forecast){
    // Sample weather data
    let weatherData = [];
    forecast.properties.timeseries.forEach((entry) => {
      console.log(entry.data)
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


    // Extract labels and data
    const labels = weatherData.map((entry) => entry.day);
    const temperatures = weatherData.map((entry) => entry.temperature);
    const precipitations = weatherData.map((entry) => entry.precipitation);
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
            Ytemperature: {
        type: "linear",
            position: "left",
            title: {
            display: true,
                text: "Temperature (°C)",
        },
        ticks: {
            beginAtZero: true,
        },
    },
    Yprecipitation: {
        type: "linear",
            position: "right",
            title: {
            display: true,
                text: "Precipitation (mm)",
        },
        grid: {
            drawOnChartArea: false, // Prevent grid lines from overlapping
        },
        ticks: {
            beginAtZero: true,
        },
    },
},
};
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
                type: "bar",
                label: "Precipitation (mm)",
                data: weatherData.map((entry) => entry.precipitation),
                backgroundColor: "rgba(0, 136, 254, 0.7)",
                borderColor: "#0088fe",
                borderWidth: 1,
                yAxisID: "y-precipitation",
            },
        ],
    };

    // Temperature Line Chart
    const temperatureCtx = document.getElementById("temperatureChart").getContext("2d");
    new Chart(temperatureCtx, {
        type: "line",
        data: chartData,
        options: options,
    });
}
function updateWeatherForecast(){
    fetch("/weather_forecast").then((response) => {
        response.json().then((data) => {
            renderForecast(data);
        });
    })
}

updateWeatherForecast()
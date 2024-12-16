const avalanche_data = {
    "report": {
        "forecaster": "Avalanche Canada",
        "dateIssued": "2024-12-11T00:00:00Z",
        "validUntil": "2024-12-12T00:00:00Z",
        "title": "East Island-North Island-South Island-West Island",
        "highlights": "Observations are very limited so don't let your guard down. Triggerable wind slabs may still exist in alpine terrain.",
        "dangerRatings": [
            { "date": "2024-12-12", "alp": "Low", "tln": "Low", "btl": "Low" },
            { "date": "2024-12-13", "alp": "Low", "tln": "Low", "btl": "Low" },
            { "date": "2024-12-14", "alp": "Moderate", "tln": "Low", "btl": "Low" }
        ],
        "summaries": [{ "type": "weather-summary", "content": "Cloudy with up to 5 cm of snow." }]
    },
    "media": {
        "images": [
            {
                "url": "http://res.cloudinary.com/forecasts/image/upload/v1733769222/prod/avcan/n5pizaxawdf6foycssrv.jpg",
                "altText": "Shows good turns in cold snow and some roller-balling from rocky features."
            }
        ]
    }
};


function updateWeatherStationData(){
    const electricityData = {
        Datetime: '2024-12-10 21:24:22.046079',
        BarTrend: '236',
        Barometer: '25.69',
        TempIn: '47.8',
        HumIn: '49',
        TempOut: '43.8',
        WindSpeed: '6',
        WindSpeed10Min: '15',
        WindDir: '359',
        HumOut: '19',
        RainRate: '0.0',
        UV: '255',
        SolarRad: '32767',
        RainStorm: '0.27',
        StormStartDate: '2069-1-17',
        RainDay: '0.27',
        RainMonth: '1.68',
        RainYear: '5.17'
    };

    const electricityList = document.getElementById('hut-weather-station-data');
    Object.entries(electricityData).forEach(([key, value]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${key}: ${value}`;
        electricityList.appendChild(listItem);
    });
}

updateWeatherStationData();
setupSidebar()


function setupSidebar(){
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    });

}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
}

function changePage(page, title){
    document.getElementById('top-title').textContent = title;
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.id !== page) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
    hideSidebar()
}

changePage('avalanche-forecast-container', 'Avalanche Forecast')
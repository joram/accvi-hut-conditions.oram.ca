import React from "react";
import "./Header.css";
import Sidebar from "./sidebar.tsx";


function Header() {
    const urlPath = window.location.pathname;
    const parts = urlPath.split("/");
    let pageTitle = "Home";
    if(parts[1] == "camera") pageTitle = "Camera History"
    if(parts[1] == "snow_depth") pageTitle = "Snow Depth"
    if(parts[1] == "batteries") pageTitle = "Battery Charge"
    if(parts[1] == "weather_forecast") pageTitle = "Weather Forecast"
    if(parts[1] == "weather_station") pageTitle = "Weather Station"
    return <div id="header">
        <Sidebar/>
        <h1>{pageTitle}</h1>
    </div>

}

export default Header;
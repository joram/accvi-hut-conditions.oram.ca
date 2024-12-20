import React from "react";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import CameraHistory from "./pages/CameraHistory.tsx";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SnowDepth from "./pages/SnowDepth.tsx";
import Header from "./components/Header.tsx";
import BatteryCharge from "./pages/BatteryCharge.tsx";
import WeatherForecast from "./pages/WeatherForecast.tsx";
import WeatherHistory from "./pages/WeatherHistory.tsx";

function Root() {
    return <><Header/></>
}

function App() {
    return <Router>
        <Routes>
            <Route path="/" element={<Root/>}/>
            <Route path="/camera" element={<CameraHistory />} />
            <Route path="/snow_depth" element={<SnowDepth />} />
            <Route path="/batteries" element={<BatteryCharge />} />
            <Route path="/weather_forecast" element={<WeatherForecast />} />
            <Route path="/weather_history" element={<WeatherHistory />} />
        </Routes>
    </Router>}

export default App;

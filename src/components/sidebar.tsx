import React, { useState } from "react";
import "./Sidebar.css";
import {Link} from "react-router-dom";

// Sidebar Component
const Sidebar: React.FC<{ }> = ({ }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="section-title">Forecast</div>
                <Link className="menu-item bottom" to="/weather_forecast">Weather</Link>

                <div className="section-title">Historical</div>
                <Link className="menu-item" to="/weather_history">Weather</Link>
                <Link className="menu-item" to="/camera">Camera</Link>
                <Link className="menu-item" to="/batteries">Battery</Link>

            </div>
            <div className={`overlay ${isOpen ? "visible" : ""}`} onClick={() => setIsOpen(false)}></div>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
        </>
    );
};

export default Sidebar;
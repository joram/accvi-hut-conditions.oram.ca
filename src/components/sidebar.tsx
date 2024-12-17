import React, { useState } from "react";
import "./Sidebar.css";
import {Link} from "react-router-dom";

// Sidebar Component
const Sidebar: React.FC<{ }> = ({ }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <Link className="menu-item" to="/">Home</Link>
                <Link className="menu-item" to="/camera">Camera</Link>
                <Link className="menu-item" to="/snow_depth">Snow Depth</Link>
                <Link className="menu-item" to="/batteries">Battery Charge</Link>
                <Link className="menu-item" to="/weather_forecast">Weather Forecast</Link>
            </div>
            <div className={`overlay ${isOpen ? "visible" : ""}`} onClick={() => setIsOpen(false)}></div>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
        </>
    );
};

export default Sidebar;
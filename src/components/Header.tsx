import React from "react";
import "./Header.css";
import Sidebar from "./sidebar.tsx";


function Header() {
    const urlPath = window.location.pathname;
    const parts = urlPath.split("/");
    let pageTitle = "Home";
    if(parts[1] == "camera") pageTitle = "Camera History"
    if(parts[1] == "snow_depth") pageTitle = "Snow Depth"
    return <div id="header">
        <Sidebar/>
        <h1>{pageTitle}</h1>
    </div>

}

export default Header;
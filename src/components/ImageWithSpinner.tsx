import React, { useState } from 'react';
import spinner from "../assets/spinner.svg";
import "./ImageWithSpinner.css";

const ImageWithSpinner = ({ src, alt}: {src:string, alt:string}) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    };

    return <div className="image-container">
        <div>
            <img src={spinner} alt="Snowy spinner"  className={`spinner ${loading ? "loading" : ""}`} width="150" height="150" />
        </div>
        <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            className={`image ${loading ? "loading" : ""}`}
        />
    </div>

};

export default ImageWithSpinner;

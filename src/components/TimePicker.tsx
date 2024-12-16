import React, { useState } from "react";
import "./TimePicker.css"; // Add custom styles

const TimePicker = ({ timestamps, onChange }: {timestamps: any, onChange: any}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value, 10);
        setSelectedIndex(value);
        onChange(value);
    };

    return (
        <div className="slider-container">
            {/* Slider */}
            <input
                type="range"
                className="slider"
                min="0"
                max={timestamps.length - 1}
                value={selectedIndex}
                onChange={handleSliderChange}
            />

            {/* Dots */}
            <div className="slider-dots">
                {timestamps.map((time: Date, index: number) => {
                    const dt = new Date(time);
                    let hour = dt.getHours()
                    let timeStr = hour+"am"
                    if(hour > 12){
                        hour = hour - 12
                        timeStr = hour+"pm"
                    }
                    return <div
                        key={index}
                        className={`dot ${index === selectedIndex ? "active" : ""}`}
                        style={{
                            left: `${(index / (timestamps.length - 1)) * 100}%`,
                        }}
                    >
                        <span className="dot-label">{timeStr}</span>
                    </div>
                })}
            </div>
        </div>
    );
};

export default TimePicker;

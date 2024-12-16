import React, { useEffect, useState } from "react";
import "../App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {fetchFiles} from "../utils/list_s3_files.ts";
import TimePicker from "../components/TimePicker.tsx";
import "./CameraHistory.css"

function CameraHistory() {
    const [imageFiles, setImageFiles] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFiles(date).then((files) => {
            let newImageFiles = []
            let newDepthImageFiles = []
            let newDepthsTxtFiles = []
            for (let file of files) {
                if (file.endsWith("snow_depth.jpg")) {
                    newDepthImageFiles.push(file)
                } else if (file.endsWith(".jpg")) {
                    newImageFiles.push(file)
                } else if (file.endsWith("_depth.txt")) {
                    newDepthsTxtFiles.push(file)
                }
            }
            setImageFiles(newImageFiles)
            if(newImageFiles.length > 0){
                setSelectedFile(newImageFiles[0])
            }
            setLoading(false);
        })
    }, [date]);

    let imageFileLinks = [];
    for (let file of imageFiles) {
        const filename = file.split("/").pop();
        let datetimeStr = filename?.split("_")[0].replace(".jpg", "");
        if (datetimeStr) {
            let parts = datetimeStr.split("T");
            datetimeStr = parts[0] + " " + parts[1].replace(/-/g, ":");

        }


        imageFileLinks.push(<li key={file}>
            <a href={"https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/" + file}>
                {datetimeStr}
            </a>
        </li>)
    }

    let timestamps = []
    for (let file of imageFiles) {
        const filename = file.split("/").pop();
        let datetimeStr = filename?.split("_")[0].replace(".jpg", "");
        if (datetimeStr) {
            let parts = datetimeStr.split("T");
            datetimeStr = parts[0] + " " + parts[1].replace(/-/g, ":");
        }
        timestamps.push(datetimeStr)
    }

    function onTimeChange(index: number) {
        setSelectedFile(imageFiles[index]);
    }

    if(loading){
        return <h1>Loading...</h1>
    }

    return (
        <>
            <h1>Camera History</h1>
            <div id="image-picker">
                <DatePicker
                    selected={date}
                    onChange={(date) => {
                        if (date === null) return;
                        setDate(date);
                    }}
                />
                <TimePicker timestamps={timestamps} onChange={onTimeChange}/>
            </div>
            <img src={"https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/" + selectedFile} alt="webcam image"/>
        </>
    );
}

export default CameraHistory;

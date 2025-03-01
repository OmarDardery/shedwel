import './App.css';
import React, { useState, useEffect } from 'react';
import Schedule from './components/schedule';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from './components/chat';
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINIAPI);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function App() {
    const [schedule, setSchedule] = useState({
        events: [],
        dayStart: "06:00:00",
        dayEnd: "23:00:00",
    });
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const savedSchedule = localStorage.getItem('schedule');
        if (savedSchedule) {
            console.log("Loaded schedule from localStorage:", savedSchedule);
            setSchedule(JSON.parse(savedSchedule));
        } else {
            console.log("No saved schedule found in localStorage.");
        }
    }, []);
    
    useEffect(() => {
        console.log("Saving schedule to localStorage:", schedule);
        localStorage.setItem('schedule', JSON.stringify(schedule));
    }, [schedule]);


    return (
        <div className='App'>
            <div style={{
                    width: "100vw",
                    height: "10vh",
                    top: "0",
                    margin: "0px",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#2f313aff"
                }}>

                <h1 style={{textAlign: "left", paddingLeft: "10px", color: "#F9F6F0"}}>Shedwel☕</h1>
                
            </div>
            <div className='container' style={{height: "70vh", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "2.5vh"}}>
                
                <Schedule routineData={schedule} />
                <Chat chat={chat} setChat={setChat} message={message} setMessage={setMessage} schedule={schedule} setSchedule={setSchedule} model={model} />
                
                
            </div>
            
        </div>
    );
}

export default App;
// new branch
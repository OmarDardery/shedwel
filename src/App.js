import './App.css';
import React, { useState, useEffect } from 'react';
import Schedule from './components/schedule';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINIAPI);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    async function getResponse() {
        try {
            const userMessage = message; // Store the message before clearing the input
            setChat(prevChat => [...prevChat, userMessage]);
            setMessage(''); // Clear the input field
    
            const currentScheduleString = JSON.stringify(schedule);
    
            const prompt = `
    "You are a highly skilled AI assistant designed to manage and modify user schedules with exceptional precision. Your primary goal is to accurately interpret user requests, expressed in natural language or structured formats, and update the provided schedule accordingly.
    
    **Understanding User Requests:**
    
    1.  **Intent Recognition:**
        * Identify the user's intent: 'add', 'remove', 'reschedule', or inquire about an event.
        * Be flexible in understanding various phrasing and sentence structures.
    2.  **Information Extraction:**
        * Extract event details: day, start time, end time, and title.
        * Handle diverse time formats (e.g., '10am', '10:00', '10', '2 PM').
        * If details are missing or ambiguous, infer from context or ask for clarification.
    3.  **Contextual Awareness:**
        * Use the provided 'Chat Context' to understand previous interactions and user preferences.
        * Leverage the 'Current Schedule' to make informed decisions.
    
    **Schedule Modification Rules (Strictly Enforced):**
    
    1.  **No Overlapping Events:** Ensure no events conflict within the same day.
    2.  **Working Hours:** Keep all events within the specified 'dayStart' and 'dayEnd' times.
    3.  **Error Handling:** If a request is invalid (e.g., overlapping events, out-of-bounds times, non-existent event to remove), return a clear and informative error message in the 'message' field of the JSON response.
    4. **Flexibility:** Understand and adapt to various user inputs, providing helpful responses or asking for clarification when needed.
    5. **Common sense:** If you cannot modify the schedule, return the schedule as you received it. Modify only the things that need modification.
    6. **Always Return JSON:** Ensure that your response is always a valid JSON object.
    7. **Smarts:** A user might ask for modifications that need processing like making a routine for finishing a course or a routine for going to the gym. adapt your reasoning to solve these problems.

    
    **Input Context:**
    * **Chat Context:**
        ${chat.map((text, index) =>
            index % 2 === 0 ? `user: ${text}` : `gemini (you): ${text}`
        ).join("\\n")}
    * **User's Current Message:**
        ${userMessage}
    * **Current Schedule (JSON):**
        ${currentScheduleString}
    
    **Output Format (Always Return Valid JSON):**
    
    \`\`\`json
    {
      "events": [
        { "day": "Mon", "startTime": "10:00", "endTime": "12:00", "title": "Project Meeting" }
      ],
      "dayStart": "06:00:00",
      "dayEnd": "23:00:00",
      "message": "A clear message explaining the action taken or any errors encountered."
    }
    \`\`\`
    
    **Examples of User Requests:**
    
    * "Add a meeting on Monday from 10am to 12pm called 'Project Meeting'."
    * "Reschedule my Tuesday 2pm class to 3pm."
    * "Remove the Wednesday 9am lecture."
    * "What events do I have on Friday?"
    * "I need to add a class on Thursday at 10 to 12."
    * "Move the class on Monday to 1 PM."
    * "I have a class called CSE 122, please move it to 2pm on monday."
    
    **Your Task:**
    
    Analyze the 'Chat Context' and the user's latest message. Update the 'events' array in the JSON response according to the user's request, while adhering to the 'Schedule Modification Rules'. Provide a descriptive message in the 'message' field. If the request is unclear or cannot be fulfilled, provide an appropriate error message. Always return a valid JSON object."
    `;
            console.log("prompt:", prompt);
    
            const result = await model.generateContent(prompt);
            console.log("gemini result:", result);
    
            // Access the response text correctly
            const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log("gemini response:", responseText);
    
            // Extract JSON from the response
            const jsonMatch = responseText && responseText.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1].trim() : "";
    
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(jsonString);
            } catch (parseError) {
                console.error("json Parsing Error:", parseError);
                setChat(prevChat => [...prevChat, "a problem occured on our end, sorry"]);
                return;
            }
    
            // Add AI's response to the chat
            setChat(prevChat => [...prevChat, parsedResponse.message || ""]);
    
            // Update the schedule if events are provided
            if (parsedResponse.events) {
                setSchedule(prevSchedule => ({
                    ...prevSchedule,
                    events: parsedResponse.events,
                    dayStart: parsedResponse.dayStart || prevSchedule.dayStart,
                    dayEnd: parsedResponse.dayEnd || prevSchedule.dayEnd,
                }));
            }
    
        } catch (error) {
            console.error("error generating content:", error);
            setChat(prevChat => [...prevChat, "something went wrong. Try again later!"]);
        }
    }

    return (
        <div className='App'>
            <div style={{
                    width: "100vw",
                    height: "10vh",
                    backgroundColor: "#f5f5f5",
                    top: "0",
                    margin: "0px",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5vh",
                    backgroundColor: "#2f313aff"
                }}>

                    <h1 style={{textAlign: "left", paddingLeft: "10px", color: "#F9F6F0"}}>  Shedwel☕</h1>
                </div>
            <div className='container' style={{height: "70vh"}}>
                
                <Schedule routineData={schedule} />
                <div className='chat' style={{ width: '40vw', margin: '0px', padding: "2vh", height: "80vh", paddingTop: "0vh", margin: "10px"}}>
                    <h1 style={{backgroundColor: "whitesmoke", padding: "5px", borderRadius: "5px", border: "1px solid gray"}}>Chat</h1>
                    <div className='chatbox' style={{flex: 1, overflowY: 'auto', height: "48vh", border: '1px solid #ccc', padding: "9px", display: "flex", flexDirection: "column", color: "#F9F6F0"}}>
                        {chat.map((text, index) => (
                        <div key={index} className={index % 2 === 0 ? "message": "message ai"} style={index % 2 === 0 ? {backgroundColor: "#04213cff", width: "80%", alignSelf: "flex-end", display: "flex", alignItems: "center", maxWidth: "fit-content", borderRadius: "10px", margin: "10px", paddingLeft: "10px", paddingRight: "10px"} : {width: "80%", display: "flex", alignItems: "center", maxWidth: "fit-content", borderRadius: "10px", margin: "10px", backgroundColor:"#6d7694", paddingLeft: "10px", paddingRight: "10px"}}>
                                
                                <p>{}{text}</p>
                            </div>
                        ))}
                    </div>
                    <input
                        type='text'
                        placeholder='Type a message...'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if(message !== ''){
                                    getResponse();
                                } else {
                                    alert("cannot enter an empty message!");
                                }
                            }
                        }}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '16px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            height: "fit-content",
                            minHeight: "5vh",
                            bottom: "11vh",
                            backgroundColor: "#F9F6F0",
                        }}
                    />
                </div>
                
                
            </div>
            
        </div>
    );
}

export default App;
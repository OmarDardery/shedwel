import React from "react";
import Button from "./button";
import getResponse from "./getResponse";
function Chat(props) {
  return (
    <div className='chat' style={{ width: '40vw', margin: '0px', padding: "2vh", height: "80vh", paddingTop: "0vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "10px", gap: "2.5vh"
    }}>
        <h1 style={{backgroundColor: "whitesmoke", padding: "5px", borderRadius: "5px", border: "1px solid gray", width: "90%", margin: "0px"}}>Chat</h1>
        <div className='chatbox' style={{flex: 1, overflowY: 'auto', height: "48vh", border: '1px solid #ccc', padding: "9px", display: "flex", flexDirection: "column", color: "#F9F6F0", width: "88%", backgroundColor: "#1E201E"}}>
            {props.chat.map((text, index) => (
            <div key={index} className={index % 2 === 0 ? "message": "message ai"} style={index % 2 === 0 ? {backgroundColor: "#04213cff", width: "80%", alignSelf: "flex-end", display: "flex", alignItems: "center", maxWidth: "fit-content", borderRadius: "10px", margin: "10px", paddingLeft: "10px", paddingRight: "10px"} : {width: "80%", display: "flex", alignItems: "center", maxWidth: "fit-content", borderRadius: "10px", margin: "10px", backgroundColor:"#6d7694", paddingLeft: "10px", paddingRight: "10px"}}>
                    
                    <p>{text}</p>
                </div>
            ))}
        </div>
        <div style={{display: "flex", flexDirection: "row", width: "90%", justifyContent: "space-between", height: "5vh", gap: "2vh"}}>
            <input
                type='text'
                placeholder='Type a message...'
                value={props.message}
                onChange={(e) => {
                    props.setMessage(e.target.value);
                }}
                style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: "#F9F6F0",
                    height: "100%"
                }}
                onKeyDown={
                    (e) => {
                        if(e.key === 'Enter') {
                            if (props.message !== '') {
                                getResponse(props.chat, props.setChat, props.message, props.setMessage, props.schedule, props.setSchedule, props.model);
                            } else {
                                alert("Please enter a message before sending");
                            }
                        }
                    }}
                

            />
            <Button onClick={() => {
                    if (props.message !== '') {
                        getResponse(props.chat, props.setChat, props.message, props.setMessage, props.schedule, props.setSchedule, props.model);
                    } else {
                        alert("Please enter a message");
                    }
                }} />
        </div>
        
    </div>
  );
}

export default Chat;
async function getResponse(chat, setChat, message, setMessage, schedule, setSchedule, model) {
    try {
        setChat(prevChat => [...prevChat, message]);
        setMessage('');

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
    ${message}
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

export default getResponse;
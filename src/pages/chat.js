import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [name, setName] = useState("");
  const [assistChoice, setAssistChoice] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/messages");
      setMessages(response.data);
      // Start conversation when component mounts
      startConversation();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const startConversation = () => {
    // Ask user's name when conversation starts
    addBotMessage("Hi, what's your name?");
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    // Set user's name and continue the conversation
    setName(inputText);
    setInputText("");
    addBotMessage(
      `Nice to meet you, ${inputText}! What assistance do you need?`
    );
  };

  const handleAssistChoiceSubmit = (e) => {
    e.preventDefault();
    // Set user's assistance choice and continue the conversation
    setAssistChoice(inputText);
    setInputText("");
    if (inputText.toLowerCase().includes("weather")) {
      addBotMessage(`Great! What city do you want the weather report for?`);
    } else {
      addBotMessage(
        "I'm sorry, I can only provide weather reports right now. What city do you want the weather report for?"
      );
    }
  };

  const handleCitySubmit = async (e) => {
    e.preventDefault();
    if (cityInput.trim() === "") return;
    try {
      // Get weather data for the specified city
      getWeatherData(cityInput);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getWeatherData = async (city) => {
    try {
      const apiKey = "bee5448cd187fac5c49a79504d319d2e"; // Replace 'YOUR_API_KEY' with your actual API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      // Display weather data and end conversation
      addBotMessage(
        `The weather in ${city} is ${response.data.weather[0].description} with a temperature of ${response.data.main.temp}°C.`
      );
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const addBotMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender: "bot" }]);
  };

  const addUserMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender: "user" }]);
  };

  return (
    <div>
      <h1>TourPal</h1>
      <div style={{ marginBottom: "20px" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "bot" ? "bot-message" : "user-message"
            }
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      {(name === "" || assistChoice === "") && (
        <form
          onSubmit={name === "" ? handleNameSubmit : handleAssistChoiceSubmit}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              name === ""
                ? "Enter your name..."
                : "Enter your assistance choice..."
            }
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {name !== "" && (
        <form onSubmit={handleCitySubmit}>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name..."
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {weatherData && (
        <div>
          <h2>Weather Report</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;

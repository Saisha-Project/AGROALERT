import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faSeedling } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [cropData, setCropData] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error("Weather data not found");
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCropData = () => {
    Papa.parse("/data/crop_data_cleaned.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const filtered = results.data.filter((row) =>
          row.District?.toLowerCase().includes(city.toLowerCase())
        );
        setCropData(filtered);
      },
    });
  };

  const handleSearch = () => {
    if (!city) return;
    setError("");
    fetchWeather();
    fetchCropData();
  };

  return (
    <div className="container">
      <h1 className="hero-title">🌾 AgroAlert Dashboard</h1>
      <p className="hero-subtitle">Get instant weather + crop insights by district</p>

      <div className="form">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">-- Select District --</option>
          <option value="Akola">Akola</option>
          <option value="Pune">Pune</option>
          <option value="Nashik">Nashik</option>
          <option value="Amravati">Amravati</option>
          <option value="Jalgaon">Jalgaon</option>
          <option value="Ahmednagar">Ahmednagar</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="card animate__animated animate__fadeInUp">
          <h2>
            <FontAwesomeIcon icon={faCloudSun} /> Weather in {weatherData.name}
          </h2>
          <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
          <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Pressure:</strong> {weatherData.main.pressure} hPa</p>
          <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
        </div>
      )}

      {cropData.length > 0 && (
        <div className="card animate__animated animate__fadeInUp">
          <h2>
            <FontAwesomeIcon icon={faSeedling} /> Crop Distribution in {city}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Arhar/Tur (ha)</th>
                <th>Bajra (ha)</th>
                <th>Wheat (ha)</th>
              </tr>
            </thead>
            <tbody>
              {cropData.map((row, index) => (
                <tr key={index}>
                  <td>{row.Year}</td>
                  <td>{row["Arhar/Tur Area"]}</td>
                  <td>{row["Bajra Area"]}</td>
                  <td>{row["Wheat Area"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>
        © 2025 AgroAlert • Made by Vedika Deshmukh & Saisha Rawte
      </footer>
    </div>
  );
};

export default App;

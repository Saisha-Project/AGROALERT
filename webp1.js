import { useState } from "react";

const AgroAlert = () => {
  const [city, setCity] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  
  const getWeather = async () => {
    const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Weather data not available!");
      
      const data = await response.json();
      setWeatherData({
        weather: data.weather[0].main,
        description: data.weather[0].description,
        temperature: `${data.main.temp}°C`,
        pressure: `${data.main.pressure} hPa`,
        windSpeed: `${data.wind.speed} m/s`,
        hazard: predictHazard(data.main.temp, data.main.humidity, data.wind.speed)
      });
    } catch (error) {
      alert("Error fetching weather data!");
      console.error(error);
    }
  };

  const predictHazard = (temp, humidity, windSpeed) => {
    let hazards = [];
    if (humidity > 85) hazards.push("Heavy Rainfall");
    if (windSpeed > 15) hazards.push("Storm");
    if (temp > 35) hazards.push("High Temperature");
    return hazards.length > 0 ? hazards.join(", ") : "No Hazards Detected";
  };

  return (
    <div className="container mt-5">
      <nav className="navbar navbar-dark bg-success">
        <div className="container">
          <a className="navbar-brand" href="#">AgroAlert</a>
        </div>
      </nav>

      <div className="card shadow p-4">
        <h2 className="text-center text-success">Maharashtra Weather Alert System</h2>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Select Your City:</label>
          <select id="city" className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
            {["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Thane", "Kolhapur", "Sangli"].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-success w-100" onClick={getWeather}>Get Weather</button>
      </div>

      {weatherData && (
        <div className="card shadow mt-4 p-4">
          <h4 className="text-center">Weather Details</h4>
          <p><strong>Weather:</strong> {weatherData.weather}</p>
          <p><strong>Description:</strong> {weatherData.description}</p>
          <p><strong>Temperature:</strong> {weatherData.temperature}</p>
          <p><strong>Pressure:</strong> {weatherData.pressure}</p>
          <p><strong>Wind Speed:</strong> {weatherData.windSpeed}</p>
          <p><strong>Predicted Hazards:</strong> <span className="text-danger">{weatherData.hazard}</span></p>
        </div>
      )}

      <footer className="text-center text-white bg-success mt-5 py-3">
        <p>&copy; 2025 AgroAlert. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AgroAlert;

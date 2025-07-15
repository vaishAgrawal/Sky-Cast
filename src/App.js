import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "903667973e46861aca07559e317cbb51"; // 🔑 Put your API key here

  const getLocationWeather = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          alert("📍 Location access denied. Please search manually.");
        }
      );
    } else {
      alert("📍 Geolocation not supported.");
    }
  }, []);

  useEffect(() => {
    getLocationWeather();
  }, [getLocationWeather]);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(current.data);
      setForecast(forecastRes.data.list.slice(0, 5));
    } catch (err) {
      alert("⚠️ Unable to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    try {
      setLoading(true);
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(current.data);
      setForecast(forecastRes.data.list.slice(0, 5));
    } catch (err) {
      alert("❌ City not found!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="weather-widget">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeatherByCity}>🔍 Search</button>
          <button onClick={getLocationWeather}>📍 My Location</button>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {weather && (
          <>
            <div className="current-weather">
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
              <div className="desc">
                <h2>{weather.name}</h2>
                <p>{weather.weather[0].description}</p>
              </div>
              <div className="icon">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt="weather icon"
                />
              </div>
            </div>

            <div className="forecast">
              {forecast.map((item, index) => (
                <div className="forecast-card" key={index}>
                  <p>{new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="icon"
                  />
                  <p>{Math.round(item.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

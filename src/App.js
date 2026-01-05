import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ Move to .env later for deployment
  const apiKey = "903667973e46861aca07559e317cbb51";

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
      setForecast(forecastRes.data.list.slice(0, 5)); // next ~15 hours
    } catch (error) {
      alert("⚠️ Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          alert("📍 Location access denied");
        }
      );
    } else {
      alert("📍 Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    getLocationWeather();
  }, [getLocationWeather]);

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
    } catch (error) {
      alert("❌ City not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="weather-card">
        <h1 className="title">🌤️ Sky-Cast</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeatherByCity}>Search</button>
          <button onClick={getLocationWeather}>My Location</button>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {weather && (
          <>
            <div className="current-weather">
              <div className="left">
                <div className="temp">
                  {Math.round(weather.main.temp)}°C
                </div>
                <h2>{weather.name}</h2>
                <p className="desc">
                  {weather.weather[0].description}
                </p>
              </div>

              <div className="right">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt="weather icon"
                />
              </div>
            </div>

            <div className="forecast">
              {forecast.map((item, index) => (
                <div className="forecast-card" key={index}>
                  <p className="time">
                    {new Date(item.dt_txt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt="icon"
                  />

                  <p className="temp-small">
                    {Math.round(item.main.temp)}°C
                  </p>
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

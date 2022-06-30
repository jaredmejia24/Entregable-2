import axios from "axios";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const WeatherCard = () => {
  const [weather, setWeather] = useState({});
  const [isCelsius, setIsCelsius] = useState(true);
  const [loading, setLoading] = useState(false);
  const weatherGifsObject = {
    clear: "https://media4.giphy.com/media/u01ioCe6G8URG/giphy.gif",
    cloud: "https://i.gifer.com/origin/dd/ddedd3a2f4a3995d8cd1a8ab2033c9ce.gif",
    rain: "https://c.tenor.com/UkXBmkGcpNEAAAAC/rain-raining.gif",
  };
  const success = (pos) => {
    const crd = pos.coords;
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&appid=0954170f2e2be8248c93abe2cf458a61`
      )
      .then((res) => {
        setWeather(res.data);
        setLoading(true);
      });
  };
  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  const toogleMeasurement = () => {
    if (isCelsius) {
      setIsCelsius(false);
      weather.main.temp = ((weather.main.temp * 9) / 5 + 32).toFixed(2);
    } else {
      setIsCelsius(true);
      weather.main.temp = (((weather.main.temp - 32) * 5) / 9).toFixed(2);
    }
  };
  let weatherGif = "";
  for (let i in weatherGifsObject) {
    if (weather.weather?.[0].main.toLowerCase().includes(i)) {
      weatherGif = i;
      break;
    }
  }
  return (
    <div
      style={weatherGif ? { backgroundImage: `url(${weatherGifsObject[weatherGif]})`}: {}}
      className="background"
    >
      <div className="card">
        <h1 className="color-blueviolet">Weather App</h1>
        {loading ? (
          <div>
            <h3 className="color-blueviolet">
              {weather.name}, {weather.sys?.country}
            </h3>
            <div className="weather-info">
              <div>
                <span
                  style={{ fontSize: "7rem", color: "blue" }}
                  className="material-symbols-outlined"
                >
                  cloud
                </span>
                <p>
                  <b>
                    {weather.main?.temp}
                    {isCelsius ? "°C" : "°F"}
                  </b>
                </p>
              </div>
              <div>
                <b className="color-blueviolet">
                  "{weather.weather?.[0].description}"
                </b>
                <p>
                  <span className="material-symbols-outlined color-blueviolet">
                    air{" "}
                  </span>{" "}
                  <b className="color-blueviolet">Wind speed: </b>
                  {weather.wind?.speed} m/s
                </p>
                <p>
                  <span className="material-symbols-outlined color-blueviolet">
                    cloud{" "}
                  </span>{" "}
                  <b className="color-blueviolet">Clouds: </b>
                  {weather.clouds?.all}%
                </p>
                <p>
                  <span className="material-symbols-outlined color-blueviolet">
                    thermometer{" "}
                  </span>{" "}
                  <b className="color-blueviolet">Pressure: </b>
                  {weather.main?.pressure} mb
                </p>
              </div>
            </div>
            <button onClick={toogleMeasurement}>Degrees °F/°C</button>
          </div>
        ) : (
          <ClipLoader />
        )}
      </div>
    </div>
  );
};

export default WeatherCard;

import axios from 'axios'
import React, { useState, useEffect } from 'react'


const App = () => {

  const [wthr, setWeather] = useState({})
  const [query, setQuery] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const key = '26d1a5fbbf6b7d0235ba9c2e65026e02'

  const getWeather = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`)
      setWeather(response.data)
    } catch (error) {
      console.log("Error");
    }
  }

  const getCurrentLocWeather = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
      setWeather(response.data)
    } catch (error) {
      if (error.response.status === 400) {
        console.log("Loading...");
      }
      else {
        console.log(error.message);
      }
    }
  }

  const handleKeyPress = (e)=>{
    if(e.key==='Enter'){
      document.getElementById("submit").click()
    }
  }


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude)
      setLongitude(pos.coords.longitude)
      if (longitude && latitude) {
        getCurrentLocWeather()
      }
    })
  }, [latitude, longitude, query])

  //TEMPERATURE
  if (typeof wthr.main !== 'undefined') { var temp = Math.round(wthr.main.temp - 273.15) }
  //WEATHER
  if (typeof wthr.weather !== 'undefined') { var weather = wthr.weather[0].main }


  const hot = <i className="fas fa-thermometer-full isti"></i>
  const cold = <i className="fas fa-thermometer-empty soyuq"></i>
  const clear = <i className="fas fa-sun"></i>
  const cloud = <i className="fas fa-cloud"></i>
  const rain = <i className="fas fa-cloud-showers-heavy"></i>
  const snow = <i className="far fa-snowflake"></i>
  const fog = <i className="fas fa-smog"></i>
  const thunder = <i className="fas fa-bolt"></i>
  const wind = <i className="fas fa-wind"></i>

  return (
    <div className='container'>
      <div className="common">
        <input id='input' type="text" placeholder='country/city/settlement/village' value={query} onChange={e => setQuery(e.target.value)} onKeyPress={handleKeyPress}/>
        <br />
        <button id='submit' onClick={() => { getWeather() }}>Search</button>
        <div className="name"><p>
          {wthr.name} , {typeof wthr.sys !== 'undefined' ? wthr.sys.country : "city"}
        </p></div>
        <div className="about-city">
          <div className="temp">
            <span>{temp > 15 ? hot : cold}</span> <p> {temp}??C </p>
          </div>
          <div className="weather">
            <span>{weather === "Clear" ? clear
              : weather === "Clouds" ? cloud
                : weather === "Snow" ? snow
                  : weather === "Rain" || weather === "Drizzle" ? rain
                    : weather === "Mist" || weather === "Smoke" || weather === "Haze" || weather === "Dust" || weather === "Fog" || weather === "Sand" || weather === "Dust" || weather === "Ash" || weather === "Squall" || weather === "Tornado" ? fog
                      : weather === "Thunderstorm" ? thunder : " "}</span>
            <p>{weather}</p>
          </div>
          <div className="wind">
            <span>{wind}</span>
            <p>{typeof wthr.wind !== 'undefined' ? `${wthr.wind.speed}m/s` : "wind"}  </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

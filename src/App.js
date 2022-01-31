import axios from 'axios'
import React, { useState, useEffect } from 'react'


const App = () => {

  const [wthr, setWeather] = useState({})
  const [query, setQuery] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const key = '26d1a5fbbf6b7d0235ba9c2e65026e02'

  const getWeather = async () => {
    if (query.length == 0) {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
      setWeather(response.data)
    }
    else if (query.length > 0) {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`)
      setWeather(response.data)
    }
  }
  console.log(wthr);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude)
      setLongitude(pos.coords.longitude)
    })
    getWeather()
  }, [latitude, longitude, query])
  console.log(latitude);

  //TEMPERATURE
  if (typeof wthr.main !== 'undefined') { var temp = Math.round(wthr.main.temp - 273.15) }
  //WEATHER
  if (typeof wthr.weather !== 'undefined') { var weather = wthr.weather[0].main }


  const hot = <i class="fas fa-thermometer-full isti"></i>
  const cold = <i class="fas fa-thermometer-empty soyuq"></i>
  const clear = <i class="fas fa-sun"></i>
  const cloud = <i class="fas fa-cloud"></i>
  const rain = <i class="fas fa-cloud-showers-heavy"></i>
  const snow = <i class="far fa-snowflake"></i>
  const fog = <i class="fas fa-smog"></i>
  const thunder = <i class="fas fa-bolt"></i>
  const wind = <i class="fas fa-wind"></i>

  return (
    <div className='container'>
      <div className="common">
        <input type="text" placeholder='country/city/settlement/village' value={query} onChange={e => setQuery(e.target.value)} />
        <div className="name"><p>
          {wthr.name} , {typeof wthr.sys !== 'undefined' ? wthr.sys.country : "city"}
        </p></div>
        <div className="about-city">
          <div className="temp">
            <span>{temp > 15 ? hot : cold}</span> <p> {temp}˚C </p>
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

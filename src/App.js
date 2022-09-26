import axios from 'axios'
import React, {useState, useEffect} from 'react'
import * as Icon from 'react-bootstrap-icons';
import NotFound from "./components/NotFound";


const App = () => {

    const [wthr, setWeather] = useState({
        name: "City",
        main: {
            temp: 'temp',
            humidity: '0'
        },
        sys: {
            country: "Country",
            sunrise: 0,
            sunset: 0
        },
        wind: {
            speed: "speed"
        },
        weather: [{
            main: "Clear"
        }]
    })
    const [query, setQuery] = useState('')
    const [location, setLocation] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const key = '26d1a5fbbf6b7d0235ba9c2e65026e02'

    const [error, setError] = useState(false)

    const getWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}`)
            setWeather(response.data)
        } catch (error) {
            if (error) {
                console.log(error.message)
                setError(true)
                setLocation(query)
            }
        }
    }

    const getCurrentLocWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`)
            setWeather(response.data)
        } catch (error) {
            if (error.response.status === 400) {
                console.log("Loading...");
            } else {
                console.log(error.message);
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
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
    const temp = Math.round(wthr.main.temp - 273.15)

    //WEATHER
    const weather = wthr.weather[0].main

    //TIMEZONE
    const timezone = wthr.timezone / 3600

    const [hours, setHours] = useState("00")
    const [minutes, setMinutes] = useState("00")
    const [month, setMonth] = useState()
    const [weekday, setWeekDay] = useState()
    const [date, setDate] = useState("Monday")

    // const [time, setTime] = useState()

    function calcTime(offset) {
        var b = new Date()
        var utc = b.getTime() + (b.getTimezoneOffset() * 60000);
        var nd = new Date(utc + (3600000 * offset));
        setHours(nd.getHours())
        setMinutes(nd.getMinutes())
        setMonth(nd.getMonth())
        setWeekDay(nd.getDay())
        setDate(nd.getDate())
        // setTime(nd)
    }

    const Months = ["January", "February", "March", "April", "June", "July", "August", "September", "October", "November", "December"]
    const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const [sriseTime, setsriseTime] = useState()
    const [sriseHours, setsriseHours] = useState("00")
    const [sriseMinutes, setsriseMinutes] = useState("00")
    const [ssetHours, setssetHours] = useState("00")
    const [ssetMinutes, setssetMinutes] = useState("00")

    const getSunriseSunset = () => {
        var b = new Date(0)
        var utc = b.getTime() + (b.getTimezoneOffset() * 60000);
        var ndSrise = new Date(utc + (3600000 * timezone))
        var ndSset = new Date(utc + (3600000 * timezone))

        //SUNRISE
        var sriseUtcSeconds = wthr.sys.sunrise;
        ndSrise.setUTCSeconds(sriseUtcSeconds);
        setsriseHours(ndSrise.getHours())
        setsriseMinutes(ndSrise.getMinutes())
        setsriseTime(ndSrise.getTime())
        console.log(ndSrise.getMinutes())

        //SUNSET
        var ssetUtcSeconds = wthr.sys.sunset;
        ndSset.setUTCSeconds(ssetUtcSeconds);
        setssetHours(ndSset.getHours())
        setssetMinutes(ndSset.getMinutes())


    }

    const [day, setDay] = useState(false)
    const setBackgroundColor = () => {
        if (hours > sriseHours && hours < ssetHours) {
            setDay(true)
        } else {
            setDay(false)
        }
    }

    useEffect(() => {
        calcTime(timezone)
        getSunriseSunset()
    }, [wthr])

    useEffect(() => {
        setBackgroundColor()
    }, [hours, minutes, sriseHours])


    // useEffect(()=>{
    //
    // },[wthr])


    const cold = <Icon.ThermometerLow color="#5eb3dd"/>
    const warm = <Icon.ThermometerHalf/>
    const hot = <Icon.ThermometerHigh color="#ff2020"/>
    const clear_day = <Icon.Sun color="rgb(230, 198, 18)"/>
    const clear_night = <Icon.Moon/>
    const cloud = <Icon.Cloud/>
    const rain = <Icon.CloudRain/>
    const snow = <Icon.Snow/>
    const fog = <Icon.CloudFog2/>
    const thunder = <Icon.CloudLightning/>
    const wind = <Icon.Wind/>
    const humidity = <Icon.Moisture/>

    // const style = {
    //     color:"red",
    //     ':hover':{
    //         color: "gray"
    //     }
    //     // "::before":{
    //     //     color:"red"
    //     // }
    // }

    return (
        <div className={`main-container ${day ? "main-day" : "main-night"}`}>
            <div className='container'>
                <div className="search">
                    <input id='input' type="text" placeholder='country/city/settlement/village' value={query}
                           onChange={e => setQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                    <button id='submit' onClick={() => {
                        getWeather()
                    }}>Search
                    </button>
                </div>
                <div className="common">

                    <div className="name">
                        <p>
                            {wthr.name} , {wthr.sys.country}
                        </p> <br/>
                        <p>
                            {!isNaN(month) && Months[month - 1]} {!isNaN(date) && date+","} {!isNaN(weekday) && Days[weekday - 1]}
                            <br/> {isNaN(hours) === true ? "00" : (hours < 10 ? "0" + hours : hours)} : {isNaN(minutes) === true ? "00" : (minutes < 10 ? "0" + minutes : minutes)}
                        </p> <br/>
                        <div className="sunrise-sunset">
                            <p className="day-night">
                                <Icon.Sunrise/> {isNaN(sriseHours) === true ? "00" : (sriseHours < 10 ? "0" + sriseHours : sriseHours)} : {isNaN(sriseMinutes) === true ? "00" : (sriseMinutes < 10 ? "0" + sriseMinutes : sriseMinutes)}
                            </p>
                            <p className="day-night">
                                <Icon.Sunset/> {isNaN(ssetHours) === true ? "00" : (ssetHours < 10 ? "0" + ssetHours : ssetHours)} : {isNaN(ssetMinutes) === true ? "00" : (ssetMinutes < 10 ? "0" + ssetMinutes : ssetMinutes)}
                            </p>
                        </div>
                    </div>
                    <div className="about-city">
                        <div className="temp">
                            <span>{temp > 15 ? hot : cold}</span> <p> {wthr.main.temp === "temp" ? "0" : temp}˚C </p>
                        </div>
                        <div className="weather">
            <span>{weather === "Clear" ? (day ? clear_day : clear_night)
                : weather === "Clouds" ? cloud
                    : weather === "Snow" ? snow
                        : weather === "Rain" || weather === "Drizzle" ? rain
                            : weather === "Mist" || weather === "Smoke" || weather === "Haze" || weather === "Dust" || weather === "Fog" || weather === "Sand" || weather === "Dust" || weather === "Ash" || weather === "Squall" || weather === "Tornado" ? fog
                                : weather === "Thunderstorm" ? thunder : " "}</span>
                            <p>{weather}</p>
                        </div>
                        <div className="wind">
                            <span>{wind}</span>
                            <p>{wthr.wind.speed === "speed" ? "0" : wthr.wind.speed} m/s</p>
                        </div>
                        <div className="wind humidity">
                            <span>{humidity}</span>
                            <p>{wthr.main.humidity === "0" ? "0" : wthr.main.humidity} %</p>
                        </div>
                    </div>
                </div>
            </div>
            <NotFound location={location} error={error} setError={setError}/>
        </div>
    )
}

export default App
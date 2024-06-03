"use strict";
const API = "6535b26a4863306c06d5060fd07d263a";
const daycon = document.querySelector(".day");
const datecon = document.querySelector(".date");
const btn = document.querySelector(".btn");
const inp = document.querySelector(".input_field");
const icons = document.querySelector(".icons");
const dayinfo = document.querySelector(".day_info");
const listcon = document.querySelector(".list_content ul");
const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday",
];
const day = new Date();
const dayName = days[day.getDay()];
daycon.textContent = dayName;
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
datecon.textContent = date + " " + month + " " + year;
window.addEventListener('load', () => {
  getCurrentLocation();
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (inp.value.trim() !== "") {
        const search = inp.value.trim();
        inp.value = "";
        findLocation(search);
    } else {
        console.log("Please Enter City or Country Name");
    }
});

async function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        findLocationByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

async function findLocationByCoords(lat, lon) {
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`;
    const data = await fetch(API_URL);
    const res = await data.json();
    console.log('API Response:', res);
    if (res.cod !== '404') {
      listcon.innerHTML = '';
      await displayForecast(res.coord.lat, res.coord.lon);
      setTimeout(() => {
        icons.innerHTML = displayImageContent(res);
        icons.classList.add('fadeIn');
        document.querySelector('.day_info .value').textContent = res.name;
        document.querySelector('.day_info .value1').textContent = `${Math.round(res.main.temp)}°C`;
        document.querySelector('.day_info .value2').textContent = `${res.main.humidity}%`;
        document.querySelector('.day_info .value3').textContent = `${res.wind.speed} Km/h`;
      }, 1500);
    } else {
      listcon.innerHTML = '';
      const msg = `<h2 class="weather_temp">${res.cod}</h2>
                   <h3 class="cloudtxt">${res.message}</h3>`;
      icons.innerHTML = msg;
      icons.classList.add('fadeIn');
      document.querySelector('.day_info .value').textContent = '';
      document.querySelector('.day_info .value1').textContent = '';
      document.querySelector('.day_info .value2').textContent = '';
      document.querySelector('.day_info .value3').textContent = '';
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

async function findLocation(name) {
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}&units=metric`;
    const data = await fetch(API_URL);
    const res = await data.json();
    console.log('API Response:', res);
    if (res.cod !== '404') {
      listcon.innerHTML = '';
      findLocationByCoords(res.coord.lat, res.coord.lon);
    } else {
      listcon.innerHTML = '';
      const msg = `<h2 class="weather_temp">${res.cod}</h2>
                   <h3 class="cloudtxt">${res.message}</h3>`;
      icons.innerHTML = msg;
      icons.classList.add('fadeIn');
      document.querySelector('.day_info .value').textContent = '';
      document.querySelector('.day_info .value1').textContent = '';
      document.querySelector('.day_info .value2').textContent = '';
      document.querySelector('.day_info .value3').textContent = '';
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

function displayImageContent(data) {
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"/>
            <h2 class="weather_temp">${Math.round(data.main.temp)}°C</h2>
            <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightSideContent(result) {
    return `<div class="content">
                <p class="title">Name</p>
                <span class="value">${result.name}</span>
            </div>
            <div class="content">
                <p class="title">Temp</p>
                <span class="value">${Math.round(result.main.temp)}°C</span>
            </div>
            <div class="content">
                <p class="title">Humidity</p>
                <span class="value">${result.main.humidity}%</span>
            </div>
            <div class="content">
                <p class="title">Wind Speed</p>
                <span class="value">${result.wind.speed} Km/h</span>
            </div>`;
}

async function displayForecast(lat, lon) {
    try {
        const forecast_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=metric`;
        const data = await fetch(forecast_api);
        const result = await data.json();
        const uniquefd = [];
        const dfc = result.list.filter((forecast) => {
            const fdate = new Date(forecast.dt_txt).getDate();
            if (!uniquefd.includes(fdate)) {
                return uniquefd.push(fdate);
            }
        });
        console.log("Forecast Data:", dfc);

        dfc.forEach((content, indx) => {
            if (indx>0 && indx <= 4) {
                listcon.insertAdjacentHTML("beforeend", forecast(content)); 
            }
        });
        return dfc[0];
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function forecast(frcontent) {
    const day = new Date(frcontent.dt_txt);
    const dayname = days[day.getDay()].substring(0, 3);
    const currentDay = new Date();
    const currentDayName = days[currentDay.getDay()];
    if (dayname === currentDayName) {
        return `<li>
                    <img src="https://openweathermap.org/img/wn/${frcontent.weather[0].icon}@2x.png"/>
                    <span>${dayname}</span>
                    <span class="day_temp">${Math.round(frcontent.main.temp)}°C</span>
                </li>`;
    } else {
        return `<li>
                    <img src="https://openweathermap.org/img/wn/${frcontent.weather[0].icon}@2x.png"/>
                    <span>${dayname}</span>
                    <span class="day_temp">${Math.round(frcontent.main.temp)}°C</span>
                </li>`;
    }
}
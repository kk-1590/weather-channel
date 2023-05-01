const API_KEY = "b731e3d2a64270dbfb68f092667978ff";

const getCurrentWeatherData = async () => {
    const city = "pune";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return response.json();
}

const getHourlyForecast = async ({name : city}) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
    const data = await response.json();
    return data.list.map(forecast => {
        const {main:{temp,temp_max,temp_min},dt,dt_txt,weather:[{description,icon}]} = forecast;
        return [temp, temp_max, temp_min, dt, dt_txt, description, icon];
    })
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;

const createURL = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

const loadCurrentForecast = ({name, main:{temp,temp_max,temp_min} ,weather:[{description}]}) => {
    const currentForecastElement = document.querySelector('#current-forecast');
    currentForecastElement.querySelector('.city').textContent = name;
    currentForecastElement.querySelector('.temp').textContent = formatTemperature(temp);
    currentForecastElement.querySelector('.description').textContent = description;
    currentForecastElement.querySelector('.min-max-temp').textContent = `H: ${temp_max} L:${temp_min}`;
}

const loadHourlyForecast = (hourlyForecast) => {
    let dataFor12Hours = hourlyForecast.slice(1,13);
    const hourlyContainer = document.querySelector('.hourly-container');
    let innerHTMLString = "";

    for(let data of dataFor12Hours){
        innerHTMLString += `
        <article>
            <h3 class="time">${data[4].split(" ")[1]}</h3>
            <img class="icon" src="${createURL(data[6])}"/>
            <p class="hourly-temp">${formatTemperature(data[0]/10)}</p>
        </article>
        `
        hourlyContainer.innerHTML = innerHTMLString;
    }
}

const loadFeelsLike = ({main: { feels_like }}) => {
    let container = document.querySelector("#feels-like");
    container.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
}


const loadHumidity = ({main: { humidity }}) => {
    let container = document.querySelector("#humidity");
    container.querySelector(".humidity-value").textContent = `${humidity} %`;
}


document.addEventListener('DOMContentLoaded',async () => {
    const currentWeather = await getCurrentWeatherData();
    loadCurrentForecast(currentWeather);
    // console.log(currentWeather);
    const hourlyForecast = await getHourlyForecast(currentWeather);
    console.log(hourlyForecast);
    loadHourlyForecast(hourlyForecast);
    loadFeelsLike(currentWeather);
    loadHumidity(currentWeather);
})
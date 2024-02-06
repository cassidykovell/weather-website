//naming all of my global variables 
var searchBtn = document.getElementById("getWeather");
var cityInput = document.getElementById("searchInput");
var todayTemp = document.getElementById('today-temp');
var todayWind = document.getElementById('today-wind');
var todayHum = document.getElementById('today-hum');
var city = document.getElementById('city');
var forecastCity = document.getElementById('five-day-city');
var previousCities = [];

var APIKey = "bfc41f2a23f49b411a509bc0b6a9d463";

//this function fetches the data from the weather API and returns it to my webpage 
function fetchWeatherData(cityToSearch) {
  var cityName = cityToSearch
  var cordinateAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}`;

  fetch(cordinateAPIUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

      fetch(weatherApiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data)
          weatherInfo(data);
          fiveDayForcast(data);
        });
    });
}

//in this function I am selecting what part of the data I want and displaying it within the website for the current day as well as displaying the current date 
function weatherInfo(weatherForecastData) {
    var todaysTemperature = weatherForecastData.list[0].main.temp;
    var todaysWind = weatherForecastData.list[0].wind.speed;
    var todaysHumidity = weatherForecastData.list[0].main.humidity;
    var icon = weatherForecastData.list[0].weather[0].icon;
    var today = new Date();
    var date = today.toLocaleDateString();
  
    city.innerHTML = weatherForecastData.city.name + `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon"> (${date})`;
    todayTemp.innerHTML = `Temperature: ${todaysTemperature}°C`;
    todayWind.innerHTML = `Wind: ${todaysWind} M/S`;
    todayHum.innerHTML = `Humidity: ${todaysHumidity} %`;
  }

//in this function I am getting the data needed for the following five days and runnning it through a for loop so that each day for five days is layed out and adding dates to each of those days
  function fiveDayForcast(weatherForecastData) {
    var fiveDay = document.getElementById('five-day');
    fiveDay.innerHTML = '';
  
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); 
  
    for (var i = 0; i < 5; i++) {
      var date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
      var formattedDate = date.toLocaleDateString();
  
      var singleDayForecast = `
        <div class="col mb-3">
          <div class="background card border-0">
            <div class="p-3 text-black">
              <p class="fw-semibold">(${formattedDate})</p>
              <img class="weather-icon" src="https://openweathermap.org/img/wn/${weatherForecastData.list[i].weather[0].icon}@4x.png" alt="weather icon">
              <p class="my-3 mt-3">Temp: ${weatherForecastData.list[i].main.temp}°C</p>
              <p class="my-3">Wind: ${weatherForecastData.list[i].wind.speed} M/S</p>
              <p class="my-3">Humidity: ${weatherForecastData.list[i].main.humidity}%</p>
            </div>
          </div>
        </div>`;
  
      fiveDay.innerHTML += singleDayForecast;
    }
  }

//in this function I am displaying previous cities that the user has searched and adding an event listener so that if one of the previous city list items is clicked the data for that city will re-display 
  function displayPreviousCities() {
    var previousCitiesList = document.getElementById('previousCities');
    previousCitiesList.innerHTML = '';
    previousCitiesList.style.padding = '0';
  
    var storedCities = localStorage.getItem('previousCities');
    if (storedCities) {
      var parseCities = JSON.parse(storedCities);
      parseCities.forEach(function (city) {
        var list = document.createElement('li');
        list.textContent = city;
        list.classList.add('list-item', 'col-12', 'col-md-4', 'col-lg-4');
        previousCitiesList.appendChild(list);
      });
  
      previousCitiesList.addEventListener('click', function(event) {
        var clickedCity = event.target.textContent;
        fetchWeatherData(clickedCity);
      });
    }
  }

//this is the event listener for the original city input so that the user can put in a city and get the weather information about it 
searchBtn.addEventListener("click", function () {
  var city = cityInput.value; 
  fetchWeatherData(city);
   if (!previousCities.includes(city)) {
    previousCities.push(city)
    localStorage.setItem('previousCities', JSON.stringify(previousCities));
   }
  displayPreviousCities();
});

//calling this function so that previous cities in local storage are shown when laoding the page
displayPreviousCities()
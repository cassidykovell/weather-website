var searchBtn = document.getElementById("getWeather");
var cityInput = document.getElementById("searchInput");
var todayTemp = document.getElementById('today-temp');
var todayWind = document.getElementById('today-wind');
var todayHum = document.getElementById('today-hum');
var city = document.getElementById('city');
var forecastCity = document.getElementById('five-day-city');
var previousCities = [];

var APIKey = "bfc41f2a23f49b411a509bc0b6a9d463";

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

  function displayPreviousCities() {
    var previousCitiesList = document.getElementById('previousCities');
    previousCitiesList.innerHTML = '';
    // previousCitiesList.style.margin = '0';
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

searchBtn.addEventListener("click", function () {
  var city = cityInput.value; 
  fetchWeatherData(city);
   if (!previousCities.includes(city)) {
    previousCities.push(city)
    localStorage.setItem('previousCities', JSON.stringify(previousCities));
   }
  displayPreviousCities();
});

displayPreviousCities()
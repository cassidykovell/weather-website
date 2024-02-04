var searchBtn = document.getElementById("getWeather");
var cityInput = document.getElementById("searchInput");
var todayTemp = document.getElementById('today-temp');
var todayWind = document.getElementById('today-wind');
var todayHum = document.getElementById('today-hum');
var city = document.getElementById('city');
var forecastCity = document.getElementById('five-day-city');
var previousCities = [];

var APIKey = "bfc41f2a23f49b411a509bc0b6a9d463";

function fetchWeatherData() {
  var cityName = cityInput.value;
  var cordinateAPIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}`;

  fetch(cordinateAPIUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

      fetch(weatherApiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          weatherInfo(data);
          fiveDayForcast(data);
        });
    });
}

function weatherInfo(weatherForecastData) {
  var todaysTemperature = weatherForecastData.list[0].main.temp;
  var todaysWind = weatherForecastData.list[0].wind.speed;
  var todaysHumidity = weatherForecastData.list[0].main.humidity;

  city.innerHTML = cityInput.value;
  todayTemp.innerHTML = `Temperature: ${todaysTemperature}°C`;
  todayWind.innerHTML = `Wind: ${todaysWind} M/S`;
  todayHum.innerHTML = `Humidity: ${todaysHumidity} %`;
}

function fiveDayForcast(weatherForecastData) {
  var fiveDay = document.getElementById('five-day');
  fiveDay.innerHTML = '';

  for (var i = 0; i < weatherForecastData.list.length; i += 8) {
    var singleDayForecast = `
      <div class="col mb-3">
        <div class="background card border-0">
          <div class="p-3 text-black">
            <p class="fw-semibold">( ______ )</p>
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
  previousCitiesList.style.margin = '0';
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
  }
}

searchBtn.addEventListener("click", function () {
  fetchWeatherData();
  var city = cityInput.value;
  previousCities.push(city);
  localStorage.setItem('previousCities', JSON.stringify(previousCities));
  displayPreviousCities();
});
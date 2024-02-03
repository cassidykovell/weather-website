var searchBtn = document.getElementById("getWeather");
var cityInput = document.getElementById("searchInput");
var today = document.getElementById("today-info");
var fiveDay = document.getElementById("five-day");
var todayTemp = document.getElementById('today-temp');
var todayWind =document.getElementById('today-wind');
var todayHum =document.getElementById('today-hum');

var APIKey = "bfc41f2a23f49b411a509bc0b6a9d463";

var city = "";

searchBtn.addEventListener("click", function () {
  fetchWeatherData();
});

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

function weatherInfo(weatherForcastData) {
    weatherForcastData.list[0];
    var todaysTempurature = weatherForcastData.list[0].main.temp;
    var todaysWind = weatherForcastData.list[0].wind.speed;
    var todaysHumidity = weatherForcastData.list[0].main.humidity;
    todayTemp.innerHTML = `Tempurature: ${todaysTempurature}°C`
    todayWind.innerHTML = `Wind: ${todaysWind} M/S`
    todayHum.innerHTML = `Humidity: ${todaysHumidity} %`
}

function fiveDayForcast(weatherForcastData) {
    fiveDay.innerHTML=''
    for (i = 0; i < weatherForcastData.list.length; i+=8 ) {
        console.log(weatherForcastData.list[i])
        var singleDayForcast = ` <div class="col mb-3">
        <div class="background card border-0">
            <div class="p-3 text-black">
                <p class="fw-semibold">( ______ )</p>
                <p class="my-3 mt-3">Temp:${weatherForcastData.list[i].main.temp}°C</p>
                <p class="my-3">Wind: ${weatherForcastData.list[i].wind.speed} M/S</p>
                <p class="my-3">Humidity: ${weatherForcastData.list[i].main.humidity}%</p>
            </div>
        </div>
    </div>`
    fiveDay.innerHTML+=singleDayForcast
    }
}
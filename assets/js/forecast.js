var geoURL = 'http://api.openweathermap.org/geo/1.0/direct';
var weatherURL = 'https://api.openweathermap.org/data/3.0/onecall?'
var city = window.location.search;
var APIkey = 'appid=5a2b8d33311dc86fb5608e194db81f27';
var lon;
var lat;
var state;
var country;
const iconURLprefix = 'http://openweathermap.org/img/wn/';

var placeEL = $('#place');
var weatherCards = $('.weather-card');
console.log(weatherCards);
console.log(placeEL);


if(!city){
  document.location.replace('./index.html');
} else {
  fetch(geoURL + city + "&limit=5&" + APIkey)  // Search by city to get coordinates.
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      lon = data[0].lon;
      lat = data[0].lat;
      city = data[0].name;
      state = data[0].state;
      country = data[0].country;
      placeEL[0].textContent = city + ", " + state + " " + country;

      fetch(weatherURL + 'lat=' + lat + '&lon=' + lon + "&units=imperial&" + APIkey)  // takes longitude and latitude data from the city search to call the weather API
        .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        for(var i=0; i<weatherCards.length; i++){
          weatherCards[i].children[1].children[0].attributes[0].nodeValue = iconURLprefix + data.daily[i].weather[0].icon + '@2x.png';
          weatherCards[i].children[1].children[1].children[0].textContent = data.daily[i].temp.max;
          weatherCards[i].children[1].children[1].children[2].textContent = data.daily[i].temp.min;
          weatherCards[i].children[1].children[1].children[4].textContent = data.daily[i].weather[0].description;
          weatherCards[i].children[0].textContent = dayjs.unix(data.daily[i].sunrise).format('MMM D, YYYY');
        }
        
    });
  })
}

var cityFormEl = document.querySelector('#city-search');
var cityInputEl = document.querySelector('#city');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getForecast(city);
  } else {
    // do something
  }
};


var getForecast = function (place) {
    document.location.replace('./forecast.html?q=' + place);
};
cityFormEl.addEventListener('submit', formSubmitHandler);
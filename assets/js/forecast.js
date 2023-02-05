// var geoURL = 'http://api.openweathermap.org/geo/1.0/direct';
var weatherURL = 'https://api.openweathermap.org/data/3.0/onecall?'
// var city = window.location.search;
var APIkey = 'appid=5a2b8d33311dc86fb5608e194db81f27';
var lon;
var lat;
var searchLocation;
var eventResult;
const iconURLprefix = 'http://openweathermap.org/img/wn/';


// Grab necessary elements
var userLocation = $('#search-location');
var mapModal = $('#mapModal');
var clothingContainer = $('#clothing-container');


// Options for getting user location
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

// Modal display with map API within it, uses bootstrap but can substitute for tailwind
function displayModal() {
    mapModal.modal('show');
}

// Display the map within the modal
function generateMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmxhc2N1bmEiLCJhIjoiY2xkanU2MXl1MHVuaDN3bm9oOGZqMzVsMSJ9.slPE4Rn2asrbxWKcDgBejA';
    //navigator.geolocation.getCurrentPosition(success, error, options);
    const map = new mapboxgl.Map({
    container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [0,0],
        zoom: 13
    });
 
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    });

    // Add the control to the map.
    map.addControl(geocoder,'top-left');

    map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
        })
    );

    map.on("load", () => { // Controls the search bar for the map
        geocoder.on('result', (event) => {
            console.log(event.result);
            eventResult = event.result;
            searchLocation = event.result.place_name;
            userLocation.val(searchLocation);
        })
    });

    map.on("render", () => {
        map.resize();
    });
};

// Grabs the searched location and spits out longitude/latitude
function parseLocation(result) {
    lon = result.center[0];
    lat = result.center[1];
    placeEL.text("Weather for " + searchLocation);
    getWeather(lon, lat);
}


var placeEL = $('#place');
console.log(placeEL);
var weatherCards = $('.weather-card');
console.log(weatherCards);
var weatherContainer = $('#weather-container');


function getWeather(lon, lat){  
      fetch(weatherURL + 'lat=' + lat + '&lon=' + lon + "&units=imperial&" + APIkey)  // takes longitude and latitude data from the city search to call the weather API
        .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
         for(var i=0; i<weatherCards.length; i++){
          // weatherCards[i].children[1].children[0].attributes[0].nodeValue = iconURLprefix + data.daily[i].weather[0].icon + '@2x.png';
          weatherCards[i].children[0].children[4].children[0].textContent = data.daily[i].temp.max;
          weatherCards[i].children[0].children[4].children[2].textContent = data.daily[i].temp.min;
          weatherCards[i].children[0].children[4].children[4].textContent = data.daily[i].weather[0].description;
          weatherCards[i].children[0].children[1].textContent = dayjs.unix(data.daily[i].sunrise).format('MMM D, YYYY');
         }
    });
}

var cityFormEl = document.querySelector('#city-search');
var cityInputEl = document.querySelector('#search-location');

var formSubmitHandler = function (event) {
  event.preventDefault();

  if(searchLocation){
    parseLocation(eventResult);
  }

};

// The following functions are for automatically grabbing the user's location
function success(pos) {
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  currentLat = crd.latitude;
  console.log(currentLat);
  console.log(`Longitude: ${crd.longitude}`);
  currentLon = crd.longitude;
  console.log(currentLon);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}


var getForecast = function (place) {
    document.location.replace('./forecast.html?q=' + place);
};
cityFormEl.addEventListener('submit', formSubmitHandler);


$( document ).ready(() => {
  console.log("Webpage ready");

  userLocation.on("focus", displayModal);


  generateMap();
})
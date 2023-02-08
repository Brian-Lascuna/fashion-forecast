var weatherURL = 'https://api.openweathermap.org/data/3.0/onecall?'
var APIkey = 'appid=5a2b8d33311dc86fb5608e194db81f27';
var lon;
var lat;
var searchLocation;
var eventResult;

// Grab necessary elements
var userLocation = $('#search-location');
var mapModal = $('#mapModal');
var clothingContainer = $('#clothing-container');
var placeEL = $('#place');
var weatherCards = $('.weather-card');
var weatherContainer = $('#weather-container');
var searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
var historyButtons = $('.search-history-button');
var sh0 = $('#sh0');
var sh1 = $('#sh1');
var sh2 = $('#sh2');
var sh3 = $('#sh3');
var sh4 = $('#sh4');
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
    const map = new mapboxgl.Map({
    container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-100,40],
        zoom: 3
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
            userLocation.val(event.result.place_name);

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
    placeEL.text("Weather for " + result.place_name);
    weatherContainer.attr('class', 'row');
    getWeather(lon, lat);
    if(!searchHistory) searchHistory = [];
    searchHistory.splice(0,0,result); // add search to beginning
    for(var i=1; i<searchHistory.length; i++){
      if (result.place_name == searchHistory[i].place_name) {searchHistory.splice(i,1); break;} //remove it from history, will be pushed to the front
    }
    
    while (searchHistory.length>5){
      searchHistory.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    showHistory();
}

function showHistory(){
  if(!searchHistory) searchHistory = [];
  console.log(searchHistory);
  for (var i=0; i<searchHistory.length; i++ ){
    historyButtons[i].style.visibility = "visible";
    historyButtons[i].textContent = searchHistory[i].place_name;
  }
}



function getWeather(lon, lat){  
      fetch(weatherURL + 'lat=' + lat + '&lon=' + lon + "&units=imperial&" + APIkey)  // takes longitude and latitude data from the city search to call the weather API
        .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var weatherIcon;
        //gets data for each weather card (day) and displays it
         for(var i=0; i<weatherCards.length; i++){
          
          switch(data.daily[i].weather[0].icon){
            case '01d':
            case '01n':
              weatherIcon = 'fa-sun'; break;
            case '02d':
            case '02n':
              weatherIcon = 'fa-cloud-sun'; break;
            case '03d':
            case '03n':
            case '04d':
            case '04n':
              weatherIcon = 'fa-cloud'; break;
            case '09d':
            case '09n':
              weatherIcon = 'fa-cloud-rain'; break;
            case '10d':
            case '10n':
              weatherIcon = 'fa-cloud-showers-heavy'; break;
            case '11d':
            case '11n':
              weatherIcon = 'fa-cloud-bolt'; break;
            case '13d':
            case '13n':
              weatherIcon = 'fa-snowflake'; break;
            case '50d':
            case '50n':
              weatherIcon = 'fa-smog'; break;
          }
          weatherCards[i].children[0].children[2].setAttribute('class', 'absolute top-1 right-1 text-8xl sm:text-8xl md:text-7xl lg:text-6xl xl:text-5xl 2xl:text-3xl text-black fas ' + weatherIcon);
          weatherCards[i].children[0].children[3].children[0].textContent = data.daily[i].temp.max;
          weatherCards[i].children[0].children[3].children[2].textContent = data.daily[i].temp.min;
          weatherCards[i].children[0].children[3].children[4].textContent = data.daily[i].weather[0].description;
          weatherCards[i].children[0].children[1].textContent = dayjs.unix(data.daily[i].sunrise).format('M/D/YY');
         }
    });
}

function reloadHistory(){
  console.log(this);
  parseLocation(searchHistory[this.getAttribute('data-num')]);
}

var cityFormEl = document.querySelector('#city-search');
var cityInputEl = document.querySelector('#search-location');

var formSubmitHandler = function (event) {
  event.preventDefault();

  if(eventResult){
    parseLocation(eventResult);
  }

};



$( document ).ready(() => {
  console.log("Webpage ready");
  showHistory();
  
  cityFormEl.addEventListener('submit', formSubmitHandler);
  historyButtons.on("click", reloadHistory);
  userLocation.on("focus", displayModal);

  generateMap();
  
})
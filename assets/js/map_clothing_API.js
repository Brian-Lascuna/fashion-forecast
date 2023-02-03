// Grab necessary elements
var userLocation = $('#search-location');
var mapModal = $('#mapModal');
var clothingBtn = $('#clothingBtn');
var clothingContainer = $('.clothing-container');
var currentLat = 0;
var currentLon = 0;

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
    navigator.geolocation.getCurrentPosition(success, error, options);
    const map = new mapboxgl.Map({
    container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [currentLat, currentLon],
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
            parseLocation(event.result);
        })
    });

    map.on("render", () => {
        map.resize();
    });
};

// Grabs the searched location and spits out longitude/latitude
function parseLocation(result) {
    var coords = result.center;
    console.log("Longitude is " + coords[0]);
    console.log("Latitude is " + coords[1]);
    userLocation.val(result.place_name);
}

// API call the searches for clothing, currently hard-coded for jackets
function searchClothing() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '465ec9dd4dmshe4c6638850c7838p148205jsn273e0cdeaa09',
            'X-RapidAPI-Host': 'amazon-price1.p.rapidapi.com'
        }
    };
    
    fetch('https://amazon-price1.p.rapidapi.com/search?keywords=jacket&marketplace=US', options)
        .then(response => response.json())
        .then(response => {console.log(response); generateCards(response)})
        .catch(err => console.error(err));
}

// Generates the cards that are displayed on the webpage for each clothing result
function generateCards(result) {
    for (var i = 0; i < result.length; i++) {
        var itemName = result[i].title;
        var itemPrice = result[i].price;
        var itemImg = result[i].imageUrl;
        var itemURL = result[i].detailPageURL;


        var clothingCard = $('<div>')
            .addClass('card')
            .css('width', '18rem');

        var clothingImgLink = $('<a>')
            .attr('href', itemURL)
            .attr('target', '_blank');
        var clothingImg = $('<img>')
            .addClass('card-img-top')
            .attr('src', itemImg)
            .attr('alt', 'Card image cap')
            .css('height', '300px');
        clothingImgLink.append(clothingImg);
        clothingCard.append(clothingImgLink);

        var clothingCardBody = $('<div>').addClass('card-body');
        var clothingName = $('<p>')
            .addClass('card-text')
            .text(itemName);
        var clothingPrice = $('<p>')
            .addClass('card-text')
            .text(itemPrice);
        clothingCardBody.append(clothingName);
        clothingCardBody.append(clothingPrice);
        clothingCard.append(clothingCardBody);

        clothingContainer.append(clothingCard);
    }
}

// Clicking the image will redirect to store page
function redirectToProduct(url) {
    window.location.href = url;
}

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

// Functions will not run until webpage is fully loaded
$( document ).ready(() => {
    console.log("Webpage ready");

    userLocation.on("focus", displayModal);
    clothingBtn.on("click", searchClothing);

    generateMap();
})
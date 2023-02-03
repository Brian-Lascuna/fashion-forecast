var introEl = document.getElementById('intro');
var weatherEl = document.getElementById('weather');
var searchBtn = document.getElementById('search');

function search() {
    // hide intro screen
    var introEl = document.getElementById('intro');
    introEl.setAttribute('class', 'hide');
  
    // un-hide weather section
    weatherEl.removeAttribute('class');
}
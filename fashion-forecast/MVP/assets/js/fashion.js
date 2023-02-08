var header = $('#header');
var weatherCard = $('#weather-card');
var weatherAttributes = JSON.parse(localStorage.getItem('weatherCard'));
console.log(header);
console.log(weatherAttributes);
console.log(weatherCard);

weatherCard[0].children[0].children[2].setAttribute('class', weatherAttributes.iconClass);
weatherCard[0].children[0].children[3].children[0].textContent = weatherAttributes.max;
weatherCard[0].children[0].children[3].children[2].textContent = weatherAttributes.min;
weatherCard[0].children[0].children[3].children[4].textContent = weatherAttributes.description;
weatherCard[0].children[0].children[1].textContent = weatherAttributes.date;

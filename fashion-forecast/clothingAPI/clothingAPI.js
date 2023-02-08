var weatherCard = $('.weather-card');
var clothingContainer = $('.clothing-container')

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
            .addClass('rounded-lg shadow-lg bg-white max-w-sm');
        
        var clothingURL = $('<a>')
            .attr('href', itemURL)
            .attr('target', '_blank');
        var clothingImg = $('<img>')
            .addClass('rounded-t-lg')
            .attr('src', itemImg)
            .attr('alt', 'Clothing Image');
        clothingURL.append(clothingImg);

        var clothingCardBody = $('<div>')
            .addClass('p-6');
        var clothingName = $('<h5>')
            .addClass('text-gray-900 text-xl font-medium mb-2')
            .text(itemName);
        var clothingPrice = $('<p>')
            .addClass('text-gray-700 text-base mb-4')
            .text(itemPrice);
        clothingCardBody.append(clothingName);
        clothingCardBody.append(clothingPrice);

        clothingCard.append(clothingURL);
        clothingCard.append(clothingCardBody);

        clothingContainer.append(clothingCard);
    }
}

$( document ).ready(() => {
    console.log('Webpage ready');

    weatherCard.on("click", searchClothing);
})
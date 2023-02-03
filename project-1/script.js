dule.exports = {
    theme: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'tahiti': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
        },
        // ...
      },
    },
  }

  const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
		'X-RapidAPI-Host': 'amazon-price1.p.rapidapi.com'
	}
};

fetch('https://amazon-price1.p.rapidapi.com/search?keywords=%3CREQUIRED%3E&marketplace=ES', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
 
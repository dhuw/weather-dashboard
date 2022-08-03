$(document).ready(function () {

    //api key
    const apiKey = 'efcf0b46c6efbbb9f3196849ae5cef6a';

    //html el
    const cityEl = $('h2#city');
    const dateEl = $('h3#date');
    const weatherIconEl = $('img#weather-icon');
    const temperatureEl = $('span#temperature');
    const humidityEl = $('span#humidity');
    const windEl = $('span#wind');
    const uvIndexEl = $('span#uv-index');
    const cityListEl = $('div.cityList');


    //form
    const cityInput = $('#city-input');

    //recent search btns
    let  pastCities = [];
    
    //function to sort cities
    function compare(a, b) {

        const cityA = a.city.toUpperCase();
        const cityB = b.city.toUpperCase();

        let comparison = 0;
        if (cityA > cityB) {
            comparison = 1;
        } else if (cityA < cityB) {
            comparison = -1;
        }
        return comparison;
    }
    //load pastCities into local
    function loadCities() {
        const storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if  (storedCities) {
            pastCities = storedCities;
        }
    }
    //store pastCities into local
    function storedCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }

})



// JavaScript TODOs
// 1. Add functionality to all buttons
// 2. get connection to openWeatherMap API
// 3. set up search functionality
// 4. make current day highlighted in next 5 days cards
// 5. implement moment.js for #4
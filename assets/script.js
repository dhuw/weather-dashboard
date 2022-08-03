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

    function buildURLFromInputs(city) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    //display last searched cities
    function displayCities(pastCities) {
        cityListEl.empty();
        pastCities.splice(5);
        let sortedCities = [...pastCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location {
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityBtn.append(cityBtn);
        }));
    }

    // uv index color function
    function setIndexColor(uvi) {
        if (uvi < 3) {
            return 'green';
        } else if (uvi >= 3 && uvi < 6) {
            return 'yellow';
        } else if (uvi >= 6 && uvi < 8) {
            return 'orange';
        } else if (uvi >= 8 && uvi < 11) {
            return 'red'
        } else return 'purple'
    }

    //openweather search
    function weatherSearch(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            //store current city into pastCities
            let city = response.name;
            let id = response.id;
            //removing dupes
            if (pastCities[0]) {
                pastCities = $.grep(pastCities, funtion (storedCity) {
                    return id !== storedCity.id;
                })
            }
            pastCities.unshift({city, id});
            storeCities();
            displayCities(pastCities);
        })
    }
    
    //display weather in cards
    cityEl.text(response.name);
    let formattedDate = moment.unix(response.dt).format('L');
    dateEl.text(formattedDate);
    let weatherIcon = response.weather[0].icon;
    weatherIconEl.attr('src', 'http://openweathermap.org/img/wn/${weatherIcon}.png').attr
    ('alt', response.weather[0].description);
    temperatureEl.html(((response.main.temp - 273.15) *1.8 + 32).toFixed(1));
    humidityEl.html(response.main.humidity);
    windEl.html((response.main.wind * 2.237).toFixed(1));

    let lat = reponse.coord.lat;
    let lon = reponse.coord.lon;

})



// JavaScript TODOs
// 1. Add functionality to all buttons
// 3. set up search functionality
// 5. implement moment.js for #4
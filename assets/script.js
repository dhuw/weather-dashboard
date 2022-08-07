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
    function storeCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }

    function buildURLFromInputs(city) {
        if (city) {
          return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;  
        }
    }

    function buildURLFromId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }


    //display last searched cities
    function displayCities(pastCities) {
        cityListEl.empty();
        pastCities.splice(5);
        let sortedCities = [...pastCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location) {
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListEl.append(cityDiv);
        });
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
                pastCities = $.grep(pastCities, function (storedCity) {
                    return id !== storedCity.id;
                })
            }
            pastCities.unshift({city, id});
            storeCities();
            displayCities(pastCities);
        
            //display weather in cards
            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIconEl.attr('src', 'http://openweathermap.org/img/wn/${weatherIcon}.png').attr
            ('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) *1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

            let lat = reponse.coord.lat;
            let lon = reponse.coord.lon;
            let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            $.ajax({
                url: queryURLAll,
                method: 'GET'
            }).then(function (response) {
                let uvIndex = response.current.uvi;
                let uvColor = setIndexColor
                uvIndexEl.text(response.current.uvi);
                uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`)
                let fivDay = response.daily;

                //five day dom 
                for (let i = 0; i <= 5; i++) {
                    let currDay = fiveDay[i];
                    $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
                    $(`div.day-${i} .fiveDay-img`).attr(
                        'src',
                        `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                    ).attr('alt', currDay.weather[0].description);
                    $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                    $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);


                }
            });
        });
    }

    //last searched city funbction
    function displaylastSearchedCity() {
        if (pastCities[0]) {
            let queryURL = buildURLFromId(pastCities[0].id);
            weatherSearch(queryURL);
        } else { // if no past cities seattle will be searched by default
            let queryURL = buildURLFromInputs("Seattle");
            weatherSearch(queryURL);
        }
    }


    //search btn click func
    $('#search-btn').on('click', function (event) {
        event.preventDefault();
        let city = cityInput.val().trim();
        city = city.replace(' ', '%20');
        cityInput.val('');
        if (city) {
            let queryURL = buildURLFromInputs(city);
            weatherSearch(queryURL);
        }
    });
    //init process
    loadCities();
    displayCities(pastCities);
    displaylastSearchedCity();
});

//code finished
//errors persist
//api call issues

//uncaught reference error ln 51 id is not defined
//error occurs when searching


//jquery error 'storeCities is not defined'
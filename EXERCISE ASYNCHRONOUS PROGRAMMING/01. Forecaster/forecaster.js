function attachEvents() {
    $('#submit').on('click', getWeather);
    const FORECAST = $('#forecast');
    const CURRENT = $(FORECAST).children('#current');
    const UPCOMING = $(FORECAST).children('#upcoming');

    function getWeather() {
        getCode.then((response => {
            Promise.all([getCurrentWeather(response), getUpcomingWeather(response)]).then(function (values) {
                renderTodayForecast(values[0]);
                renderUpcomingForecast(values[1]);
                FORECAST.css('display', '');

            });
        }))
    }

    let getCode = new Promise((resolve, reject) => {
        let URL = 'https://judgetests.firebaseio.com/locations.json';
        let code = undefined;
        $.ajax({
            method: 'GET',
            url: URL,
            success: function (res) {
                resolve(res.filter(n => n.name === 'New York')[0].code);
            },
            error: function (err) {
                reject(err);
            }
        })
    });


    function getCurrentWeather(code) {
        return new Promise((resolve, reject) => {
            let URL = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;
            $.ajax({
                method: 'GET',
                url: URL,
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    function getUpcomingWeather(code) {
        return new Promise((resolve, reject) => {
            let URL = `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`;
            $.ajax({
                method: 'GET',
                url: URL,
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    function renderTodayForecast(res) {
        let condition = getConditionSymbol(res.forecast.condition);
        CURRENT.children('.condition symbol').remove();
        CURRENT.children('.condition').remove();
        CURRENT.append(`<span class="condition symbol">${condition[1]}</span>`);
        let conditionSpan = $('<span class="condition"></span>');
        conditionSpan.append(`<span class="forecast-data">${res.name}</span>`);
        conditionSpan.append(`<span class="forecast-data">${res.forecast.high}&#176;/${res.forecast.low}&#176;</span>`);
        conditionSpan.append(`<span class="forecast-data">${condition[0]}</span>`);
        CURRENT.append(conditionSpan);
    }

    function renderUpcomingForecast(res) {
        UPCOMING.children('.upcoming').remove();
        for (let i = 0; i < res.forecast.length; i++) {
            let condition = getConditionSymbol(res.forecast[i].condition);
            let innerUpcoming = $('<span class="upcoming"></span>');
            innerUpcoming.append(`<span class="symbol">${condition[1]}</span>`);
            innerUpcoming.append(`<span class="forecast-data">${res.forecast[i].high}&#176;/${res.forecast[i].low}&#176;</span>`);
            innerUpcoming.append(`<span class="forecast-data">${condition[0]}</span>`);
            UPCOMING.append(innerUpcoming);
        }
    }

    function getConditionSymbol(condition) {
        switch (condition) {
            case 'Sunny':
                return ['Sunny', '&#x2600'];
            case 'Partly sunny':
                return ['Partly sunny', '&#x26C5;'];
            case 'Overcast':
                return ['Overcast', '&#x2601;'];
            case 'Rain':
                return ['Rain', '&#x2614;'];
            default:
                break;
        }
    }
}
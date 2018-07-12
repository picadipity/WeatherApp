angular.module('WeatherApp.Common')
    .service('EndpointConfigService', function() {
        let service = this,
            weatherAppURL = 'https://api.openweathermap.org/data/2.5/weather';

        // service.getUrl = function() {
        //   return weatherAppURL;
        // };

        // service.getForecast = function(city, appId) {
        //     return weatherAppURL + city + ',us&APPID=' + appID;
        // };
    });

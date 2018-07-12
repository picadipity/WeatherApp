angular.module('WeatherApp.Common')
    .service('ForecastModel',
        function ($http, UtilsService) {
            let service = this;

            service.get = function (city, appID) {
              return $http({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city,
                method:'GET',
                params: {
                  units: 'imperial',
                  APPID: appID,
                  cnt: 5
                }
              }).then(
                            function(result) {
                              console.log("weather api result = " + result);
                                return UtilsService.objectToArray(result, "list");
                            }
                        );
            };

        });

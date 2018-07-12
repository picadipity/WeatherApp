angular.module('WeatherApp.Data')
  .directive('weatherData', function () {
  return {
    restrict: 'AE',
    link: function (scope, element) {
      element[0].scope = {
        getScope: function() {
          return scope;
        }
      };
    },
    controller: 'WeatherAppDataController'
  }
});

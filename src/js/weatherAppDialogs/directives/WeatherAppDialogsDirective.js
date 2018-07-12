angular.module('WeatherApp.WeatherAppDialogs')
  .component('weatherLocation', {
    templateUrl: '/partials/location.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: "WeatherAppDialogsController"
  })
  .component('weatherForecast', {
    templateUrl: '/partials/weather.html',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: "WeatherAppDialogsController"
  })
  .component('generalError', {
    templateUrl: '/partials/generalError.html',
    bindings: {
      resolve: '<',
      dismiss: '&'
    },
    controller: "WeatherAppGeneralErrorController"
  });


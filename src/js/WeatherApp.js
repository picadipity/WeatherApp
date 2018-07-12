;(function () {
  'use strict';

  angular.module('WeatherApp', ['WeatherApp.Common', 'WeatherApp.Data', 'WeatherApp.WeatherAppDialogs'])

    .controller('WeatherAppController', [
      'WeatherAppDialogsService',
      function (WeatherAppDialogsService) {

        // .ready method used to popup location form
        // when DOM is ready.
        angular.element(document).ready(function () {
          WeatherAppDialogsService.show("");
        });
      }
      ])
})();


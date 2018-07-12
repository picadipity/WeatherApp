angular.module('WeatherApp.WeatherAppDialogs')
      .controller('WeatherAppDialogsController', [
        '$scope', '$document', '$q', '$log', '$uibModal', 'WeatherAppDialogsService',
        function ($scope, $document, $q, $log, $uibModal, WeatherAppDialogsService) {

          $ctrl = this;
          $scope.location;
          $scope.forecast;
          $scope.dialogType;

          $ctrl.$onInit = function () {
            if ($ctrl.resolve === undefined) {
              return;
            }

            $scope.dialogType = $ctrl.resolve.dialogType;

            if ($scope.dialogType === "location") {
              $scope.location = $ctrl.resolve.location;
              // set model so location will appear in edit control
              $ctrl.location = $scope.location;

              // setup event handler so enter key will dismiss dialog
              let EVENT_TYPES = "keydown keypress"
              function eventHandler(event) {
                if (event.which === 13) {
                  $ctrl.close({$value: {location: document.getElementsByName("location")[0].value}});
                }
              }
              $document.bind(EVENT_TYPES, eventHandler);
            } else if ($scope.dialogType === "forecast") {
              $scope.forecast = $ctrl.resolve.forecast;
            }
          };

          $ctrl.ok = function () {
            if ($scope.dialogType === "location") {
              $ctrl.close({$value: {location: document.getElementsByName("location")[0].value}});
            } else {
              $ctrl.close({$value: 'ok'});
            }
          };

          $ctrl.cancel = function () {
            $ctrl.close({$value: 'cancel'});
            let location = WeatherAppDialogsService.getLastLocation();
            WeatherAppDialogsService.show(location);
          };

          $ctrl.search = function(city) {
            WeatherAppDialogsService.getForecast(city).then( function(result) {
              console.log("forecast result = " + result);
            });
          };

          $ctrl.getLocation = function() {
            return $scope.location;
          };

          $ctrl.locationSuccess = function(result) {
//            $log.info('locationSuccess result = ' + result);
            $scope.location = result.location;
          };

          $ctrl.locationFail = function() {
//            $log.info('locationFail');
          };

          $ctrl.forecastSuccess = function() {
//            $log.info('forecastSuccess result = ' + result);
          };

          $ctrl.forecastFail = function() {
//            $log.info('forecastFail');
          };

       } // function ($scope, $q, $log, $uibModal)
    ]);

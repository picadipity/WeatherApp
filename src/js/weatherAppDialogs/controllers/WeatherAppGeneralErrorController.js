angular.module('WeatherApp.WeatherAppDialogs')
      .controller('WeatherAppGeneralErrorController', [
        '$scope', '$q', '$log', '$uibModal', 'WeatherAppDialogsService',
        function ($scope, $q, $log, $uibModal, WeatherAppDialogsService) {

          $ctrl = this;
          $scope.error;
          $scope.dialogType;

          $ctrl.$onInit = function () {
            if ($ctrl.resolve === undefined) {
              return;
            }

            $scope.dialogType = $ctrl.resolve.dialogType;
            if ($scope.dialogType === "generalError") {
              $scope.error = $ctrl.resolve.error;
            }
          };

          $ctrl.cancel = function () {
            $ctrl.dismiss({$value: 'cancel'});
            WeatherAppDialogsService.show("");
          };

        } // function ($scope, $q, $log, $uibModal)
    ]);

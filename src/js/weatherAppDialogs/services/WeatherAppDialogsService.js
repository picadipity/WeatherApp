angular.module('WeatherApp.WeatherAppDialogs')
      .factory('WeatherAppDialogsService', [
        '$q', '$log', '$uibModal', 'ForecastModel', 'UtilsService',
        function ($q, $log, $uibModal, ForecastModel, UtilsService) {

          let location = "";

          return {
            setLocation:              setLocation,
            getLocation:              getLocation,
            getLastLocation:          getLastLocation,
            showWeather:              showWeather,
            show:                     show,
            getForecast:              getForecast,
            generalError:             generalError
          };

          function getLocation() {
            return $ctrl.getLocation();
          }

          function getLastLocation() {
            return location;
          }

          function setLocation(location) {
//            console.log("setLocation for location = " + location);
            return $q(function(resolve, reject) {

              let openModalOptions = {
                  bindToController: true,
                  controller: "WeatherAppDialogsController",
                  controllerAs: '$ctrl',
                  component: 'weatherLocation',
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                    location: function() {
                      return location;
                    },
                    dialogType: function() {
                      return "location";
                    }
                  }
              };

              let modalInstance = $uibModal.open(openModalOptions);

              modalInstance.result.then(function (result) {
//                $log.info('result = ' + result);
                $ctrl.locationSuccess(result);
                resolve();
              }, function () {
//                $log.info('modal-component dismissed at: ' + new Date());
                $ctrl.locationFail();
                reject();
              });
            });
          }

          function showWeather(result) {
//            console.log("showWeather for location = " + location);
            return $q(function(resolve, reject) {

              let openModalOptions = {
                bindToController: true,
                controller: "WeatherAppDialogsController",
                controllerAs: '$ctrl',
                component: 'weatherForecast',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                  result: function() {
                    return result;
                  },
                  dialogType: function() {
                    return "forecast";
                  }
                }
              };

              let modalInstance = $uibModal.open(openModalOptions);

              modalInstance.result.then(function (result) {
//                $log.info('result = ' + result);
                $ctrl.forecastSuccess(result);
                resolve();
              }, function () {
//                $log.info('modal-component dismissed at: ' + new Date());
                $ctrl.forecastFail();
                reject();
              });
            });
          }

          function getForecast(location) {
            return $q(function(resolve, reject) {
              // make api call
              let apiKey = "f271bead7b10db463acbdd03d4552f78";
              ForecastModel.get(location, apiKey)
                .then(function (result) {
                  console.log('result = ' + result);
                  resolve(result);
                  // return result;
                }, function (reason) {
                  $log.debug('REASON', reason);
                  let result = UtilsService.objectToArray(reason, "data");
                  $log.debug('error result message', result.message);
                  reject();
                  generalError(result.message);
                });
            })
          }

          function show(loc) {
            location = loc;
            setLocation(location).then( function() {
              location = getLocation();
              console.log("location = " + location);
              if (location === "") {
                show(location);
              } else {
                // make api call
                let apiKey = "f271bead7b10db463acbdd03d4552f78";
                ForecastModel.get(location, apiKey)
                  .then(function (result) {
                    console.log('result = ' + result);
                    showWeather(result).then(function () {
                      console.log("forecast dismissed");
                    })
                  }, function (reason) {
                    $log.debug('REASON', reason);
                    let result = UtilsService.objectToArray(reason, "data");
                    $log.debug('error result message', result.message);
                    generalError(result.message);
                  });
              }
            });
          }

          function generalError(error) {

            let modalInstance = $uibModal.open({
              bindToController: true,
              controller: "WeatherAppGeneralErrorController",
              controllerAs: '$ctrl',
              component: 'generalError',
              backdrop: 'static',
              keyboard: false,
              resolve: {
                error: function() {
                  return error;
                },
                dialogType: function() {
                  return "generalError";
                }
              }
            });

            modalInstance.result.then(function (result) {
              $log.info('generalError result = ' + result);
            }, function () {
              $log.info('generalError dismissed at: ' + new Date());
            });
          }

        } // function ($scope, $q, $log)
    ]);

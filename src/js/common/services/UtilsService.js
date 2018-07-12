angular.module('WeatherApp.Common')
    .service('UtilsService',
        function() {
            var service = this;

            service.objectToArray = function(content, selector) {
                // normalizes data from node and picadipity so both get returned as arrays
              if (content.data[selector] instanceof Object && !Array.isArray(content.data[selector])) {
                    var newArray = [];

                    for (var key in content.data[selector]) {
                        var item = content.data[selector][key];
                        if (item !== undefined && item !== null) {
                          item.id = key;
                          newArray.push(item);
                        }
                    }
                    return newArray;

                } else {
                    return content.data;
                }
            };
        }
    );

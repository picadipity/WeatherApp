angular.module('Picadipity.Common')
    .config([
         '$indexedDBProvider',
         function ($indexedDBProvider) {
             $indexedDBProvider
             .connection('PicadipityDataDB')
             .upgradeDatabase(1, function(event, db, tx){
               var objStore = db.createObjectStore('PicadipityData', {keyPath: 'id'});
             });
         }
     ])
    .factory('sharedPicadipityData',
        ['$q', '$log', '$rootScope', '$timeout', '$indexedDB', '$localStorage', 'PicadipityInfoModel', 'PicadipityImagesModel', 'PicadipityModerationModel', 'PreloaderService',
         function($q, $log, $rootScope, $timeout, $indexedDB, $localStorage, PicadipityInfoModel, PicadipityImagesModel, PicadipityModerationModel, PreloaderService) {

          var selector = 'picadipityImages',
              infoSelector = 'picadipityInfo',
              listSelector = 'picadipities',
              moderationSelector = 'moderationInfo';

          var picadipityData = {
              order: [],
              files: [],
              picadipityDescription: "",
              picadipityTitle: ""
          };

          var picadipityModTimeData = {
              id: "",
              time: ""
          };

          var picadipityEntries = [];
          var picadipityInformation = [];
          var picadipityImages = [];
          var picadipityModeration = [];
          var picadipityModTimesJSON = "";
          var picadipityModTimes = {};  // map of key/value pairs
          var currentUser = null;
          var currentScope = null;
          var authenticated = false;
          $rootScope.isNavCollapsed = true;
          $rootScope.lockUI = false;

          // Auth variables
          var app = null;
          var auth = null;
          var ui = null;

          startAuth();

          return {
            getPicadipityData:        getPicadipityData,
            lookupPicadipityData:     lookupPicadipityData,
            updatePicadipityData:     updatePicadipityData,
            deletePicadipityData:     deletePicadipityData,
//            submitPicadipityData:     submitPicadipityData,
            picadipityInfo:           picadipityInfo,
            getPicadipityInformation: getPicadipityInformation,
            picadipityImageOrder:     picadipityImageOrder,
            getPicadipityImages:      getPicadipityImages,
            picadipityModerationInfo: picadipityModerationInfo,
            getModerationInformation: getModerationInformation,
            lookupPicadipityEntries:  lookupPicadipityEntries,
            getPicadipityEntries:     getPicadipityEntries,
            currentUser:              currentUser,
//            handleModes:              handleModes,
            signin:                   signin,
            logoff:                   logoff,
            setScope:                 setScope,
            authenticated:            authenticated
          };

          function setCurrentUser(user) {
            currentUser = user;
            if (currentScope) {
              currentScope.currentUser = user;
            }
          }

          function setScope(scope) {
            currentScope = scope;
          }

          function getPicadipityData() {
            return picadipityData;
          }; // getPicadipityData

          function getPicadipityEntries() {
            return picadipityEntries;
          }; // getPicadipityEntries

          function getPicadipityImages() {
            return picadipityImages;
          }; // getPicadipityImages

          function getPicadipityInformation() {
            return picadipityInformation;
          }; // getPicadipityInformation

          function getModerationInformation() {
            return picadipityModeration;
          }; // getModerationInformation

          function lookupPicadipityData(user, providerId, picId) {
            return $q(function(resolve, reject) {
//              $log.debug('lookupPicadipityData');
              picadipityData = {};
              $indexedDB.openStore('PicadipityData', function(store) {
//                $log.debug('lookupPicadipityData -- $indexedDB.openStore');
                var newItem = [{ id: picId, user: user, providerId: providerId }];
                var jsonQueryData = JSON.stringify(newItem[0]);
                store.find(jsonQueryData).then(function(data) {
                  picadipityData = data;
                  picadipityData = picadipityData.data;
//                  $log.debug('FIND', picId);
//                  $log.debug('DATA', picadipityData);
                  resolve();
                }, function (reason) {
//                  $log.debug('REASON', reason);
                  picadipityData = {};
                  reject();
                }).catch(function(error) {
//                  $log.debug("error in lookupPicadipityEntries(), error = ", error);
                }); // store.getAll().then
              }); // $indexedDB.openStore
            });
          }; // lookupPicadipityData

          function updatePicadipityData(user, providerId, picId, item) {
            return $q(function(resolve, reject) {
//              $log.debug('updatePicadipityData');
              $indexedDB.openStore('PicadipityData', function(store) {
//                $log.debug('updatePicadipityData -- $indexedDB.openStore');
                var newItem = [{ id: picId, user: user, providerId: providerId }];
                var jsonQueryData = JSON.stringify(newItem[0]);
                store.upsert({"id": jsonQueryData, "data": item}).then(function(e) {
//                  $log.debug('UPSERT', e);
                  resolve();
                }).catch(function (error) {
//                  $log.debug('updatePicadipityData -- catch error = ' + error);
                  reject();
                });
              }); // $indexedDB.openStore
            });
          }; // updatePicadipityData

          function deletePicadipityData(user, providerId, picId) {
            return $q(function(resolve, reject) {
//              $log.debug('deletePicadipityData');
              $indexedDB.openStore('PicadipityData', function(store) {
//                $log.debug('deletePicadipityData -- $indexedDB.openStore');
                var newItem = [{ id: picId, user: user, providerId: providerId }];
                var jsonQueryData = JSON.stringify(newItem[0]);
                store.find(jsonQueryData).then(function(data) {
//                  $log.debug('store.find(picId)');
                  store.deleteData(jsonQueryData).then(function(e) {
//                    $log.debug('store.deleteData(picId)');
                    resolve();
                  });
                }, function(data) {
//                  $log.debug('fail on store.find(picId)');
                  reject();
                }); // store.getAll().then
              }); // $indexedDB.openStore
            });
          }; // deletePicadipityData

          function lookupPicadipityEntries(user, providerId) {
            return $q(function(resolve, reject) {
//              $log.debug('lookupPicadipityEntries');
              $indexedDB.openStore('PicadipityData', function(store) {
//                $log.debug('lookupPicadipityEntries -- $indexedDB.openStore');
                store.getAll().then(function(entries) {
                  var newEntries = [];
                  // Update scope
                  entries.map(function (el, index) {
                    // convert el to object
                    var item = JSON.parse(el.id);
                    if (item.user === user && item.providerId === providerId) {
                      el.picId = item.id;
                      newEntries.push(el);
                    }
                  });

                  picadipityEntries = newEntries;
                  for (var i = 0; i < picadipityEntries.length; i++) {
                    // extend to include delete flag
                    var markedForUndo = false;
                    angular.extend(picadipityEntries[i], markedForUndo);
                  }
                  resolve();
                }, function(data) {
//                  $log.debug('fail on store.getAll()');
                  reject();
                }).catch(function(error) {
//                  $log.debug("error in lookupPicadipityEntries(), error = ", error);
                }); // store.getAll().then
              }); // $indexedDB.openStore
            });
          }; // picadipities.getPicadipityTitles

//          function submitPicadipityData(picId, item) {
//            return $q(function(resolve, reject) {
//              $log.debug('submitPicadipityData');
//              $indexedDB.openStore('PicadipityData', function(store) {
//                $log.debug('submitPicadipityData -- $indexedDB.openStore');
//                store.upsert({"id": picId, "data": item}).then(function(e) {
//                  $log.debug('UPSERT', e);
//                  resolve();
//                }); // store.upsert().then
//              }); // $indexedDB.openStore
//            });
//          }; // submitPicadipityData

          function picadipityImageOrder(picId) {
            return $q(function(resolve, reject) {
//              $log.debug('ORDER -- picadipityId = ', picId);
              PicadipityImagesModel.all(selector, picId).then(function (result) {
                picadipityImages = (result !== 'null') && (result !== "") && (result[selector] !== undefined) && (result[selector] !== 'null') ? result[selector] : {};
                var resultFromSelector = result[selector];
//                $log.debug('RESULT', resultFromSelector);
                resolve();
              }, function (reason) {
//                $log.debug('REASON', reason);
                reject();
              });
            });
          };

          function picadipityInfo(picId) {
            return $q(function(resolve, reject) {
//              $log.debug('INFO -- picadipityId = ', picId);
              PicadipityInfoModel.info(infoSelector, picId).then(function (result) {
                picadipityInformation = (result !== 'null') && (result !== "") ? result : {};
//                $log.debug('RESULT', result);
                resolve();
              }, function (reason) {
//                $log.debug('REASON', reason);
                reject();
              });
            });
          };

          function picadipityModerationInfo(picId) {
            return $q(function(resolve, reject) {
//              $log.debug('MODERATION -- picadipityId = ', picId);
              PicadipityModerationModel.info(moderationSelector, picId).then(function (result) {
                picadipityModeration = (result !== 'null') && (result !== "") && (result[moderationSelector] !== undefined) && (result[moderationSelector] !== 'null') ? result[moderationSelector] : {};
//                $log.debug('RESULT', result);
                resolve();
              }, function (reason) {
//                $log.debug('REASON', reason);
                reject();
              });
            });
          };

          modalObject().on('hidden.bs.modal', function(event) {
            if (modeValue() === 'verifyEmail') {
              // refresh window
              window.location.replace("home.html?mode=accountVerified");
            }
          });

          modalObject().on('click', function(event) {

            // determine if event was outside of modal dialog
            var clickX = event.pageX;
            var clickY = event.pageY;
            var modalContent = $('.modal').children('div').eq(0).children('div').eq(0);
            if (modalContent.hasClass('modal-content')) {
              var posModalContent = modalContent.offset();
              var width = modalContent.width();
              var height = modalContent.height();

              // do hit testing on click position
              if ( (clickX >= posModalContent.left && clickX <= posModalContent.left + width) &&
                   (clickY >= posModalContent.top && clickY <= posModalContent.top + height) ) {
              } else {
                $('#loginDialog').modal('hide');
              }
            }
          });
    }]);

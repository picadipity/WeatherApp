angular.module('WeatherApp.Common')
    .service('modalService', ['$uibModal',
       // see:
       // http://stackoverflow.com/a/29602528/7228835 and
       // https://weblogs.asp.net/dwahlin/building-an-angularjs-modal-service
       //
       // NB: For Angular-bootstrap 0.14.0 or later, use $uibModal above instead of $modal
       function ($uibModal) {

           var modalDefaults = {
               backdrop: true,
               keyboard: true,
               modalFade: true,
               templateUrl: '/partials/modal.html'
           };

           var modalOptions = {
               closeButtonText: 'Close',
               actionButtonText: 'OK',
               headerText: 'Proceed?',
               bodyText1: 'Perform this action?',
               bodyText2: 'This action cannot be undone.'
           };

           this.showModal = function (customModalDefaults, customModalOptions) {
               if (!customModalDefaults) customModalDefaults = {};
               customModalDefaults.backdrop = 'static';
               return this.show(customModalDefaults, customModalOptions);
           };

           this.show = function (customModalDefaults, customModalOptions) {
               //Create temp objects to work with since we're in a singleton service
               var tempModalDefaults = {};
               var tempModalOptions = {};

               //Map angular-ui modal custom defaults to modal defaults defined in service
               angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

               //Map modal.html $scope custom properties to defaults defined in service
               angular.extend(tempModalOptions, modalOptions, customModalOptions);

               if (!tempModalDefaults.controller) {
                   tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                       $scope.modalOptions = tempModalOptions;
                       $scope.modalOptions.ok = function (result) {
                           $uibModalInstance.close(result);
                       };
                       $scope.modalOptions.close = function (result) {
                           $uibModalInstance.dismiss('cancel');
                       };
                   };
               }

               return $uibModal.open(tempModalDefaults).result;
           };

       }]);

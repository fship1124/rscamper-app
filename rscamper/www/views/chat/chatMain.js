/**
 * Created by Bitcamp on 2016-11-16.
 */
angular.module('App')
.controller('chatMainCtrl',function ($scope, $ionicModal, $http, $rootScope) {
  $rootScope.socket = io.connect($rootScope.url + "10001");
  $http.get($rootScope.url + "8090/rscamper-server/app/chat/getCodeName", {
    params : {
      codeName : 'areacode'
    }})
    .success(function (result) {
      $rootScope.codeTb = result;
    })
  $ionicModal.fromTemplateUrl('views/chat/createRoom.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.closeModal = function () {
    $scope.modal.hide();
  }
});

/**
 * Created by Bitcamp on 2016-10-31.
 */
angular.module('App')
  .controller('ScheduleCtrl', function ($ionicPlatform, $cordovaGeolocation, $http, $state, $scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('views/schedule/makeSchedule.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.createSchedule = function (s) {
    }
  });

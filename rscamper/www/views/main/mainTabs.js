angular.module('App')
  .controller('MainCtrl', function ($scope, $ionicSlideBoxDelegate, $window) {
    $scope.Height = $window.innerHeight-30;
  });

angular.module('App')
  .controller('MainCtrl', function ($scope, $ionicSlideBoxDelegate, $window) {
    $scope.Height = $window.innerHeight-30;

    $scope.photos = [];
    for (var i = 0; i < 100; i++) {
      $scope.photos.push({id: i, src:'nothing'});
    }
  });

angular.module('App')
  .controller('PostTabCtrl', function ($scope) {
    $scope.photos = [];
    for (var i = 0; i < 100; i++) {
      $scope.photos.push({id: i, src:'http://lorempixel.com/250/250?q='+(i%17)});
    };
  });

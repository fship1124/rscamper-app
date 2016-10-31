angular.module('App')
.controller('MainTabCtrl', function ($scope, $http) {
  // $scope.page = 0;
  // $scope.total = 1;
  // $scope.list = [];
  //
  // $scope.getLists = function () {
  //   $scope.page++;
  //   $http.get()
  // }
  $scope.photos = [];
  for (var i = 0; i < 100; i++) {
    $scope.photos.push('http://lorempixel.com/250/250?q='+(i%17));
  };

  $scope.load = function () {
    $http.get()
      .success(function () {
        // db 불러오기
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      })
  }
})

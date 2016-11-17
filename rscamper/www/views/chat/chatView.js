angular.module('App')
.controller('chatViewCtrl',function ($scope, $rootScope, $stateParams) {
  for (var i = 0; i < $rootScope.codeTb.length; i++) {
    if ($stateParams.no == $rootScope.codeTb[i].codeNo) {
      $scope.area = $rootScope.codeTb[i];
      console.log($scope.area);
      return false;
    }
  }
});

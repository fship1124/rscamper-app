/**
 * Created by 이성주 on 2016-12-09.
 */
angular.module('App')
.controller('travelPriceCtrl',function ($scope, $rootScope, $http, $stateParams) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
  $http.get($rootScope.url + '8081/app/tourschedule/scheduleListDetail', {
    params : {
      no : $stateParams.recordNo
    }
  })
    .success(function (data) {
      $scope.travelPrice = data;

      $http.get($rootScope.url + '8081/app/tourschedule/getTourDate',
        {params : {
          dDate : $scope.travelPrice.departureDate,
          aDate : $scope.travelPrice.arriveDate
        }})
        .success(function (result) {
          $scope.period = result;
          console.log("기간 : " + result);
        });
    });
});

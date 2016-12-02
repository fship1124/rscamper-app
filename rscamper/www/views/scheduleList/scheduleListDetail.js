/**
 * Created by 이성주 on 2016-12-01.
 */
angular.module('App')
.controller('scheduleListDetailCtrl', function ($rootScope, $scope, $stateParams, $http, scheduleListDetail) {
  $scope.scheduleListDetail = scheduleListDetail.getScheduleListDetail($stateParams.recordNo);
  console.log($scope.scheduleListDetail);
  $scope.isCustomizing = true;
  $rootScope.getScheduleLocation = {};
  $http.get($rootScope.url + '8081/app/tourschedule/getScheduleLocation',
    {params : {
      no : $stateParams.recordNo
    }})
    .success(function (data) {
      $rootScope.getScheduleLocation = data;
      console.log(data);
    })

  $http.get($rootScope.url + '8081/app/tourschedule/getTourDate',
    {params : {
      dDate : $scope.scheduleListDetail.departureDate,
      aDate : $scope.scheduleListDetail.arriveDate
    }})
    .success(function (result) {
      $scope.period = result;
      console.log("기간 : " + result);
    });

  $http.get($rootScope.url + '8081/app/tourschedule/checkScheduleLike', {
    params : {
      userUid : $rootScope.rootUser.userUid,
      recordNo : $scope.scheduleListDetail.recordNo
    }
  })
    .success(function (data) {
      $scope.isLiked = data;
    });

  $http.get($rootScope.url + '8081/app/tourschedule/checkCustomizing', {
    params : {
      userUid : $rootScope.rootUser.userUid,
      recordNo : $scope.scheduleListDetail.recordNo
    }
  })
    .success(function (data) {
      $scope.isCustomizing = data;
    });

  $scope.recommendSchedule = function () {
    $http.get($rootScope.url + '8081/app/tourschedule/addScheduleLike', {
      params : {
        userUid : $rootScope.rootUser.userUid,
        recordNo : $scope.scheduleListDetail.recordNo
      }
    })
      .success(function (result) {
        console.log("추천수 : " , result);
        $scope.isLiked = false;
      });
  }
  $scope.cancelRecommend = function () {
    $http.get($rootScope.url + '8081/app/tourschedule/cancelScheduleLike', {
      params : {
        userUid : $rootScope.rootUser.userUid,
        recordNo : $scope.scheduleListDetail.recordNo
      }
    })
      .success(function (result) {
        console.log("추천수 : " , result);
        $scope.isLiked = true;
      });
  }
  $scope.customizing = function () {
    $http({
      url: $rootScope.url + '8081/app/tourschedule/addCustomizing',
      method: 'POST',
      data: $.param({
        recordNo : $scope.scheduleListDetail.recordNo,
        budGet : $scope.scheduleListDetail.budGet,
        period : $scope.scheduleListDetail.period,
        strapline : $scope.scheduleListDetail.strapline,
        title : $scope.scheduleListDetail.title,
        arriveDate : new Date($scope.scheduleListDetail.arriveDate),
        departureDate : new Date($scope.scheduleListDetail.departureDate),
        isOpen : 2,
        userUid : $rootScope.rootUser.userUid
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .success(function (result) {
        console.log("등록 후 : ", result);
        $scope.customizingCnt = result;
        $scope.isCustomizing = false;
      })
  }

  $scope.cancelCustomizing = function () {
    $http.get($rootScope.url + '8081/app/tourschedule/cancelCustomizing', {
      params : {
        recordNo : $scope.scheduleListDetail.recordNo,
        userUid : $rootScope.rootUser.userUid
      }
    })
      .success(function (result) {
        console.log("취소 후 : ", result);
        $scope.isCustomizing = true;
      })
  }
});

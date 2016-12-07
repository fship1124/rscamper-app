/**
 * Created by 이성주 on 2016-12-01.
 */
app.controller("scheduleListMainCtrl", function ($rootScope, $scope, $stateParams, $http, $ionicModal, $ionicLoading, MyConfig, MyPopup, ValChkService) {
/*  $http.get($rootScope.url + "8081/app/tourschedule/allScheduleList")
    .success(function (data) {
      console.log(data);
    })*/

  // 게시판 리스트 불러오기
  $scope.getScheduleList = function () {
    $scope.page++;
    $ionicLoading.show({
      template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
    });

    $http({
      url: $rootScope.url + "8081/app/tourschedule/allScheduleList?page=" + $scope.page + "&count=" + $scope.count,
      method: "GET"
    }).success(function (response) {
      console.log(response);
      angular.forEach(response.tourList, function (schedule) {
        $rootScope.allScheduleList.push(schedule);
      })
      $scope.total = response.totalPages;
      $scope.totalCount = response.totalCount;
    })
      .error(function (error) {
        MyPopup.alert("에러", "서버접속불가");
      })
      .finally(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  }

  // 위로 당겼을 때 페이징 초기화 및 새로고침
  $scope.load = function () {
    $scope.count = 5;
    $scope.page = 0;
    $scope.total = 1;
    $rootScope.allScheduleList = [];
    $scope.getScheduleList();
  }

  $scope.load();
})

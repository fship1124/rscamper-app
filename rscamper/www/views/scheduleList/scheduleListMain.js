/**
 * Created by 이성주 on 2016-12-01.
 */
app.controller("scheduleListMainCtrl", function ($rootScope, $scope, $stateParams, $http, $ionicModal, $ionicLoading, MyConfig, MyPopup, ValChkService) {
/*  $http.get($rootScope.url + "8081/app/tourschedule/allScheduleList")
    .success(function (data) {
      console.log(data);
    })*/
  $scope.myItems = [];
  $scope.myItems.push('제목제목제목제목길게제목길게길게길게길게길게길게');
  $scope.myItems.push('제목짧게');
  $scope.myItems.push(3);
  $scope.myItems.push(4);
  $scope.myItems.push('안녕 제목 안녕 제목');

  $scope.images = [];
  $scope.images.push('img/example_img/000019620002.jpg');
  $scope.images.push('img/example_img/000019620031.jpg');
  $scope.images.push('img/example_img/000019630025.jpg');
  $scope.images.push('img/example_img/000019650021.jpg');
  $scope.images.push('img/example_img/000019660011.jpg');


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
        $scope.allScheduleList.push(schedule);
      })
      console.log($scope.allScheduleList);
      $scope.total = response.totalPages;
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
    $scope.allScheduleList = [];
    $scope.getScheduleList();
  }

  $scope.load();
})

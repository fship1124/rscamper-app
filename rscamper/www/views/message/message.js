angular.module('App')
.controller('MessageCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, $location) {
  // 쪽지 리스트 불러오기
  $scope.getMessageList = function () {
    $scope.page++;
    $ionicLoading.show({
      template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
    });

    $http({
      url: "http://192.168.0.187:8081/app/message/list?page=" + $scope.page + "&count=" + $scope.count + "&userUid=" + $rootScope.rootUser.userUid,
      method: "GET"
    }).success(function (response) {
      angular.forEach(response.messageList, function (message) {
        $scope.myMessageList.push(message);
      })
      $scope.total = response.totalPages;
      console.log($scope.myMessageList);
    })
      .error(function (error) {
        // MyPopup.alert("에러", "서버접속불가");
      })
      .finally(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  }

  // 위로 당겼을 때 페이징 초기화 및 새로고침
  $scope.load = function () {
    $scope.count = 10;
    $scope.page = 0;
    $scope.total = 1;
    $scope.myMessageList = [];
    $scope.getMessageList();
  }

  // 페이지 로딩 시 데이터 불러오기
  $scope.load();

  // 쪽지 보내는 창
  $scope.messageOpen = function () {
    $scope.modal.show();
  }
  $ionicModal.fromTemplateUrl('views/message/sendMessage.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
})

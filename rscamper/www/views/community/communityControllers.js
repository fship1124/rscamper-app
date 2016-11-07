angular.module('App')
// 커뮤니티 탭 컨트롤러
  .controller("CommunityTabsCtrl", function ($rootScope, $scope) {
    console.log("커뮤니티탭");


  })

  // 커뮤니티 메인 리스트 컨트롤러
  .controller("CommunityMainCtrl", function ($rootScope, $scope, $http, $ionicModal, $ionicLoading, MyConfig) {

    // 게시판 리스트 페이징 변수
    $scope.page = 0;
    $scope.total = 1;
    $scope.boardList = [];

    // 게시판 리스트 불러오기
    $scope.getBoardList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });
      $http({
        url: MyConfig.backEndURL + "/community/select/board?page=" + $scope.page,
        method: "GET",
      }).success(function (response) {
        angular.forEach(response.board, function (board) {
          $scope.boardList.push(board);
        })
        $scope.total = response.totalPages;
      })
        .error(function (err) {
          $ionicLoading.show({
            template: '서버 접속 불가',
            duration: 2000
          });
        })
        .finally(function () {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    // 페이지 로딩 시 식당 첫 페이지 데이터 불러오기
    $scope.getBoardList();

    // 위로 당겼을 때 페이징 초기화 및 새로고침
    $scope.load = function () {
      $scope.page = 0;
      $scope.total = 1;
      $scope.boardList = [];
      $scope.getBoardList();
    }

    // 모달
    $ionicModal.fromTemplateUrl('community/writeFormModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function (categoryNo) {
      $scope.writeBoard = {
        categoryNo: categoryNo
      }
        // 카테고리 리스트 가져오기
      $http({
        url: MyConfig.backEndURL + "/community/select/category",
        method: "GET"
      })
        .success(function (response) {
          console.log(response);
          $scope.categories = response;
          $scope.modal.show();
        })
        .error(function (err) {
          console.log(err);
        })
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function () {
    });
    $scope.$on('modal.removed', function () {
    });

  })

  // 디테일 컨트롤러
  .controller("CommunityDetailCtrl", function ($rootScope, $scope) {

    // 뒤로가기 버튼 강제    활성화
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });


  })

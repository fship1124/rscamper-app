angular.module('App')
  // 전체
  .controller('MainTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location, $cordovaGeolocation, $ionicScrollDelegate) {
    $ionicPlatform.ready(function () {
      if(window.cordova && window.cordova.plugins.keyboard) {
        cordova.plugin.keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      $cordovaGeolocation.getCurrentPosition().then(function (data) {
        $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params : {latlng: data.coords.latitude + ',' + data.coords.longitude, sensor: true}})
          .success(function (response) {
            $scope.location = {
              lat : data.coords.latitude,
              long: data.coords.longitude,
              city: response.results[0].formatted_address,
              current: true
            };
            loadWeather();
          })
          .error(function () {
            alert("현재 위치를 몰라용");
          });
      })
    });

    // 날씨 불러오기
    function loadWeather() {
      $http({
        method: "GET",
        url: "http://apis.skplanetx.com/weather/current/minutely?version=1&lat=" + $scope.location.lat + "&lon=" + $scope.location.long,
       /* headers: {'appKey': '1358f380-3444-3adb-bcf0-fbb5a2dfd042'}*/
      })
        .success(function(data) {
          $scope.today = data.weather.minutely[0];
          $scope.cTem = parseFloat($scope.today.temperature.tc).toFixed(1);

          var locArr = $scope.location.city.split(" ");
          $scope.loc = locArr[1] + " " + locArr[2] + " " + locArr[3];
        })
        .error(function () {
          $scope.today = { sky: {code: "SKY_A00"} };
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete');
        })
      // 위로 당겼을 때 새로고침
      $scope.refreshMain = function () {
        $scope.count = 10;
        $scope.page = 0;
        $scope.total = 1;
        $scope.myMainList = [];
        $scope.myMainCommentList = [];
        $scope.getMainList();
        if ($rootScope.rootUser.userUid) {
          $scope.getMainCommentList();
        }
        loadWeather();
      }
    };

    // 댓글 불러오기
    $scope.getMainCommentList = function () {
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http.get("http://192.168.0.187:8081/app/main/commentList", {
        params :{
          userUid : $rootScope.rootUser.userUid
        }
      }).success(function (response) {
        angular.forEach(response, function (comment) {
          $scope.myMainCommentList.push(comment);
        });

        for (var i = 0; i < $scope.myMainCommentList.length; i++) {
          if ($scope.myMainCommentList[i].title.length >= 4) {
            $scope.myMainCommentList[i].title = $scope.myMainCommentList[i].title.substring(0, 3) + '...';
          }
        }
      })
        .finally(function () {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    // 슬라이드
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

    // 메인 리스트 불러오기
    $scope.getMainList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "main/list?page=" + $scope.page + "&count=" + $scope.count,
        url: "http://192.168.0.187:8081/app/main/list?page=" + $scope.page + "&count=" + $scope.count,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.mainList, function (main) {
          $scope.myMainList.push(main);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.myMainList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          if ($scope.myMainList[i].targetType == '1' || $scope.myMainList[i].picture == 0) {
            $scope.myMainList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
          }
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.myMainList = [];
      $scope.myMainCommentList = [];
      $scope.getMainList();
      if ($rootScope.rootUser.userUid) {
        $scope.getMainCommentList();
      }
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    $scope.moveDetail = function (no, targetType) {
      switch (targetType) {
        case '1':
          $location.path("/communityDetail/"+no);
          break;
        case '3':
          $location.path("/scheduleList/"+no);
          break;
      }
    }
  })
  // 베스트 여행기
  .controller('TourTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {
    // 베스트 여행기 리스트 불러오기
    $scope.getBoardList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "/mypage/select/bookMark?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        url: "http://192.168.0.187:8081/app/main/categoryBoardList?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.categoryBoardList, function (board) {
          $scope.mainBoardList.push(board);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.mainBoardList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          $scope.mainBoardList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.categoryNo = 2;
      $scope.mainBoardList = [];
      $scope.getBoardList();
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    // $scope.moveDetail = function (no) {
    //     $location.path("/communityDetail/"+no);
    // }
  })
  // 베스트 일정
  .controller('ScheduleTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {
    // 베스트 일정 리스트 불러오기
    $scope.getRecordList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "/mypage/select/bookMark?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        url: "http://192.168.0.187:8081/app/main/recordList?page=" + $scope.page + "&count=" + $scope.count,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.recordList, function (record) {
          $scope.mainRecordList.push(record);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.mainRecordList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          if ($scope.mainRecordList[i].picture == 0) {
            $scope.mainRecordList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
          }
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.mainRecordList = [];
      $scope.getRecordList();
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    // $scope.moveDetail = function (no) {
    //     $location.path("/communityDetail/"+no);
    // }
  })
  // 추천 루트
  .controller('RouteTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {

  })
  // 추천 정보
  .controller('InfoTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {
    // 추천 정보 리스트 불러오기
    $scope.getBoardList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "/mypage/select/bookMark?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        url: "http://192.168.0.187:8081/app/main/categoryBoardList?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.categoryBoardList, function (board) {
          $scope.mainBoardList.push(board);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.mainBoardList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          $scope.mainBoardList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.categoryNo = 3;
      $scope.mainBoardList = [];
      $scope.getBoardList();
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    // $scope.moveDetail = function (no) {
    //     $location.path("/communityDetail/"+no);
    // }
  })
  // 추천 리뷰
  .controller('ReviewTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {
    // 추천 리뷰 리스트 불러오기
    $scope.getBoardList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "/mypage/select/bookMark?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        url: "http://192.168.0.187:8081/app/main/categoryBoardList?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.categoryBoardList, function (board) {
          $scope.mainBoardList.push(board);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.mainBoardList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          $scope.mainBoardList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.categoryNo = 4;
      $scope.mainBoardList = [];
      $scope.getBoardList();
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    // $scope.moveDetail = function (no) {
    //     $location.path("/communityDetail/"+no);
    // }
  })
  // 자유게시판
  .controller('freeBoardTabCtrl', function ($rootScope, $scope, $stateParams, $http, $ionicPlatform, $ionicModal, $ionicLoading, MyConfig, MyPopup, $location) {
    // 자유게시판 리스트 불러오기
    $scope.getBoardList = function () {
      $scope.page++;
      $ionicLoading.show({
        template: '<strong class="balanced-900 bold balanced-100-bg"><div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></svg></div></strong>'
      });

      $http({
        // url: MyConfig.backEndURL + "/mypage/select/bookMark?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        url: "http://192.168.0.187:8081/app/main/categoryBoardList?page=" + $scope.page + "&count=" + $scope.count + "&categoryNo=" + $scope.categoryNo,
        method: "GET"
      }).success(function (response) {
        angular.forEach(response.categoryBoardList, function (board) {
          $scope.mainBoardList.push(board);
        })
        $scope.total = response.totalPages;

        for (var i = 0; i < $scope.mainBoardList.length; i++) {
          var rNum = Math.floor(Math.random() * 36) + 1;
          $scope.mainBoardList[i].coverImgUrl = 'img/example_img/example' + rNum + '.jpg';
        }
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
      $scope.count = 10;
      $scope.page = 0;
      $scope.total = 1;
      $scope.categoryNo = 1;
      $scope.mainBoardList = [];
      $scope.getBoardList();
    }

    // 페이지 로딩 시 데이터 불러오기
    $scope.load();

    // 상세페이지 이동
    // $scope.moveDetail = function (no) {
    //     $location.path("/communityDetail/"+no);
    // }
  });

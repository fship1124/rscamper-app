var app = angular.module('App', ['ionic', 'ionic-material', 'firebase', 'ngCordova', 'ngCordovaOauth','contenteditable', 'ngSanitize'])
    .run(function ($ionicPlatform, $firebaseAuth, $rootScope, Localstorage, DbService) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });

      // 로그인 로그아웃처리
      // rootUser : 로그인한 유저 정보(object)
      // userStatus : 로그인했는지 안했는지 판단(boolean)
      $firebaseAuth().$onAuthStateChanged(function (user) {
        // 로그인 상태
        if (user) {
          // 이메일 인증이 아닐경우 로그인시 회원정보 입력
          if (user.providerData[0].providerId != 'password') {
            DbService.insertUser(user, function () {
              DbService.selectUserByUid(user.uid, function (result) {
                $rootScope.rootUser = result;
              })
            });
            // 이메일 인증시 로그인
          } else {
            DbService.selectUserByUid(user.uid, function (result) {
              $rootScope.rootUser = result;
            });
          }
          $rootScope.userStatus = true;
        } else { // 로그아웃 상태
          $rootScope.userStatus = false;
          $rootScope.rootUser = "";
        }
      })
    })

    .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider
      // 메인
        .state('main', {
          url: '/main',
          abstract: true,
          templateUrl: 'views/main/mainTabs.html',
          controller: 'MainCtrl'
        })
        .state('main.main', {
          url: '/main',
          views: {
            'main-tab': {
              templateUrl: 'views/main/mainTab.html',
              controller: 'MainTabCtrl'
            }
          }
        })
        .state('main.tour', {
          url: '/tour',
          views: {
            'tour-tab': {
              templateUrl: 'views/main/tourTab.html'
            }
          }
        })
        .state('main.post', {
          url: '/post',
          views: {
            'post-tab': {
              templateUrl: 'views/main/postTab.html'
            }
          }
        })
        .state('tourInfo', {
          cache: false,
          url: '/tourInfo',
          templateUrl: 'views/tour/tourInfo.html',
          controller: 'TourInfoCtrl'
        })
        .state('tourDetail', {
          url: '/tourInfo/:contentid',
          templateUrl: 'views/tour/tourDetail.html',
          controller: 'TourDetailCtrl'
        })




        .state('scheduleTab', {
          cache: false,
          url: '/schedule',
          templateUrl: 'views/schedule/scheduleTabs.html'
        })
        .state('scheduleTab.schedule', {
          url: '/schedule',
          views: {
            's-tab': {
              templateUrl: 'views/schedule/schedule.html',
              controller: 'ScheduleCtrl'
            }
          }
        })
        .state('detailTab', {
          cache: false,
          url: '/detailSchedule',
          templateUrl: 'views/schedule/detailTabs.html'
        })
        .state('detailTab.detailSchedule', {
          cache : false,
          url: '/detail/:no',
          views: {
            'detailSchedule-tab': {
              templateUrl: 'views/schedule/scheduleDetail.html',
              controller: 'dScheduleCtrl'
            }
          }
        })
        .state('detailTab.locationInfo', {
          cache: false,
          url: '/location/:no/:locationNo',
          views : {
            'detailSchedule-tab' : {
              templateUrl: 'views/schedule/detailLocationInfo.html',
              controller: 'detailLocationInfoCtrl'
            }
          }
        })
        .state('detailTab.scheduleMap', {
          cache: false,
          url: '/scheduleMap/:no',
          views : {
            'scheduleMap-tab' : {
              templateUrl: 'views/schedule/scheduleMap.html',
              controller : 'scheduleMapCtrl'
            }
          }
        })
        .state('detailTab.mapLocationInfo', {
          cache: false,
          url: '/mapLocation/:no/:locationNo',
          views : {
            'scheduleMap-tab' : {
              templateUrl: 'views/schedule/detailLocationInfo.html',
              controller: 'detailLocationInfoCtrl'
            }
          }
        })
        .state('findAttraction', {
          cache: false,
          url: '/findAttraction/:departureDate/:arriveDate/:recordNo',
          templateUrl: 'views/schedule/findAttraction.html',
          controller: 'findAttractionCtrl'
        })
        .state('chat', {
          cache : false,
          url : '/chat',
          templateUrl : '/views/chat/chatMain.html',
          controller : 'chatMainCtrl'
        })
        .state('view', {
          chche : false,
          url : '/chat/:no',
          templateUrl : '/views/chat/chatView.html',
          controller : 'chatViewCtrl'
        })

        /**
         * 로그인 관련 메뉴
         */
        // 로그인 메인 화면
        .state('login', {
          url: '/login',
          templateUrl: 'views/login/loginMain.html',
          controller: 'LoginMainCtrl'
        })
        // 로그인화면
        .state('signin', {
          url: '/signin',
          templateUrl: 'views/login/signin.html',
          controller: 'SigninCtrl'
        })
        // 회원가입화면
        .state('signup', {
          url: '/signup',
          templateUrl: 'views/login/signup.html',
          controller: 'SignupCtrl'
        })
        // 비밀번호 재설정 화면
        .state('resetPassword', {
          url: '/resetPassword',
          templateUrl: 'views/login/resetPassword.html',
          controller: 'ResetPasswordCtrl'
        })

        /**
         *  셋팅 메뉴
         */
        // 셋팅 - 메인
        .state('setting', {
          url: '/setting',
          templateUrl: 'views/setting/settingMain.html',
          controller: 'SettingMainCtrl'
        })
        // 셋팅 - 프로필
        .state('profile', {
          url: '/profile',
          templateUrl: 'views/setting/profile.html',
          controller: 'ProfileCtrl'
        })

        /**
         *  커뮤니티 메뉴
         */
        // 커뮤니티 - 탭
        .state('community', {
          url: '/community',
          abstract: true,
          templateUrl: 'views/community/communityTabs.html',
          controller: 'CommunityTabsCtrl'
        })
        // 커뮤니티 - 메인
        .state('community.main', {
          url: '/main',
          views: {
            'community-main-tab': {
              templateUrl: 'views/community/main.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 자유
        .state('community.free', {
          url: '/free/:categoryNo',
          views: {
            'community-free-tab': {
              templateUrl: 'views/community/free.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 여행기
        .state('community.tourDiary', {
          url: '/tourDiary/:categoryNo',
          views: {
            'community-tourDiary-tab': {
              templateUrl: 'views/community/tourDiary.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 정보
        .state('community.information', {
          url: '/information/:categoryNo',
          views: {
            'community-information-tab': {
              templateUrl: 'views/community/information.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 리뷰
        .state('community.review', {
          url: '/review/:categoryNo',
          views: {
            'community-review-tab': {
              templateUrl: 'views/community/review.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 질문
        .state('community.qna', {
          url: '/qna/:categoryNo',
          views: {
            'community-qna-tab': {
              templateUrl: 'views/community/qna.html',
              controller: 'CommunityMainCtrl'
            }
          }
        })
        // 커뮤니티 - 디테일
        .state('communityDetail', {
          url: '/communityDetail/:boardNo',
          templateUrl: 'views/community/detail.html',
          controller: 'CommunityDetailCtrl'
        })

        /**
         *  마이페이지 메뉴
         */
        // 마이페이지 - 메인
        .state('myPage', {
          url: '/myPage',
          templateUrl: 'views/myPage/myPageMain.html',
          controller: 'MyPageMainCtrl'
        })
      ;

      // 기초 페이지
      $urlRouterProvider.otherwise('/main/main');
    })

    .controller('MenuCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, AuthService) {
      $scope.updateProfilePhoto = AuthService.updateProfilePhoto;
      $scope.updateBgPhoto = AuthService.updateBgPhoto;
    })

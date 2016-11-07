var app = angular.module('App', ['ionic', 'ionic-material', 'firebase', 'ngCordova', 'ngCordovaOauth'])
    .run(function ($ionicPlatform, $firebaseAuth, $rootScope, Localstorage, DbService, MyPopup) {
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
          controller : 'MainCtrl'
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
          url: '/tourInfo',
          templateUrl: 'views/tour/tourInfo.html',
          controller: 'TourInfoCtrl'
        })
        .state('tourInfo.tourDetail', {
          url: '/tourDetail',
          templateUrl: 'views/tour/tourDetail.html',
          controller: 'TourDetailCtrl'
        })

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


        .state('scheduleTab',{
        cache : false,
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
          cache : false,
          url: '/detailSchedule',
          templateUrl: 'views/schedule/detailTabs.html'
        })
        .state('detailTab.detailSchedule',{
          url: '/:no',
          views: {
            'detailSchedule-tab': {
              templateUrl: 'views/schedule/scheduleDetail.html',
              controller : 'dScheduleCtrl'
            }
          }
        })
        .state('findAttraction',{
          cache : false,
          url: '/findAttraction/:week',
          templateUrl: 'views/schedule/findAttraction.html',
          controller : 'findAttractionCtrl'
        })
      ;

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/main/main');

    })

    .controller('MenuCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location, AuthService, $ionicActionSheet) {

      $scope.updateProfilePhoto = AuthService.updateProfilePhoto;
      $scope.updateBgPhoto = AuthService.updateBgPhoto;

      // Form data for the login modal
      $scope.loginData = {};
      var navIcons = document.getElementsByClassName('ion-navicon');
      for (var i = 0; i < navIcons.length; i++) {
        navIcons[i].addEventListener('click', function () {
          this.classList.toggle('active');
        });
      }
      // .fromTemplate() method
      var template = '<ion-popover-view>' +
        '   <ion-header-bar>' +
        '       <h1 class="title">My Popover Title</h1>' +
        '   </ion-header-bar>' +
        '   <ion-content class="padding">' +
        '       My Popover Contents' +
        '   </ion-content>' +
        '</ion-popover-view>';

      $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
      });
      $scope.closePopover = function () {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.popover.remove();
      });
    })
  ;

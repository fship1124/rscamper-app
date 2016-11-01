// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('App', ['ionic', 'ionic-material', 'firebase', 'ngCordova', 'ngCordovaOauth'])

.run(function($ionicPlatform, $firebaseAuth, $rootScope, Localstorage, DbService, MyPopup) {
  $ionicPlatform.ready(function() {
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
  $firebaseAuth().$onAuthStateChanged(function (user) {

      // 로그인 상태
      if (user) {
        // 이메일 인증이 아닐경우 로그인시 회원정보 입력
        if (user.providerData[0].providerId != 'password') {
          DbService.insertUser(user, function () {
            DbService.selectUserByUid(user.uid, function (result) {
              $rootScope.rootUser = result;
              console.log($rootScope.rootUser);
            })
          });
          // 이메일 인증시 로그인
        } else {
          DbService.selectUserByUid(user.uid, function (result) {
            $rootScope.userStatus = true;
            $rootScope.rootUser = result;
          });
        }
      } else { // 로그아웃 상태
        $rootScope.userStatus = false;
        $rootScope.rootUser ="";
      }
  })
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu/menu.html',
    controller: 'MenuCtrl'
    })
    .state('app.main', {
      url: '/main',
      views: {
        'menuContent': {
          templateUrl: 'views/main/mainTabs.html'
        }
      }
    })
    .state('app.tourInfo', {
      url: '/tourInfo',
      views: {
        'menuContent': {
          templateUrl: 'views/tour/tourInfo.html',
          controller: 'TourInfoCtrl'
        }
      }
    })
    .state('app.main.main', {
      url: '/main',
      views: {
        'main-tab': {
          templateUrl: 'views/main/mainTab.html',
          controller: 'MainTabCtrl'
        }
      }
    })
    .state('app.main.tour', {
      url: '/tour',
      views: {
        'tour-tab': {
          templateUrl: 'views/main/tourTab.html'
        }
      }
    })
    .state('app.main.post', {
      url: '/post',
      views: {
        'post-tab': {
          templateUrl: 'views/main/postTab.html'
        }
      }
    })
    // 로그인 메인 화면
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'views/login/loginMain.html',
          controller: 'LoginMainController'
        }
      }
    })
    // 로그인화면
    .state('app.signin', {
      url: '/signin',
      views: {
        'menuContent': {
          controller: 'SigninController',
          templateUrl: 'views/login/signin.html'
        }
      }
    })
    // 회원가입화면
    .state('app.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          controller: 'SignupController',
          templateUrl: 'views/login/signup.html'
        }
      }
    })
    // 비밀번호 재설정 화면
    .state('app.resetPassword', {
      url: '/resetPassword',
      views: {
        'menuContent': {
          controller: 'ResetPasswordController',
          templateUrl: 'views/login/resetPassword.html'
        }
      }
    })
    // 프로필 화면
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          controller: 'ProfileController',
          templateUrl: 'views/login/profile.html'
        }
      }
    })


  /*// setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main/main');

});

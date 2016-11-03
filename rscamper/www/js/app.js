// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'ionic-material', 'ngCordova'])

.run(function($ionicPlatform) {
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
      cache : false,
      url: '/main',
      views: {
        'menuContent': {
          templateUrl: 'views/main/mainTabs.html',
          controller : 'MainCtrl'
        }
      }
    })
    .state('app.tourInfo', {
      cache : false,
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
          templateUrl: 'views/main/postTab.html',

        }
      }
    })
    .state('app.scheduleTab',{
      cache : false,
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'views/schedule/scheduleTabs.html',
          controller : 'ScheduleTabsCtrl'
        }
      }
    })
    .state('app.scheduleTab.schedule', {
      url: '/schedule',
      views: {
        's-tab': {
          templateUrl: 'views/schedule/schedule.html',
          controller : 'ScheduleCtrl'
        }
      }
    })
    .state('app.detailTab', {
      cache : false,
      url: '/detailSchedule',
      views: {
        'menuContent': {
          templateUrl: 'views/schedule/detailTabs.html'
        }
      }
    })
    .state('app.detailTab.detailSchedule',{
      url: '/:no',
      views: {
        'detailSchedule-tab': {
          templateUrl: 'views/schedule/scheduleDetail.html',
          controller : 'dScheduleCtrl'
        }
      }
    });

 /* $stateProvider
    .state('asdd', {
      url: '/asdd',
      abstract: true,
      templateUrl: 'views/menu/menu.html',
      controller: 'MenuCtrl'
    })
    .state('asdd.schedule', {
      url: '/schedule',
      views: {
        'scheduleContent': {
          templateUrl: 'views/schedule/scheduleTabs.html'
        }
      }
    })
    .state('asdd.schedule.main', {
    url: '/schedule',
    views: {
      's-tab': {
        templateUrl: 'views/schedule/schedule.html',
        controller : 'ScheduleCtrl'
      }
    }
  });*/




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

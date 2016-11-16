angular.module('App')
.controller('MainTabCtrl', function ($scope, $http, $ionicPlatform, $cordovaGeolocation, $ionicScrollDelegate) {
  $ionicPlatform.ready(function () {
    if(window.cordova && window.cordova.plugins.keyboard) {
      cordova.plugin.keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $cordovaGeolocation.getCurrentPosition().then(function (data) {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params : {latlng: data.coords.latitude + ',' + data.coords.longitude}})
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
      // headers: {'appKey': '1358f380-3444-3adb-bcf0-fbb5a2dfd042'}
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
    $scope.load = function () {
      loadWeather();
      // TODO: db 불러오는 것도 추가해야함
    }
  };

  // 슬라이드
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  // 글
  $scope.photos = [];
  for (var i = 0; i < 100; i++) {
    $scope.photos.push({id: i, src:'http://lorempixel.com/250/250?q='+(i%17)});
  };
})

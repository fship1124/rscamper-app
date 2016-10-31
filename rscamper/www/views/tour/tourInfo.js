angular.module('App')
  .controller('TourInfoCtrl', function ($scope, $http, $ionicLoading, $compile, $ionicPlatform, $cordovaGeolocation) {
 /*   $scope.page = 0;
    $scope.total = 1;
    $scope.list = [];*/

/*  자바에서 처리해오기!!!
    $scope.getLists = function () {
      $scope.page++;
      $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=HRlAZzd7iekNBDr5eoT7xWwW4fxYqG5AGno4ZLeeWM0tAQOoiv7xFkIGS1W6%2FhsMwfDQPJ1A0qd2o2dHTayVXA%3D%3D&contentTypeId=12&areaCode=38&sigunguCode=11&cat1=A01&cat2=&cat3=&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=12&pageNo=' + $scope.page)
        .success(function (response) {
         // angular.forEach(response.)
        })
    }*/
    $scope.location = {
      lat: 0,
      lang: 0,
      city: "",
      current: true
    }

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
              lang: data.coords.longitude,
              city: response.results[0].formatted_address,
              current: true
            };
            initialize();
            console.log("a");
          });
      })
    });

    function initialize() {
      var myLatlng = new google.maps.LatLng($scope.location.lat, $scope.location.lang);
      console.log("b");
      var mapOptions = {
        center: myLatlng,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Marker + infowindow + angularjs compiled ng-click
      var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
      var compiled = $compile(contentString)($scope);

      var infowindow = new google.maps.InfoWindow({
        content: compiled[0]
      });

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

      $scope.map = map;
    }
    /*google.maps.event.addDomListener(window, 'load', initialize);*/

    $scope.centerOnMe = function() {
      if(!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function(pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    $scope.clickTest = function() {
      alert('Example of infowindow with ng-click')
    };

  })

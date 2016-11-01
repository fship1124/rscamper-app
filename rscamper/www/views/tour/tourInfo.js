angular.module('App')
  .controller('TourInfoCtrl', function ($scope, $http, $ionicLoading, $compile, $ionicPlatform, $cordovaGeolocation) {
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

/*            // 경주역
            $scope.location.lat = 35.8444002;
            $scope.location.lang = 129.2157566;*/
            // 제주도
            $scope.location.lat = 33.5564922;
            $scope.location.lang = 126.7905824;

            initialize();

            $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
              {params : {
                contentTypeId : 12,
                mapX : $scope.location.lang,
                mapY : $scope.location.lat,
                radius : 2000,
                listYN :'Y',
                MobileOS : 'ETC',
                MobileApp : "TourAPI3.0_Guide",
                arrange : 'A',
                numOfRows :  12,
                pageNo : '1'
              }}
            )
              .success(function (data) {
                var result = data.response.body.items.item;
                drop(result, $scope.map);
              })
          })
          .error(function () {
            alert("현재 위치를 몰라용");
          });
      })
    });

    var map = null;

    // 처음 맵 만드는 함수
    function initialize() {
      var myLatlng = new google.maps.LatLng($scope.location.lat, $scope.location.lang);
      var mapOptions = {
        center: myLatlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true
      });

      $scope.map = map;
    }

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

    function addMarkerWithTimeout(result, timeout, map) {
      var myLatlng = new google.maps.LatLng(result.mapy, result.mapx);

      var image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
      };

      window.setTimeout(function () {
        var marker = new google.maps.Marker({
          position: myLatlng,
          icon: image,
          animation: google.maps.Animation.DROP
        });

        var distance = computeDistance($scope.location.lang, $scope.location.lat, result.mapx, result.mapy);

        var contentString = '<div id="content"><p>' + result.title + '</p><span>나와의 거리 : ' + distance.toFixed(2) + 'km</span></div>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });

        marker.setMap(map);
      }, timeout);
    }

    function drop(result, map) {
      for (var i = 0; i < result.length; i++) {
        addMarkerWithTimeout(result[i], i * 200, map);
      }
    }

    // 출발지와 목적지 사이의 거리(km)
    function computeDistance(startx, starty, destx, desty) {
      var startLatRads = degreesToRadians(startx);
      var startLongRads = degreesToRadians(starty);
      var destLatRads = degreesToRadians(destx);
      var destLongRads = degreesToRadians(desty);

      var earthRadius = 6371;
      var distance = Math.acos(
          Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)) * earthRadius;
      return distance;
    }

    function degreesToRadians(degrees) {
      var radians = (degrees * Math.PI) / 180;
      return radians;
    }
  });














/*  // 마커 만드는 함수
  function makeMarker(map, result) {
    var myLatlng = new google.maps.LatLng(result.mapy, result.mapx);
    /!*    var myIcon = {
/!*      path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',*!/
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: 'red',
      fillOpacity: 0.4,
      scale: 6,
      strokeColor: 'grey',
      strokeWeight: 1
    };*!/
    var image = {
/!*      url: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png',*!/
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      size: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0, 0),
/!*      anchor: new google.maps.Point(17, 34)*!/
      anchor: new google.maps.Point(0, 32)
/!*      scaledSize: new google.maps.Size(25, 25)*!/
    };

    var marker = new google.maps.Marker({
      position: myLatlng,
      icon: image,
      animation: google.maps.Animation.DROP
    });

    var contentString = '<div id="content"><span>' + result.title + '</span></div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }*/

/**
 * Created by Bitcamp on 2016-11-04.
 */
angular.module('App')
.controller('findAttractionCtrl',function ($scope, $rootScope, $stateParams, $http, $cordovaGeolocation, $ionicPlatform, $ionicPopover, $ionicModal, $ionicScrollDelegate) {
  $scope.mama = function () {
    $scope.qaz = 1;
    console.log($scope.qaz);
  }
  $scope.showSearchBox = false;
  $scope.userSearch = {
    place : ""
  };
  $scope.location = {
    lat : 0,
    lang: 0,
    city: "",
    current: true
  };

  $scope.getPlaceInfo = function (lang, lat) {
    $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
      {params : {
        contentTypeId : "",
        mapX : lang,
        mapY : lat,
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
        $scope.getPlaces = data.response.body.items.item;
        console.log(data.response.body.items.item);
      })
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
            $scope.getPlaceInfo(data.coords.longitude,data.coords.latitude);
          });
      })
    })
  $scope.qqwe = function () {
    $scope.showSearchBox = !$scope.showSearchBox;
  }
  $scope.searchLocation = function () {
    console.log($scope.userSearch.place);
    $http.get('https://maps.googleapis.com/maps/api/geocode/json', {params: {address: $scope.userSearch.place}}).success(function (response) {
      $scope.results = response.results;
      console.log(response.results[0].geometry.location);
      $scope.getPlaceInfo(response.results[0].geometry.location.lng,response.results[0].geometry.location.lat);
      $scope.qaz = 2;
      console.log($scope.qaz);
    });
  }
  $scope.qqwe = function () {
    $scope.showSearchBox = !$scope.showSearchBox;
  }

  $scope.showImages = function (index) {
    $scope.activeSlide = index;
    $scope.showModal('views/schedule/addLocationInfo.html');
  };

  $scope.showModal = function (templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
    $scope.modal.remove();
  };
  $scope.qweqwe = function ($event) {
    $event.stopPropagation();
  }

})

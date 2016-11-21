/**
 * Created by Bitcamp on 2016-11-08.
 */
angular.module('App')
  .controller('detailLocationInfoCtrl',function ($scope, $rootScope, $stateParams, $http, $cordovaGeolocation, $ionicPlatform, $ionicPopover, $ionicModal, $ionicScrollDelegate, pickerView, $location, detailLocationInfo) {
    $scope.detailInfo = detailLocationInfo.getLocationInfo($stateParams.locationNo);
    $scope.locationMap = {};
    $scope.likeCount = 0;
    $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailImage?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
      {params : {
        contentTypeId : $scope.detailInfo.contentTypeId,
        MobileOS : 'ETC',
        MobileApp : 'AppTest',
        contentId : $scope.detailInfo.contentCode,
        imageYN : 'Y'
    }})
      .success(function (data) {
        $scope.images = data.response.body.items.item;
        $scope.isPhoto = true;
        if (!$scope.images) {
          $scope.isPhoto = false;
        }
        $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
          {params : {
            contentTypeId : $scope.detailInfo.contentTypeId,
            contentId : $scope.detailInfo.contentCode,
            MobileOS : 'ETC',
            MobileApp : 'AppTest',
            defaultYN : 'Y',
            firstImageYN : 'Y',
            areacodeYN : 'Y',
            catcodeYN : 'Y',
            addrinfoYN : 'Y',
            mapinfoYN : 'Y',
            overviewYN : 'Y',
            transGuideYN : 'Y'
          }})
          .success(function (data) {
            $scope.locationMap = data.response.body.items.item;
            console.log($scope.locationMap);
            initialize();
          })
      });
    $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/checkedIsLike",
      {params : {
        no : $scope.detailInfo.contentCode,
        uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1"
      }})
      .success(function (data) {
        $scope.isLiked = false;
        if (data == true) {
          $scope.isLiked = true;
        }
      });
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.keyboard) {
        cordova.plugin.keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    })
    var map = null;

    // 처음 맵 만드는 함수
    function initialize() {
      var myLatlng = new google.maps.LatLng($scope.locationMap.mapy, $scope.locationMap.mapx);
      var mapOptions = {
        center: myLatlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(document.getElementById("scheduleMap"), mapOptions);

      new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true
      });

      $scope.map = map;
    }

    $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/locationLikeCount",
      {params : {
        no : $scope.detailInfo.contentCode
      }})
      .success(function (data) {
        $scope.likeCount = data;
      })

    $scope.likePlus = function (code) {
      $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/insertLikePlus",
        {params : {
          no : code,
          uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1"
        }})
        .success(function (data) {
          $scope.isLiked = true;
          $scope.likeCount = data;
        })
    }

    $scope.removeLiked = function (code) {
      $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/removeLiked",
        {params : {
          no : code,
          uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1"
        }})
        .success(function (data) {
          $scope.isLiked = false;
          $scope.likeCount = data;
        })
    }
  })

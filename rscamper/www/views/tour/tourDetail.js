angular.module('App')
  .controller('TourDetailCtrl', function ($scope, $stateParams, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailImage?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
      {params : {
        contentId : $stateParams.contentid,
        MobileOS : 'ETC',
        MobileApp : "AppTesting"
      }}
    )
      .success(function (data) {
        $scope.zoomMin = 1;
        $scope.imageList = data.response.body.items.item;
        $scope.isPhoto = true;
        if(!$scope.imageList) {
          $scope.isPhoto = false;
        }
        console.log("imageList", $scope.imageList);
      });

    $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailInfo?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
      {params : {
        contentId : $stateParams.contentid,
        contentTypeId : 12,
        MobileOS : 'ETC',
        MobileApp : "AppTesting"
      }}
    )
      .success(function (data) {
        var itemList = data.response.body.items.item;
        for (var i = 0; i < itemList.length; i++) {
          var item = itemList[i];
          item.infoname = item.infoname.replace(/ /gi, "");
          console.log(item);
          if (item.infoname == '입장료' || item.infoname == '관람료' || item.infoname == '시설이용료') {
            $scope.admissionFee = item.infotext;
          };
        };
        console.log("infoList", itemList);
        console.log($scope.admissionFee);
        if ($scope.admissionFee) {
          document.querySelector("#info-div").innerHTML = $scope.admissionFee;
        } else {
          document.querySelector("#info-div").innerHTML = "정보가 없습니다.";
        }
      });

    $scope.showImages = function (index) {
      $scope.activeSlide = index;
      $scope.showModal('templates/gallery-zoomview.html');
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

    $scope.updateSlideStatus = function (slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };
  });

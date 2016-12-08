/**
 * Created by Bitcamp on 2016-11-08.
 */
angular.module('App')
  .controller('detailLocationInfoCtrl',function ($scope, $rootScope, $stateParams, $http, $cordovaGeolocation, $ionicPlatform, $ionicPopover, $ionicModal, $ionicScrollDelegate, pickerView, $location, detailLocationInfo) {
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
    /*$scope.detailInfo = detailLocationInfo.getLocationInfo($stateParams.locationNo);*/
    $scope.moreText = true;
    $scope.locationMap = {};
    $scope.likeCount = 0;
    console.log("정보 : ",$stateParams.locationNo);
    $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&transGuideYN=Y',{
      params : {
        contentId : $stateParams.locationNo
      }
    })
      .success(function (data) {
        $scope.detailInfo = data.response.body.items.item;
        console.log($scope.detailInfo);
        $http.get($rootScope.url + "8081/app/tourschedule/checkLocationLikeCnt", {
          params : {
            contentId : $stateParams.locationNo
          }
        })
          .success(function (result) {
            $scope.locationCnt = result;
          });

        $http.get($rootScope.url + "8081/app/tourschedule/getLocationMemo",{
          params : {
            contentId : $stateParams.locationNo
          }
        })
          .success(function (memo) {
            $scope.myPostList = memo;
            console.log("정보???",memo);
          })

        $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailImage?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
          {params : {
            contentTypeId : $scope.detailInfo.contenttypeid,
            MobileOS : 'ETC',
            MobileApp : 'AppTest',
            contentId : $scope.detailInfo.contentid,
            imageYN : 'Y'
          }})
          .success(function (data) {
            $scope.imageList = data.response.body.items.item;
            console.log("이미지",$scope.imageList);
            $scope.isPhoto = true;
            if (!$scope.imageList) {
              $scope.isPhoto = false;
            }
            $http.get('http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=3DmpkuLpruIBYk6zhr6YKNveBk7HgaAuFRZy54iH5nxxt23BRbs8yzfCdsp%2BYhTxwez01fmdHXwXiPP1WTMGag%3D%3D',
              {params : {
                contentTypeId : $scope.detailInfo.contenttypeid,
                contentId : $scope.detailInfo.contentid,
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
        $http.get($rootScope.url + "8081/app/tourschedule/checkedIsLike",
          {params : {
            contentId : $scope.detailInfo.contentid,
            uid : $rootScope.rootUser.userUid
          }})
          .success(function (data) {
            $scope.isLiked = data.isLike;
            $scope.isBack = data.isBack;
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

        $http.get($rootScope.url + "8081/app/tourschedule/locationLikeCount",
          {params : {
            no : $scope.detailInfo.contentid
          }})
          .success(function (data) {
            $scope.likeCount = data;
          })

        $scope.likePlus = function (code) {
          $http.get($rootScope.url + "8081/app/tourschedule/insertLikePlus",
            {params : {
              no : code,
              uid : $rootScope.rootUser.userUid
            }})
            .success(function (data) {
              $scope.isLiked = false;
              $scope.locationCnt.likeCnt = data;
            })
        }

        $scope.backLikePlus = function (code) {
          $http.get($rootScope.url + "8081/app/tourschedule/addBackLocationLike",
            {params : {
              contentId : code,
              uid : $rootScope.rootUser.userUid
            }})
            .success(function (data) {
              $scope.isBack = false;
              $scope.locationCnt.backLocationCnt = data;
            })
        }


        $scope.removeLiked = function (code) {
          $http.get($rootScope.url + "8081/app/tourschedule/removeLiked",
            {params : {
              no : code,
              uid : $rootScope.rootUser.userUid
            }})
            .success(function (data) {
              $scope.isLiked = true;
              $scope.locationCnt.likeCnt = data;
            })
        }

        $scope.removeBackLiked = function (code) {
          $http.get($rootScope.url + "8081/app/tourschedule/delBackLocationLike",
            {params : {
              contentId : code,
              uid : $rootScope.rootUser.userUid
            }})
            .success(function (data) {
              $scope.isBack = true;
              $scope.locationCnt.backLocationCnt = data;
            })
        }

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


        $scope.moveMemoDetail = function (no) {
          $location.path("/postDetail/"+no);
        }

        $scope.recommedComment = function ($event, commentNo) {
          $event.stopPropagation();
          $http.get($rootScope.url + '8081/app/tourschedule/addScheduleMemoLike', {
            params : {
              scheduleMemoNo : commentNo,
              userUid : $rootScope.rootUser.userUid
            }
          })
            .success(function (data) {
              console.log("추천수 : ", data);
              for (var i = 0; i < $scope.myPostList.length; i++) {
                if ($scope.myPostList[i].scheduleMemoNo == commentNo) {
                  $scope.myPostList[i].likeCnt = data;
                  $scope.myPostList[i].isLike = 1;
                }
              }
            })
        }

        $scope.cancelCommentLike = function ($event, commentNo) {
          $event.stopPropagation();
          $http.get($rootScope.url + '8081/app/tourschedule/cancelScheduleMemoLike', {
            params: {
              scheduleMemoNo: commentNo,
              userUid: $rootScope.rootUser.userUid
            }
          })
            .success(function (data) {
              for (var i = 0; i < $scope.myPostList.length; i++) {
                if ($scope.myPostList[i].scheduleMemoNo == commentNo) {
                  $scope.myPostList[i].likeCnt = data;
                  $scope.myPostList[i].isLike = 0;
                }
              }
            })

        }

        $scope.moreDetail = function () {
          $("#location-info").removeClass("detailLocation-moreText");
          $scope.moreText = false;
        }

        $scope.closeDetail = function () {
          $("#location-info").addClass("detailLocation-moreText");
          $scope.moreText = true;
        }


        // 댓글
        $ionicModal.fromTemplateUrl('views/schedule/locationComment.html', {
          scope: $scope
        }).then(function(modal) {
          $scope.commentModal = modal;
        });

        $scope.commentOpen = function () {
          $scope.commentModal.show();
        }

        $scope.resize = function () {
          var obj = document.getElementById('inputText');
          obj.style.height = "1px";
          obj.style.height = (5+obj.scrollHeight) + "px";
          $("#footerBar").css("height",(19+obj.scrollHeight) + "px");
        }

        $http.get($rootScope.url + '8081/app/tourschedule/getLocationComment', {
          params : {
            contentId : $stateParams.locationNo
          }
        })
          .success(function (result) {
            $scope.commentList = result;
            console.log(result);
          });

        $scope.insertComment = function (data) {
          $http({
            url: $rootScope.url + '8081/app/tourschedule/addLocationComment',
            method: 'POST',
            data: $.param({
              userUid : $rootScope.rootUser.userUid,
              content : data,
              contentId : $stateParams.locationNo
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
          })
            .success(function (result) {
              console.log(result);
              $scope.commentList = result;
              $("#inputText").val("");
            });
        }
      });
  })

/**
 * Created by 이성주 on 2016-12-01.
 */
angular.module('App')
.controller('scheduleListDetailCtrl', function ($rootScope, $scope, $stateParams, $http, scheduleListDetail, $ionicModal, tourSchedulePopup) {
 /* $scope.scheduleListDetail = scheduleListDetail.getScheduleListDetail($stateParams.recordNo);*/
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });

  $scope.msgContent = "";
  $http.get($rootScope.url + '8081/app/tourschedule/scheduleListDetail', {
    params : {
      no : $stateParams.recordNo
    }
  })
    .success(function (data) {
      $scope.scheduleListDetail = data;

      console.log($scope.scheduleListDetail);


      $rootScope.getScheduleLocation = {};
      $http.get($rootScope.url + '8081/app/tourschedule/getScheduleLocation',
        {params : {
          no : $stateParams.recordNo
        }})
        .success(function (data) {
          $rootScope.getScheduleLocation = data;
          for (var i = 0; i < $rootScope.getScheduleLocation.length; i++) {
            $rootScope.getScheduleLocation[i].isScheduleDetail = true;
          }
          console.log($rootScope.getScheduleLocation);
        })

      $http.get($rootScope.url + '8081/app/tourschedule/getTourDate',
        {params : {
          dDate : $scope.scheduleListDetail.departureDate,
          aDate : $scope.scheduleListDetail.arriveDate
        }})
        .success(function (result) {
          $scope.period = result;
          console.log("기간 : " + result);
        });

      $http.get($rootScope.url + '8081/app/tourschedule/checkScheduleSet', {
        params : {
          userUid : $rootScope.rootUser.userUid,
          recordNo : $scope.scheduleListDetail.recordNo,
          targetType : 3
        }
      })
        .success(function (data) {
          /*$scope.isLiked = data;*/
          console.log(data);
          $scope.isLiked = data.scheduleLike;
          $scope.isCustomizing = data.customizing;
          $scope.isBookMark = data.bookMark;
        });

      $scope.recommendSchedule = function () {
        $http.get($rootScope.url + '8081/app/tourschedule/addScheduleLike', {
          params : {
            userUid : $rootScope.rootUser.userUid,
            recordNo : $scope.scheduleListDetail.recordNo
          }
        })
          .success(function (result) {
            console.log("추천수 : " , result);
            $scope.isLiked = false;
          });
      }
      $scope.cancelRecommend = function () {
        $http.get($rootScope.url + '8081/app/tourschedule/cancelScheduleLike', {
          params : {
            userUid : $rootScope.rootUser.userUid,
            recordNo : $scope.scheduleListDetail.recordNo
          }
        })
          .success(function (result) {
            console.log("추천수 : " , result);
            $scope.isLiked = true;
          });
      }
      $scope.customizing = function () {
        $http({
          url: $rootScope.url + '8081/app/tourschedule/addCustomizing',
          method: 'POST',
          data: $.param({
            recordNo : $scope.scheduleListDetail.recordNo,
            budGet : $scope.scheduleListDetail.budGet,
            period : $scope.scheduleListDetail.period,
            strapline : $scope.scheduleListDetail.strapline,
            title : $scope.scheduleListDetail.title,
            arriveDate : new Date($scope.scheduleListDetail.arriveDate),
            departureDate : new Date($scope.scheduleListDetail.departureDate),
            isOpen : 2,
            userUid : $rootScope.rootUser.userUid
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        })
          .success(function (result) {
            console.log("등록 후 : ", result);
            $scope.customizingCnt = result;
            $scope.isCustomizing = false;
          })
      }

      $scope.cancelCustomizing = function () {
        $http.get($rootScope.url + '8081/app/tourschedule/cancelCustomizing', {
          params : {
            recordNo : $scope.scheduleListDetail.recordNo,
            userUid : $rootScope.rootUser.userUid
          }
        })
          .success(function (result) {
            console.log("취소 후 : ", result);
            $scope.isCustomizing = true;
          })
      }

      $scope.addBookmark = function () {
        $http.get($rootScope.url + '8081/app/tourschedule/addScheduleBookmark',{
          params : {
            targetNo : $scope.scheduleListDetail.recordNo,
            targetType : 3,
            userUid : $rootScope.rootUser.userUid
          }
        })
          .success(function (result) {
            $scope.isBookMark = false;
          })
      }

      $scope.cancelBookMark = function () {
        $http.get($rootScope.url + '8081/app/tourschedule/cancelScheduleBookMark',{
          params : {
            targetNo : $scope.scheduleListDetail.recordNo,
            targetType : 3,
            userUid : $rootScope.rootUser.userUid
          }
        })
          .success(function (result) {
            $scope.isBookMark = true;
          });
      }
      // 댓글 부분
      $ionicModal.fromTemplateUrl('views/scheduleList/scheduleComment.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $http.get($rootScope.url + '8081/app/tourschedule/getScheduleListComment', {
        params : {
          recordNo : $scope.scheduleListDetail.recordNo
        }
      })
        .success(function (result) {
          $scope.commentList = result;
          console.log(result);
          for(var i =0; i < result.length; i++) {
            console.log(moment().startOf(result.regDate,'day').fromNow())
          }
        });
      $scope.commentOpen = function () {
        $scope.modal.show();
      }

      $scope.resize = function () {
        if($("#inputText").val() != "") {
          $scope.putPhoto = false;
        } else {
          $scope.putPhoto = true;
        }
        var obj = document.getElementById('inputText');
        obj.style.height = "1px";
        obj.style.height = (5+obj.scrollHeight) + "px";
        $("#footerBar").css("height",(19+obj.scrollHeight) + "px");
      }

      $scope.insertComment = function (data) {
        $http({
          url: $rootScope.url + '8081/app/tourschedule/insertScheduleListComment',
          method: 'POST',
          data: $.param({
            userUid : $rootScope.rootUser.userUid,
            content : data,
            recordNo : $scope.scheduleListDetail.recordNo
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

      $scope.delComment = function (commentNo) {
        console.log(commentNo);
        $scope.comfirmPop = tourSchedulePopup.comfirmPopup("삭제","정말 삭제하시겠습니까?");
        $scope.comfirmPop.then(function (res) {
          if (res) {
            $http.get($rootScope.url + '8081/app/tourschedule/delScheduleListComment', {
              params : {
                commentNo : commentNo,
                recordNo : $scope.scheduleListDetail.recordNo
              }
            })
              .success(function (result) {
                tourSchedulePopup.alertPopup("삭제 완료", "삭제가 완료되었습니다.", null);
                $scope.commentList = result;
              })
          }
        })
      }

    });
});

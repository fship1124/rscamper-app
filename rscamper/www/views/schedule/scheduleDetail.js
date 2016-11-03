/**
 * Created by Bitcamp on 2016-11-02.
 */
angular.module('App')
.controller('dScheduleCtrl', function ($scope, $rootScope,$stateParams, $http, detailSchedule, $ionicActionSheet, $timeout) {
  $scope.dSchedule = detailSchedule.getScheduleInfo($stateParams.no);
  $scope.updateBtn = true;
  $http.get($rootScope.url + '8090/rscamper-server/app/tourschedule/getTourDate',
    {params : {
      dDate : $scope.dSchedule.departureDate,
      aDate : $scope.dSchedule.arriveDate
    }})
    .success(function (result) {
      $scope.period = result;
    });

  $scope.changeCover = function () {
// Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '카메라' },
          { text: '사진첩'}
        ],
        cancelText: '취소',
        cancel: function() {

        },
        buttonClicked: function(index) {
          hideSheet();
          if (index == 0) {
            $scope.choiceCamera();
          }
          if (index == 1) {
            $scope.choicePhotoLibrary();
          }
          return index;
        }
      });
      $timeout(function() {
        hideSheet();
      }, 5000);
  }

  $scope.choiceCamera = function () {
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType : Camera.EncodingType.JPEG,
      targetWidth : 300,
      targetHeight : 300,
      popoverOptions : CameraPopoverOptions,
      saveToPhotoAlbum : false
    };
    navigator.camera.getPicture(function (imageDATA) {
     $scope.updateCover(imageDATA);
    }, function (err) {

    }, options);
  }

  $scope.choicePhotoLibrary = function () {
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType : Camera.EncodingType.JPEG,
      targetWidth : 300,
      targetHeight : 300,
      popoverOptions : CameraPopoverOptions,
      saveToPhotoAlbum : false
    };
    navigator.camera.getPicture(function (imageDATA) {
      $scope.updateCover(imageDATA);
    }, function (err) {

    }, options);
  }

  $scope.updateCover = function (imageDATA) {
    $http({
      url: $rootScope.url + '8090/rscamper-server/app/tourschedule/changeCover',
      method: 'POST',
      data: $.param({
        no : $scope.dSchedule.recordNo,
        isPhoto : $scope.dSchedule.picture,
        photo : 'data:image/jpeg;base64,' +  imageDATA
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).success(function (result) {
      $scope.dSchedule = result;
      detailSchedule.changeCover(result);
    });
  }
});

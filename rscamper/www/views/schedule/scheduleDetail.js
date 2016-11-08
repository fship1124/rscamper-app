/**
 * Created by Bitcamp on 2016-11-02.
 */
angular.module('App')
.controller('dScheduleCtrl', function ($scope, $rootScope,$stateParams, $http, detailSchedule, $ionicActionSheet, $timeout, $ionicModal) {
  $scope.dSchedule = detailSchedule.getScheduleInfo($stateParams.no);
  $scope.updateBtn = true;
  $scope.strapline = {
    title : "",
    content : ""
  }
  $rootScope.getScheduleLocation = {};
  $http.get($rootScope.url + '8090/rscamper-server/app/tourschedule/getScheduleLocation',
    {params : {
      no : $stateParams.no
    }})
    .success(function (data) {
      $rootScope.getScheduleLocation = data;
      console.log(data);
    })

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

  $ionicModal.fromTemplateUrl('views/schedule/tourScheduleIntro.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/schedule/locationMemo.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.locationMemo = modal;
  });

  $scope.openMemo = function () {
    $scope.locationMemo.show();
  }

  $scope.resize = function (id) {
    var obj = document.getElementById(id);
    obj.style.height = "1px";
    obj.style.height = (20+obj.scrollHeight) + "px";
  }

  $scope.updateStrapline = function (s) {
    $http({
      url: $rootScope.url + '8090/rscamper-server/app/tourschedule/updateStrapline',
      method: 'POST',
      data: $.param({
        no : $scope.dSchedule.recordNo,
        title : s.title,
        content : s.content
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).success(function (result) {
      $scope.dSchedule = result;
      $scope.modal.hide();
    });
  }
});

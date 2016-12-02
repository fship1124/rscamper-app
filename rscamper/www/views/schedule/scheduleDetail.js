/**
 * Created by Bitcamp on 2016-11-02.
 */
angular.module('App')
.controller('dScheduleCtrl', function ($scope, $rootScope,$stateParams, $http, detailSchedule, $ionicActionSheet, $timeout, $ionicModal) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });

  var imgid = 1;
  $rootScope.dSchedule = detailSchedule.getScheduleInfo($stateParams.no);
  $scope.updateBtn = true;
  $scope.strapline = {
    title : "",
    content : ""
  }
  $rootScope.getScheduleLocation = {};
  $http.get($rootScope.url + '8081/app/tourschedule/getScheduleLocation',
    {params : {
      no : $stateParams.no
    }})
    .success(function (data) {
      $rootScope.getScheduleLocation = data;
      console.log(data);
    })

  $http.get($rootScope.url + '8081/app/tourschedule/getTourDate',
    {params : {
      dDate : $rootScope.dSchedule.departureDate,
      aDate : $rootScope.dSchedule.arriveDate
    }})
    .success(function (result) {
      $rootScope.period = result;
      console.log("기간 : " + result);
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
      url: $rootScope.url + '8081/app/tourschedule/changeCover',
      method: 'POST',
      data: $.param({
        no : $rootScope.dSchedule.recordNo,
        isPhoto : $rootScope.dSchedule.picture,
        photo : 'data:image/jpeg;base64,' +  imageDATA
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).success(function (result) {
      $rootScope.dSchedule = result;
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

  $scope.openMemo = function (data) {
    console.log(data);
    $scope.memoLocation = data;
    $scope.locationMemo.show();
    setTimeout(function () {
      $("#edit-title").focus();
    },0);
    $("#edit-text").on('click',"img", function (e) {
    $('img').remove("#"+e.target.id);
    })
  }

  $scope.resize = function (id) {
    var obj = document.getElementById(id);
    obj.style.height = "1px";
    obj.style.height = (20+obj.scrollHeight) + "px";
  }

  $scope.updateStrapline = function (s) {
    $http({
      url: $rootScope.url + '8081/app/tourschedule/updateStrapline',
      method: 'POST',
      data: $.param({
        no : $rootScope.dSchedule.recordNo,
        title : s.title,
        content : s.content
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).success(function (result) {
      $rootScope.dSchedule = result;
      $scope.modal.hide();
    });
  }

  $scope.insertPicture = function () {
    var editText = $("#edit-text");
  }

  $scope.qweqweqwe = function () {
 /*   var asd = document.getElementById("edit-text");
    $scope.imgId = 1;
    var img = "<div id='div" + imgid + "'><img id='img"+ imgid + "' src='img/defaultscheduleImg.jpg' style='width: 100%; height: 100px'/></div><br>";
    //document.execCommand('insertHTML',true, img);
    asd.innerHTML += img;
    setTimeout(function () {
      $("#edit-text").select();
    },0);
    imgid++;*/

    var input = document.getElementById("edit-text");
    setTimeout(function () {
      input.focus();
      input.setSelectionRange(2,5);
    },0);
  }

  $scope.textResult = function () {
    console.log($("#edit-text").html());
  }
  $scope.delLocation = function (no) {
    $http.get($rootScope.url + '8081/app/tourschedule/delLocation',
      {params : {
        locationNo : no,
        no : $stateParams.no
      }})
      .success(function (result) {
        $rootScope.getScheduleLocation = result;
      })
  }

  $scope.openCamera = function () {
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
      $scope.imgId = 1;
      var img = "<img id='img"+ imgid + "' src='data:image/jpeg;base64," + imageDATA + "'  style='width: 100%; height: 100px'/>";
      var diva = "<div id='div" + imgid + "'></div>";
      document.execCommand('insertHTML',true, img);
      var asd = document.getElementById("edit-text");
      asd.innerHTML += img;
      asd.innerHTML += diva;
      asd.innerHTML += "　";
      $("#edit-text").focus();
      imgid++;
    }, function (err) {

    }, options);
  }

  $scope.openGallary = function () {
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
      var img = "<img id='img"+ imgid + "' src='data:image/jpeg;base64," + imageDATA + "'  style='width: 100%; height: 100px'/><div id='div" + imgid + "'></div>";
      document.execCommand('insertHTML',true, img);
      imgid++;
      alert("asd");
    }, function (err) {

    }, options);
  }

  $scope.setBudget = function () {

  }

  $("#cameraTest").click(function () {
    var aaaa = document.getElementById('edit-text');
    if (aaaa.createTextRange) {
      var range = aaaa.createTextRange();
      range.move('character', aaaa.value.length);    // input box 의 글자 수 만큼 커서를 뒤로 옮김
      range.select();
      console.log("Asdasd");
    }
    else if (this.selectionStart || this.selectionStart== '0')
      this.selectionStart = this.value.length;
  });

  $scope.updateBtnChange = function () {
    $scope.updateBtn = !$scope.updateBtn;
  }

  $scope.insertMemo = function () {
    console.log('제목 : ', $("#memoTitle").val());
    console.log($("#edit-text").html());
    console.log($scope.memoLocation.contentCode);
    console.log($stateParams.no);
    $scope.locationMemo.hide();
  }
});

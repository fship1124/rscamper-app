/**
 * Created by Bitcamp on 2016-10-31.
 */
angular.module('App')
  .controller('ScheduleCtrl', function ($ionicPlatform, $cordovaGeolocation, $http, $state, $scope, $ionicModal, $ionicPopup, tourSchedulePopup, $rootScope, $location, detailSchedule) {
    $rootScope.listCount = 0;
    $rootScope.url = "http://192.168.0.190:";
    $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/getschedule",{
      params :{
        uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1"
      }
    })
      .success(function (result) {
        $rootScope.scheduleList = result;
        console.log(result);
        $rootScope.listCount = result.length;
        console.log("scheduleCtrl");
      });
    $scope.newSchedule = {
      title : "",
      startDate : "",
      finishDate : ""
    };

    $ionicModal.fromTemplateUrl('views/schedule/makeSchedule.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.createSchedule = function (s) {
      if (s.title == "") {
        tourSchedulePopup.alertPopup('여행 제목','여행 제목을 입력해주세요.','tourTitle');
        return false;
      }

      if (s.startDate == "") {
        tourSchedulePopup.alertPopup('출발 일자','출발 일자를 선택하세요.','sDate');
        return false;
      }

      if (s.finishDate == "") {
        tourSchedulePopup.alertPopup('도착 일자','도착 일자를 선택하세요.','fDate');
        return false;
      }
        $http.get($rootScope.url + "8090/rscamper-server/app/tourschedule/insert",
          {params : {
            uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1",
            title : s.title,
            sDate : s.startDate,
            fDate : s.finishDate
          }})
          .success(function (result) {
            $rootScope.scheduleList = result;
            $rootScope.listCount = result.length;
            $scope.modal.hide();
          })
      }

      $scope.delSchedule = function ($event, no) {
        $event.stopPropagation();
        var confirmPopup = $ionicPopup.confirm({
          template: '일정을 삭제하시겠습니까?'
        });
        confirmPopup.then(function (res) {
          if (res) {
            $http.get($rootScope.url + '8090/rscamper-server/app/tourschedule/delSchedule',
              {params : {
                uid : "3SeiZsCViyRVLbjMmnXuVEslLHk1",
                no : no
              }})
              .success(function (result) {
                $rootScope.scheduleList = result;
                $rootScope.listCount = result.length;
              });
          } else {
            return false;
          }
        })
      }

      $scope.moveDetail = function (no) {
        $location.path("/detailSchedule/detail/"+no);
      }

  });

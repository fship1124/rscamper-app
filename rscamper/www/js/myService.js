angular.module('App')
  .factory('tourSchedulePopup', function ($ionicPopup) {
    return {
      alertPopup : function (title, content, focus) {
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: content
        });
        alertPopup.then(function () {
          var text = document.getElementById(focus);
          setTimeout(function () {
            text.focus();
          },0);
        })
      }
    }
  })
  .factory('detailSchedule',function ($rootScope) {
    console.log("factory");
    return {
      getScheduleInfo : function (no) {
        console.log($rootScope.scheduleList);
        for (var i = 0; i < $rootScope.scheduleList.length; i++) {
          if ($rootScope.scheduleList[i].recordNo == no) {
              return $rootScope.scheduleList[i];
          }
        }
        return null;
      },
      changeCover : function (detailSchedule) {
        for (var i = 0; i < $rootScope.scheduleList.length; i++) {
          if ($rootScope.scheduleList[i].recordNo == detailSchedule.recordNo) {
            $rootScope.scheduleList[i] = detailSchedule;
            return null;
          }
        }
      }
    };
  });


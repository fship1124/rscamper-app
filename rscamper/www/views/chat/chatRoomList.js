/**
 * Created by 이성주 on 2016-11-18.
 */
angular.module("App")
.controller('chatRoomListCtrl', function ($scope, $rootScope, $http, locationCategory, $stateParams) {
    $scope.location = locationCategory.detailCategory($stateParams.no);

    $http.get($rootScope.url + "8090/rscamper-server/app/chat/getChatRoom", {
      params : {
        no : $stateParams.no
      }
    })
      .success(function (data) {
        $rootScope.roomList = data;
        console.log($rootScope.roomList);
      })
})

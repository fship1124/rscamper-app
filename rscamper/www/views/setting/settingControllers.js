// 프로필 컨트롤러
app.controller('ProfileCtrl', function ($rootScope, $scope, AuthService, $ionicModal, $ionicPopover, $timeout, $location, $ionicActionSheet) {
  $scope.updateProfile = AuthService.updateProfile;

  var template = '<ion-popover-view>' +
    '   <ion-header-bar>' +
    '       zzz' +
    '   </ion-header-bar>' +
    '   <ion-content class="padding">' +
    '       zzz' +
    '   </ion-content>' +
    '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });
  $scope.closePopover = function () {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.popover.remove();
  });
})
// 셋팅 메인 컨트롤러
  .controller('SettingMainCtrl', function ($rootScope, $scope, AuthService) {
    $scope.logout = AuthService.logout;
    $scope.resign = AuthService.resign;
  })

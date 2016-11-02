// 프로필 컨트롤러
app.controller('ProfileCtrl', function ($rootScope, $scope, AuthService, $ionicModal, $timeout, $ionicActionSheet) {
  $scope.updateProfile = AuthService.updateProfile;


  // 액션 시트
  $scope.show = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '프로필 수정' },
      ],
      cancelText: '취소',
      cancel: function() {

      },
      buttonClicked: function(index) {
        if (index == 0) {
          $scope.openModal();
        }
        return index;
      }
    });

    $timeout(function() {
      hideSheet();
    }, 5000);
  };

  // 모달
  $ionicModal.fromTemplateUrl('updateProfile-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



})
// 셋팅 메인 컨트롤러
  .controller('SettingMainCtrl', function ($rootScope, $scope, AuthService) {
    $scope.logout = AuthService.logout;
    $scope.resign = AuthService.resign;
  })

// 프로필 컨트롤러
app.controller('ProfileCtrl', function ($rootScope, $scope, AuthService, $ionicModal, $timeout, $ionicActionSheet) {

  $scope.updateProfile = function() {
    // TODO: 유효성 체크
    $scope.modal.hide();
    // AuthService.updateProfile();
  }

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
        hideSheet();
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

  $ionicModal.fromTemplateUrl('modal/modProfileModal.html', {
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
    $scope.profile = "";
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
  });

})
// 셋팅 메인 컨트롤러
  .controller('SettingMainCtrl', function ($rootScope, $scope, AuthService) {
    $scope.logout = AuthService.logout;
    $scope.resign = AuthService.resign;
  })

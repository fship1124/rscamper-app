// 프로필 컨트롤러
app.controller('ProfileCtrl', function ($rootScope, $scope, AuthService, $ionicModal, $timeout, $ionicActionSheet, MyPopup, DbService) {
  $scope.profile = {
    displayName: $rootScope.rootUser.displayName,
    birthday: new Date($rootScope.rootUser.birthday),
    introduce: $rootScope.rootUser.introduce,
    phoneNumber: $rootScope.rootUser.phoneNumber,
    websiteUrl: $rootScope.rootUser.websiteUrl,
    locationNo: $rootScope.rootUser.locationNo
  };

  $scope.updateProfile = function (result) {
    // TODO: 유효성 체크
    // TODO: 지역선택 SELECTED 문제 해결

    var profileData = {
      uid: $rootScope.rootUser.userUid,
      displayName: result.displayName,
      birthday: birthday,
      introduce: result.introduce,
      phoneNumber: result.phoneNumber,
      websiteUrl: result.websiteUrl,
      locationNo: parseInt(result.locationNo)
    }

    AuthService.updateProfile(profileData, function () {
        DbService.selectUserByUid(profileData.uid, function (result) {
        $rootScope.rootUser = result;
      })
      MyPopup.alert('알림', '회원정보 수정을 완료했습니다.');
      $scope.modal.hide();
    })

  }

  // 액션 시트
  $scope.show = function () {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        {text: '프로필 수정'},
      ],
      cancelText: '취소',
      cancel: function () {

      },
      buttonClicked: function (index) {
        hideSheet();
        if (index == 0) {
          $scope.openModal();
        }
        return index;
      }
    });
    $timeout(function () {
      hideSheet();
    }, 5000);
  };

  // 모달
  $ionicModal.fromTemplateUrl('modal/modProfileModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function () {
    DbService.getLocationList(function (result) {
      $scope.locations = result;
      // $scope.profile = $rootScope.rootUser;
      $scope.modal.show();
    });
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {

  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
  });

})
// 셋팅 메인 컨트롤러
  .controller('SettingMainCtrl', function ($rootScope, $scope, AuthService) {
    $scope.logout = AuthService.logout;
    $scope.resign = AuthService.resign;
  })

// 로그인 컨트롤러
app.controller('SigninCtrl', function ($scope, AuthService) {
  // TODO: 로그인 폼 유효성 검사
  $scope.loginWithEmail = AuthService.loginWithEmail;
  $scope.loginWithPortal = AuthService.loginWithSocial;
})

// 회원가입 컨트롤러
  .controller('SignupCtrl', function ($scope, AuthService) {
    // TODO: 회원가입 폼 유효성 검사
    $scope.register = AuthService.register;
  })

// 비밀번호 초기화 컨트롤러
.controller('ResetPasswordCtrl', function ($scope, AuthService) {
  $scope.resetPassword = AuthService.resetPassword;
})

// 로그인 메인 컨트롤러
  .controller('LoginMainCtrl', function ($scope, AuthService) {

  })
;

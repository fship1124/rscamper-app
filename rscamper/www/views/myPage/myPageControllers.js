app.controller("MyPageMainCtrl", function ($rootScope, $scope) {
  $scope.myItems = [];
  $scope.myItems.push('제목제목제목제목길게제목길게길게길게길게길게길게');
  $scope.myItems.push('제목짧게');
  $scope.myItems.push(3);
  $scope.myItems.push(4);
  $scope.myItems.push('안녕 제목 안녕 제목');

  $scope.images = [];
  $scope.images.push('img/example_img/000019620002.jpg');
  $scope.images.push('img/example_img/000019620031.jpg');
  $scope.images.push('img/example_img/000019630025.jpg');
  $scope.images.push('img/example_img/000019650021.jpg');
  $scope.images.push('img/example_img/000019660011.jpg');
})

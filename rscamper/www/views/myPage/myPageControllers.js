app.controller("MyPageMainCtrl", function ($rootScope, $scope) {
  $scope.myItems = [];
  $scope.myItems.push('제목제목제목제목길게제목길게길게길게길게길게길게');
  $scope.myItems.push('제목짧게');
  $scope.myItems.push(3);
  $scope.myItems.push(4);
  $scope.myItems.push('안녕 제목 안녕 제목');

  $scope.images = [];
  for (var i = 0; i < 5; i++) {
    var rNum = Math.floor(Math.random() * 14) + 1;
    console.log(rNum);
    var imgUrl = 'img/example_img/example' + rNum + '.jpg';
    $scope.images.push(imgUrl);
  }
})

/**
 * Created by 이성주 on 2016-11-17.
 */
angular.module('App')
    .controller('chatDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicScrollDelegate, $http, $ionicSideMenuDelegate, locationCategory, $timeout, $ionicModal) {
      /*     $http.get($rootScope.url + "8090/rscamper-server/app/chat/getChatRoomInfo", {
        params : {
          roomNo : $stateParams.chatRoomNo
        }
      })
        .success(function (data) {
          $scope.roomInfo = data;
          console.log($scope.roomInfo);
        })*/
      $http.get($rootScope.url + "8090/rscamper-server/app/chat/joinRoom", {
        params : {
          chatRoomInfoNo : $stateParams.chatRoomNo,
          userUid : $rootScope.rootUser.userUid
        }
      })
        .success(function (data) {
          $scope.userInfoList = data;
          $scope.userCount = data.length;
        });

     /* $http.get($rootScope.url + "8090/rscamper-server/app/chat/selectRoomUserList",{
        params : {
          chatRoomInfoNo : $stateParams.chatRoomNo
        }
      })
      .success(function (data) {
        $scope.userInfoList = data;
        $scope.userCount = data.length;
      });*/
      var initData = {
        type : 'join',
        name : $rootScope.rootUser.displayName,
        room : $stateParams.chatRoomNo,
        photoUrl : $rootScope.rootUser.photoUrl,
        uid : $rootScope.rootUser.userUid
      }
      $rootScope.socket.emit("connection", initData);

      var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
      $rootScope.roomInfo = locationCategory.getChatRoom($stateParams.chatRoomNo);
      $scope.scrollDown = true;
      $scope.toggleLeftSideMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
      };
      console.log($rootScope.rootUser);


  $scope.msgTextBox = [];
  $scope.msg = {
    sendId : "aaa",
    msg : "hi"
  }
  //최초 접속
      $rootScope.socket.on('system',function (data) {
    var msgTextBox = document.getElementById('msgList');
    msgTextBox.innerHTML += "<div style='width: 100%; text-align: center'>" + data.message + "</div>";
  })
      $rootScope.socket.on("message", function (data) {
    console.log(data);
    writeText(data,"other");
  });

  function writeText(data,user) {
    var msgList = document.getElementById('msgList');
    var html = '<div class="item" style="padding: 0 !important; border: none">';
    if (user == 'other') {
      html += '<div ng-if="user._id !== message.userId"><img ng-click="viewProfile(message)" class="profile-pic left" src="' + data.photoUrl + '" onerror="onProfilePicError(this)">';
      html += '<div class="chat-bubble left" style="white-space:normal;"><pre>' + data.message + '</pre>';
    }
    if (user =='user') {
      html += '<div ng-if="user._id !== message.userId"><img ng-click="viewProfile(message)" class="profile-pic right" src="' + $rootScope.rootUser.photoUrl + '" onerror="onProfilePicError(this)">';
      html += '<div class="chat-bubble right" style="white-space:normal;"><pre>' + $scope.msgContent  + '</pre>';
    }
    html += '<div class="message-detail"><span class="bold">' + data.name + '</span>,';
    html += '<span>aaa</span></div>';
    html += '</div>';
    html += '</div>';
    msgList.innerHTML += html;
  }
  for (var i = 0; i < $rootScope.codeTb.length; i++) {
    if ($stateParams.no == $rootScope.codeTb[i].codeNo) {
      $scope.area = $rootScope.codeTb[i];
      console.log($scope.area);
    }
  }

  $scope.sendMsgText = function () {
    var data = {
      name : $rootScope.rootUser.displayName,
      message : $scope.msgContent,
      uid : $rootScope.rootUser.userUid
    }
    $rootScope.socket.emit('user',data);
    writeText(data,"user");
    $scope.msgContent = "";
    $ionicScrollDelegate.scrollBottom();
  }
  $scope.refreshScroll = function (scrollBottom, timeout) {
        $timeout(function () {
          scrollBottom = scrollBottom || $scope.scrollDown;
          viewScroll.resize();
          if (scrollBottom) {
            viewScroll.scrollBottom(true);
          }
          $scope.checkScroll();
        }, timeout || 1000);
      };

      $scope.checkScroll = function () {
        $timeout(function () {
          var currentTop = viewScroll.getScrollPosition().top;
          var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
          $scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
          $scope.$apply();
        }, 0);
        return true;
      };

      $ionicModal.fromTemplateUrl('views/chat/chatUserListModal.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.closeModal = function () {
        $scope.modal.hide();
      }
})

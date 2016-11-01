// 회원 관련 서비스
app.factory('AuthService', function ($location, $firebaseAuth, $cordovaOauth, $http, MyPopup, Localstorage, DbService, $cordovaCamera, $cordovaFileTransfer) {
  return {
    // 이메일 로그인 메소드
    loginWithEmail: function (useremail, password, redirectTo) {
      if ($firebaseAuth().$getAuth()) {
        $firebaseAuth().$signOut();
        MyPopup.alert('알림', '로그아웃');
      } else {
        $firebaseAuth().$signInWithEmailAndPassword(useremail, password)
          .then(function (result) {
            // 이메일 인증 확인
            if (!result.emailVerified) {
              MyPopup.alert('로그인 실패', '이메일 인증이 필요합니다.')
              $firebaseAuth().$signOut();
              return;
            }
            MyPopup.alert('알림', '이메일 로그인 성공');
            $location.path(redirectTo);
          })
          .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              MyPopup.alert('로그인 실패', '비밀번호가 잘못되었습니다.');
            } else {
              MyPopup.alert('로그인 실패', errorMessage);
            }
          });
      }
    },

    // 소셜 로그인 메소드
    loginWithSocial: function (providerName, redirectTo) {

      if ($firebaseAuth().$getAuth()) {
        $firebaseAuth().$signOut();
        MyPopup.alert('알림', '로그아웃');
      } else {
        switch (providerName) {
          case "google":
            if (ionic.Platform.isWebView()) {
              $cordovaOauth.google("506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56.apps.googleusercontent.com" + "&include_profile=true", ["email", "profile"]).then(function (result) {
                var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                firebase.auth().signInWithCredential(credential).then(function (result) {
                  MyPopup.alert('알림', '구글로그인 성공');
                  $location.path(redirectTo);
                }, function (error) {
                  MyPopup.alert('실패', 'error');
                });
              }, function (error) {
                MyPopup.alert('실패', 'error');
              });
            } else {
              var provider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function (result) {
                MyPopup.alert('알림', '구글 로그인성공');
                $location.path(redirectTo);
              });
            }
            break;

          case "facebook":
            if (ionic.Platform.isWebView()) {
              // 페북에서 Oauth토근 가져와서
              $cordovaOauth.facebook("947628548702706", ["email"]).then(function (result) {
                // Firebase에 토큰 가져가서 인증
                $firebaseAuth().$authWithOAuthToken("facebook", result.access_token).then(function (authData) {
                }, function (error) {
                });
              }, function (error) {
              });
            } else {
              var provider = new firebase.auth.FacebookAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function (result) {
                MyPopup.alert('알림', '페이스북 로그인성공');
                $location.path(redirectTo);
              });
            }
            break;

          case "twitter":
            if (ionic.Platform.isWebView()) {
              $cordovaOauth.twitter("O0aubI3UlDJzlzaAVLGJ3BqVf", "qwyWjtCq0TDIXCB8PsoM854B30Pu7ANjKYAyLBaCOYFUWGxeUm").then(function (result) {
                $firebaseAuth().$authWithOAuthToken("twitter", result.access_token).then(function (authData) {
                  MyPopup.alert('알림', '트위터 로그인성공');
                  $location.path('/loginMain');
                }, function (error) {
                });
              }, function (error) {
              });
            } else {
              var provider = new firebase.auth.TwitterAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function (result) {
                    MyPopup.alert('알림', '트위터 로그인성공');
                    $location.path(redirectTo);
              });
            }
            break;
        }
      }
    },

    // 로그아웃 메소드
    logout: function () {
      if (firebase.auth().currentUser) {
        $firebaseAuth().$signOut();
        MyPopup.alert('알림', '로그아웃');
      } else {
        MyPopup.alert('에러', '로그인 되어있지 않습니다.');
      };
    },

    // 이메일 회원가입 메소드
    register: function (username, useremail, password, redirectTo) {
      $firebaseAuth().$createUserWithEmailAndPassword(useremail, password)
        .then(function (result) {
          DbService.insertEmailUser(result, username, function () {
            // 인증 메일 발송
            firebase.auth().currentUser.sendEmailVerification().then(function () {
              MyPopup.alert('회원가입 성공', '계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.');
              $firebaseAuth().$signOut();
              // 회원가입 완료후 로그인페이지로 이동
              $location.path(redirectTo);
            });
          })
        }, function (error) {
          MyPopup.alert('오류', error);
        });
    },

    // 비밀번호 초기화 메소드
    resetPassword: function (useremail) {
      firebase.auth().sendPasswordResetEmail(useremail).then(function () {
        MyPopup.alert('알림', '비밀번호 초기화 메일이 발송 되었습니다. 이메일을 확인해 주세요!');
        $location.path('/signin');
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          MyPopup.alert('에러', '잘못된 이메일 주소입니다.');
        } else if (errorCode == 'auth/user-not-found') {
          MyPopup.alert('에러', '요청한 이메일이 존재하지 않습니다.');
        }
        MyPopup.alert('에러', errorMessage);
      });
    },

    // 인증메일 재발송
    sendVerifyEmail: function (email) {

    },

    // 로그인한 유저정보 가져오기
    getCurrentUser: function () {
      return Localstorage.getObject('user');
    },

    // 회원탈퇴 메소드
    resign: function () {
      var user = firebase.auth().currentUser;
      if (user) {
        var userUid = user.uid;
        user.delete().then(DbService.deleteUserByUid(userUid, function () {
          $firebaseAuth().$signOut();
          MyPopup.alert('성공', '회원탈퇴가 완료되었습니다.');
        }), function (error) {
          MyPopup.alert('에러', error);
        });
      } else {
        MyPopup.alert('에러', '로그인 되어있지 않습니다.');
      }
    },

    // TODO: 프로필 사진 수정 메소드
    updateProfilePhoto: function ($event) {
      $event.stopPropagation();
      MyPopup.confirm('프로필 사진 수정 확인', '프로필 사진을 수정하시겠습니까?',
        function () {
          var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function (imageData) {

            console.log(imageData);
            console.log(options);

            var url = 'http://192.168.0.228:3001/rscamper-server/app/user/upload/profileImage';
            var targetPath = imageData;
            var filename = targetPath.split("/").pop();
            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
              console.log("SUCCESS: " + JSON.stringify(result.response));
              var userUid = $rootScope.rootUser.uid;
              var type = result.response.type;
              var path = result.response.path;
              var size = result.response.size;

            }, function (err) {
              console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              })
            });
          }, function (err) {
            console.log(err);
          });
      },
        function () {
          // 수정안한다.
      });
    },
    // TODO: 배경 사진 수정 메소드
    updateBgPhoto: function () {
      MyPopup.confirm('배경 사진 수정 확인', '배경 사진을 수정하시겠습니까?',
        function () {
          var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function (imageData) {

            console.log(imageData);
            console.log(options);

            var url = "http://localhost/";
            //target path may be local or url
            var targetPath = imageData;
            var filename = targetPath.split("/").pop();
            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg"
            };
            $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
              console.log("SUCCESS: " + JSON.stringify(result.response));
            }, function (err) {
              console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              })
            });

          }, function (err) {
            console.log(err);
          });
        },
        function () {
        });
    },
    // TODO: 회원정보 수정 메소드
    updateProfile: function () {

    }
  };
})
  // [유틸] Db관련 메소드
  .factory('DbService', ['$http', function ($http) {
    var url = 'http://192.168.0.228:3001/rscamper-server/app';
    return {
      // 소셜 회원정보 입력
      insertUser: function (userData, successCB) {
        $http({
          url: url + '/user/insert',
          method: 'POST',
          data: $.param({
            userUid: userData.uid,
            displayName: userData.displayName,
            email: userData.email,
            photoUrl: userData.photoURL,
            providerName: userData.providerData[0].providerId,
            providerUid: userData.providerData[0].uid,
            providerDisplayName: userData.providerData[0].displayName,
            providerPhotoUrl: userData.providerData[0].photoUrl,
            providerEmail: userData.providerData[0].email
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).success(successCB);
      },
      // 이메일 회원정보 입력
      insertEmailUser: function (userData, userName, successCB) {
        $http({
          url: url + '/user/insert',
          method: 'POST',
          data: $.param({
            userUid: userData.uid,
            displayName: userName,
            email: userData.email,
            photoUrl: userData.photoURL,
            providerName: userData.providerData[0].providerId,
            providerUid: userData.providerData[0].uid,
            providerDisplayName: userData.providerData[0].displayName,
            providerPhotoUrl: userData.providerData[0].photoUrl,
            providerEmail: userData.providerData[0].email
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        }).success(successCB);
      },
      // 회원정보 삭제
      deleteUserByUid: function (userUid, successCB) {
        $http({
          url: url + '/user/delete/oneUser?userUid=' + userUid,
          method: 'DELETE'
        }).success(successCB);
      },
      // 회원정보 UID로 조회
      selectUserByUid: function (userUid, successCB) {
        $http({
          url: url + '/user/select/oneUser?userUid=' + userUid,
          method: 'GET'
        }).success(successCB);
      }
    }
  }])

  // [유틸] localStorage사용을 위한 셋팅
  .factory('Localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      }
    }
  }])

  // [유틸] 팝업창 사용을 위한 서비스
  .factory('MyPopup', ['$ionicPopup', function ($ionicPopup) {
    return {
      alert: function (title, template) {
        $ionicPopup.alert({
          title: title,
          template: template
        })
          .then(function (res) {
          });
      },
      confirm: function (title, template, yesCB, noCB) {
        $ionicPopup.confirm({
          title: title,
          template: template
        })
          .then(function (res) {
            if(res) {
              yesCB();
            } else {
              noCB();
            }
          });
      }
    }
  }]);

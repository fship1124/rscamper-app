angular.module("App")
// 설정 정보 관련 서비스
  .factory("MyConfig", function () {
    return {
      backEndURL: "http://14.32.66.104:8081/rscamper-server/app", // 학원 서버 컴퓨터 외부
      // backEndURL: "http://192.168.0.9:8081/rscamper-server/app", // 학원 서버 컴퓨터 로컬
      // backEndURL: "http://192.168.0.228:8081/rscamper-server/app", // 학원 내컴퓨터
      // backEndURL: "http://192.168.1.13:8081/rscamper-server/app", // 집
      googleAuthURL: "apps.googleusercontent.com",
      googleClientId: "506479374537-4o2pa5ghuj68ocudca9fbohmikfsth56",
      facebookClientId: "947628548702706",
      twitterConsumerKey: "O0aubI3UlDJzlzaAVLGJ3BqVf",
      twitterConsumerSecret: "qwyWjtCq0TDIXCB8PsoM854B30Pu7ANjKYAyLBaCOYFUWGxeUm"
    };
  })

  // 인증관련 서비스
  .factory("AuthService", function ($location, $firebaseAuth, $cordovaOauth, $http, MyPopup, DbService, $cordovaCamera, $cordovaFileTransfer, $rootScope, $timeout, MyConfig) {
    return {
      // 이메일 로그인 메소드
      loginWithEmail: function (useremail, password, redirectTo) {
        if ($firebaseAuth().$getAuth()) {
          $firebaseAuth().$signOut();
          MyPopup.alert("알림", "로그아웃");
        } else {
          $firebaseAuth().$signInWithEmailAndPassword(useremail, password)
            .then(function (result) {
              // 이메일 인증 확인
              if (!result.emailVerified) {
                MyPopup.confirm("로그인 실패", "이메일 인증이 필요합니다. 인증메일을 다시 받으시겠습니까?", function () {
                  firebase.auth().currentUser.sendEmailVerification().then(function () {
                    MyPopup.alert("인증메일 재발송", "계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.");
                    $firebaseAuth().$signOut();
                  });
                }, function () {
                  $firebaseAuth().$signOut();
                })
                return;
              }
              MyPopup.alert("알림", "이메일 로그인 성공");
              $location.path(redirectTo);
            })
            .catch(function (error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode === "auth/wrong-password") {
                MyPopup.alert("로그인 실패", "비밀번호가 잘못되었습니다.");
              } else {
                MyPopup.alert("로그인 실패", errorMessage);
              }
            });
        }
      },

      // 소셜 로그인 메소드
      loginWithSocial: function (providerName, redirectTo) {
        if ($firebaseAuth().$getAuth()) {
          $firebaseAuth().$signOut();
          MyPopup.alert("알림", "로그아웃");
        } else {
          switch (providerName) {
            case "google":
              if (ionic.Platform.isWebView()) {
                $cordovaOauth.google(MyConfig.googleClientId + "."+ MyConfig.googleAuthURL + "&include_profile=true", ["email", "profile"]).then(function (result) {
                  var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
                  firebase.auth().signInWithCredential(credential).then(function (result) {
                    MyPopup.alert("알림", "구글로그인 성공");
                    $location.path(redirectTo);
                  }, function (error) {
                    MyPopup.alert("실패", error);
                  });
                }, function (error) {
                  MyPopup.alert("실패", error);
                });
              } else {
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider).then(function (result) {
                  MyPopup.alert("알림", "구글 로그인성공");
                  $location.path(redirectTo);
                });
              }
              break;

            case "facebook":
              if (ionic.Platform.isWebView()) { // TODO : 어플
                $cordovaOauth.facebook(MyConfig.facebookAuthURL, ["email", "public_profile"], {redirect_uri: "http://localhost/callback"}).then(function (result) {
                  var credential = firebase.auth.FacebookAuthProvider.credential(result.access_token);
                  firebase.auth().signInWithCredential(credential).then(function (result) {
                    MyPopup.alert("알림", "페북 로그인 성공");
                    $location.path(redirectTo);
                  }, function (error) {
                    MyPopup.alert("실패 : 파이어베이스", error);
                  });
                }, function (error) {
                  MyPopup.alert("실패 : 페이스북 OAUTH", error);
                });
              } else { // 웹
                var provider = new firebase.auth.FacebookAuthProvider();
                firebase.auth().signInWithPopup(provider).then(function (result) {
                  MyPopup.alert("알림", "페이스북 로그인성공");
                  $location.path(redirectTo);
                });
              }
              break;

            case "twitter":
              if (ionic.Platform.isWebView()) { // TODO : 어플
                $cordovaOauth.twitter(MyConfig.twitterConsumerKey, MyConfig.twitterConsumerSecret).then(function (result) {
                  var credential = firebase.auth.TwitterAuthProvider.credential(result.token, result.secret);
                  firebase.auth().signInWithCredential(credential).then(function (result) {
                    MyPopup.alert("알림", "트위터 로그인 성공");
                    $location.path(redirectTo);
                  }, function (error) {
                    MyPopup.alert("실패 : 파이어베이스", error);
                  });
                }, function (error) {
                  MyPopup.alert("실패 : 트위터 OAUTH", error);
                });
              } else { // 웹
                var provider = new firebase.auth.TwitterAuthProvider();
                firebase.auth().signInWithPopup(provider).then(function (result) {
                  MyPopup.alert("알림", "트위터 로그인성공");
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
          MyPopup.confirm("로그아웃", "로그아웃 하시겠습니까?",
            function () {
              $firebaseAuth().$signOut();
              MyPopup.alert("알림", "로그아웃");
              $location.path("/");
            },
            function () {
              return false;
            });
        } else {
          MyPopup.alert("에러", "로그인 되어있지 않습니다.");
        }
        ;
      },

      // 이메일 회원가입 메소드
      register: function (username, useremail, password, redirectTo) {
        $firebaseAuth().$createUserWithEmailAndPassword(useremail, password)
          .then(function (result) {
            DbService.insertEmailUser(result, username, function () {
              // 인증 메일 발송
              firebase.auth().currentUser.sendEmailVerification().then(function () {
                MyPopup.alert("회원가입 성공", "계정 활성화를 위해 이메일 인증을 해주시기 바랍니다.");
                $firebaseAuth().$signOut();
                // 회원가입 완료후 로그인페이지로 이동
                $location.path(redirectTo);
              });
            })
          }, function (error) {
            MyPopup.alert("오류", error);
          });
      },

      // 비밀번호 초기화 메소드
      resetPassword: function (useremail) {
        firebase.auth().sendPasswordResetEmail(useremail).then(function () {
          MyPopup.alert("알림", "비밀번호 초기화 메일이 발송 되었습니다. 이메일을 확인해 주세요!");
          $location.path("/signin");
        }).catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/invalid-email") {
            MyPopup.alert("에러", "잘못된 이메일 주소입니다.");
          } else if (errorCode == "auth/user-not-found") {
            MyPopup.alert("에러", "요청한 이메일이 존재하지 않습니다.");
          }
          MyPopup.alert("에러", errorMessage);
        });
      },

      // 회원탈퇴 메소드
      resign: function () {
        MyPopup.prompt("회원탈퇴", "정말로 탈퇴하시겠습니까? 회원을 탈퇴하시려면 [회원탈퇴] 라고 입력해주세요.", function (result) {
          if (result == "회원탈퇴") {
            var user = firebase.auth().currentUser;
            if (user) {
              var userUid = user.uid;
              user.delete().then(DbService.deleteUserByUid(userUid, function () {
                $firebaseAuth().$signOut();
                MyPopup.alert("성공", "회원탈퇴가 완료되었습니다.");
              }), function (error) {
                MyPopup.alert("에러", error);
              });
            } else {
              MyPopup.alert("에러", "로그인 되어있지 않습니다.");
            }
            $location.path("/");
          }
        })
      },

      // 프로필 사진 수정 메소드
      updateProfilePhoto: function ($event) {
        $event.stopPropagation();
        MyPopup.confirm("프로필 사진 수정 확인", "프로필 사진을 수정하시겠습니까?",
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
              var url = MyConfig.backEndURL + "/user/upload/profileImage";
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
                var data = JSON.parse(result.response);
                var userPhoto = {
                  userUid: $rootScope.rootUser.userUid,
                  type: data.type,
                  path: data.path,
                  size: data.size
                }
                DbService.updateProfileImage(userPhoto, function () {
                  DbService.selectUserByUid($rootScope.rootUser.userUid, function (result) {
                    $rootScope.rootUser = result;
                  });
                })
              }, function (err) {
                console.log("ERROR: " + JSON.stringify(err));
              }, function (progress) {
                $timeout(function () {
                  // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                })
              });
            }, function (err) {
              console.log(err);
            });
          },
          function () {
          });
      },
      // 배경 사진 수정 메소드
      updateBgPhoto: function () {
        MyPopup.confirm("배경 사진 수정 확인", "배경 사진을 수정하시겠습니까?",
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
              var url = MyConfig.backEndURL + "/user/upload/bgImage";
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
                var data = JSON.parse(result.response);
                var userPhoto = {
                  userUid: $rootScope.rootUser.userUid,
                  type: data.type,
                  path: data.path,
                  size: data.size
                }
                DbService.updateBgImage(userPhoto, function () {
                  DbService.selectUserByUid($rootScope.rootUser.userUid, function (result) {
                    $rootScope.rootUser = result;
                  });
                })
              }, function (err) {
                console.log("ERROR: " + JSON.stringify(err));
              }, function (progress) {
                $timeout(function () {
                  // $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                })
              });
            }, function (err) {
              console.log(err);
            });
          },
          function () {

          });
      },
      // 회원정보 수정 메소드
      updateProfile: function (userData, successCB) {
        DbService.updateUserByUid(userData, successCB);
      }
    }
  })

  // HTTP관련 서비스
  .factory("DbService", ["$http", "MyConfig", function ($http, MyConfig) {
    return {
      updateProfileImage: function (userPhoto, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/update/profileImage",
          method: "POST",
          data: $.param({
            userUid: userPhoto.userUid,
            type: userPhoto.type,
            path: userPhoto.path,
            size: userPhoto.size
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).success(successCB);
      },
      updateBgImage: function (userPhoto, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/update/bgImage",
          method: "POST",
          data: $.param({
            userUid: userPhoto.userUid,
            type: userPhoto.type,
            path: userPhoto.path,
            size: userPhoto.size
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).success(successCB);
      },
      // 소셜 회원정보 입력
      insertUser: function (userData, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/insert",
          method: "POST",
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
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).success(successCB);
      },
      // 이메일 회원정보 입력
      insertEmailUser: function (userData, userName, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/insert",
          method: "POST",
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
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).success(successCB);
      },
      // 회원정보 삭제
      deleteUserByUid: function (userUid, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/delete/oneUser?userUid=" + userUid,
          method: "DELETE"
        }).success(successCB);
      },
      // 회원정보 UID로 조회
      selectUserByUid: function (userUid, successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/select/oneUser?userUid=" + userUid,
          method: "GET"
        }).success(successCB);
      },
      // 회원정보 UID로 수정
      updateUserByUid: function (userData, successCB) {
        console.log(userData);
        $http({
          url: MyConfig.backEndURL + "/user/update/oneUser",
          method: "POST",
          data: $.param({
            userUid: userData.uid,
            displayName: userData.displayName,
            birthday: userData.birthday,
            introduce: userData.introduce,
            phoneNumber: userData.phoneNumber,
            websiteUrl: userData.websiteUrl,
            locationNo: userData.locationNo
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        }).success(successCB);
      },
      // 로케이션 리스트 가져오는 메소드
      getLocationList: function (successCB) {
        $http({
          url: MyConfig.backEndURL + "/user/select/locations",
          method: "GET",
        }).success(successCB);
      }
    }
  }])

  // 팝업창 사용을 위한 서비스
  .factory("MyPopup", ["$ionicPopup", function ($ionicPopup) {
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
          template: template,
          cancelText: "취소",
          okText: "확인"
        })
          .then(function (res) {
            if (res) {
              yesCB();
            } else {
              noCB();
            }
          });
      },
      prompt: function (title, subTitle, resultCB, defaultText) {
        $ionicPopup.prompt({
          title: title,
          template: subTitle,
          inputType: 'text',
          inputPlaceholder: '',
          defaultText: defaultText,
          cancelText: '취소',
          // cancelType:
          okText: '확인',
          // okType:
        }).then(resultCB)
      }
    }
  }])

  // 로딩 관련 서비스
  .factory("MyLoading", ["$ionicLoading"], function ($ionicLoading) {
    return {
      show: function (template, duration) {
        $ionicLoading.show({
          template: template,
          duration: duration
        }).then(function () {

        });
      },
      hide: function () {
        $ionicLoading.hide().then(function () {

        });
      }
    }
  })

  // 유효성 체크 서비스
  .factory("ValChkService", function (MyPopup) {
    return {
     validationCheck: function (type, value) {
       switch (type) {
         case "email": // 이메일 형식 체크(정규식)(not null)
           if(!value) { MyPopup.alert("알림", "이메일을 입력해 주세요."); return false; }
           if(!value.match(/[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/)) { MyPopup.alert("알림", "올바른 이메일 형식이 아닙니다."); return false; }
           return true;
         case "password": // 6~20자 문자숫자혼합(정규식)(not null)
           if(!value) { MyPopup.alert("알림", "비밀번호를 입력해 주세요"); return false; }
           if(!value.match(/^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/)) { MyPopup.alert("알림", "올바른 비밀번호 형식(영문자/숫자조합 6~20자)이 아닙니다."); return false; }
           return true;
         case "displayName": // 20자 이하(not null)
           if(!value) { MyPopup.alert("알림", "사용자 이름을 입력해 주세요."); return false; }
           if(value.length > 20) { MyPopup.alert("알림", "입력된 사용자 이름이 너무 깁니다.(20자이하)"); return false; }
           return true;
         case "phoneNumber": // 전화번호 형식(정규식)(널가능)
           if (value) {
             if(!value.match(/^\d{2,3}-\d{3,4}-\d{4}$/)) { MyPopup.alert("알림", "올바른 전화번호를 입력해 주세요."); return false;}
           }
           return true;
         case "websiteUrl":// 인터넷 주소(정규식)(널가능)
           if (value) {
             if(!value.match(/^(http?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w_\.-]*)*\/?$/)) { MyPopup.alert("알림", "올바른 인터넷 주소를 입력해 주세요."); return false;}
           }
           return true;
         case "introduce": // 1000자이하(널가능)
           if (value) {
             if(value.length > 1000) { MyPopup.alert("알림", "입력된 자기소개 내용이 너무 깁니다.(1000자이하)"); return false; }
           }
           return true;
         case "birthday": // 현재보다 과거인지 체크(널가능)
           if (value) {
             if(new Date() < new Date(value)) { MyPopup.alert("알림", "현재보다 과거를 선택해야 합니다."); return false;}
           }
           return true;
       }
       return false;
     }
    }
  })

  // LocalStorage사용을 위한 셋팅
  .factory("Localstorage", ["$window", function ($window) {
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
        return JSON.parse($window.localStorage[key] || "{}");
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      }
    }
  }])
;

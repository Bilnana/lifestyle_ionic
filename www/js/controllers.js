angular.module('lifestyle.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera,$cordovaImagePicker) {
    

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.registration = {};
    
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
    
    // Perform the login action when the user submits the login form
     $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    
    
    
     // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  }; 
    
     // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };
    
    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        console.log('Doing reservation', $scope.reservation);

        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
    
    
     //CORDOVA takePicture plugin
     $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
         $scope.takePicture = function() {
            $cordovaCamera.getPicture(options)
                .then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });

            $scope.registerform.show();

        };  
    });
    
    //CORDOVA imagePicker plugin
     $ionicPlatform.ready(function() {
         var gallery = {
           maximumImagesCount: 10,
           width: 800,
           height: 800,
           quality: 80
          };
    
         $scope.openGallery=function(){

         $cordovaImagePicker.getPictures(gallery)
             
            .then(function (imageData) {

            for (var i = 0; i < imageData.length; i++) {

            $scope.registration.imgSrc = imageData[0];
                
            $scope.registerform.show();

            }

            }, function(error) {

            console.log(error);

            });

            };
         
         });
        
})

 .controller('PostController', ['$scope', 'posts', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, posts, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
           
            
            $scope.posts=posts;
     
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading ...";
                        
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "health";
                }
                else if (setTab === 3) {
                    $scope.filtText = "news";
                }
                else if (setTab === 4) {
                    $scope.filtText = "life";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };
    
            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
     
        //Add Favorite (Menu)
        $scope.addFavorite = function (index) {
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);  
        $ionicListDelegate.closeOptionButtons();       
            
        $ionicPlatform.ready(function () {
            
            //LocalNotification plugin
            $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Favorite",
                    text: $scope.posts[index].name
                }).then(function () {
                    console.log('Added Favorite '+$scope.posts[index].name);
                },
                function () {
                    console.log('Failed to add Notification ');
                
                });
            //CordovaToast plugin
            $cordovaToast
                 .show('Added Favorite '+$scope.posts[index].name, 'long', 'center')
                 .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
        });
    
      };      
     
     
        }])

      

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])


       .controller('PostDetailController', ['$scope', '$stateParams', 'post', 'postFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal','$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, post, postFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal,$ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;

    $scope.post = post;
    
           
                //POPOVER
               $ionicPopover.fromTemplateUrl('templates/post-detail-popover.html', { 
                scope: $scope           
                }).then(function(popover) {              
                $scope.popover = popover;            
                });         
            
                $scope.openPopover = function($event) {
                    $scope.popover.show($event);            
                };       
            
                $scope.closePopover = function() {              
                    $scope.popover.hide();        
                };
                
            
            //Add Favorite (DishDetail)
                $scope.addFavorite = function (index) {
                console.log("index is " + index);
                favoriteFactory.addToFavorites(index); 
                    
            //LocalNotification plugin 
                $ionicPlatform.ready(function () {
                    $cordovaLocalNotification.schedule({
                        id: 1,
                        title: "Added Favorite",
                        text: $scope.post.name
                    }).then(function () {
                        console.log('Added Favorite '+$scope.post.name);
                    },
                    function () {
                        console.log('Failed to add Notification ');
                    });
               //CordovaToast plugin     
                $cordovaToast
                      .show('Added Favorite '+$scope.post.name, 'long', 'bottom')
                      .then(function (success) {
                          // success
                      }, function (error) {
                          // error
                      });    
      
                  });

                $ionicListDelegate.closeOptionButtons();   
                    
                };
                
               
             //MODAL-Leave comment
                $ionicModal.fromTemplateUrl('templates/post-comment.html', {
                    scope: $scope
                  }).then(function(modal) {
                    $scope.commentForm= modal;
                  });

                  // Triggered in the  modal to close it
                  $scope.closeComment = function() {
                    $scope.commentForm.hide();
                  };

                  // Open  modal
                  $scope.openComment = function($event) {
                    $scope.commentForm.show($event);
                  };
              
            // Perform the COMMENT action when the user submits the COMMENT form
                 	
                    $scope.mycomment = {rating:5, author:"", comment:"", date:""};
                    $scope.submitComment = function () {
                    $scope.mycomment.date = new Date().toISOString();
                    console.log($scope.mycomment);
                    $scope.post.comments.push($scope.mycomment);
                    menuFactory.getPosts().update({id:$scope.post.id},$scope.post);
                    // $scope.commentForm.$setPristine();
                    $scope.mycomment = {rating:5, name:"", comment:"", date:""};
                    // Close Modal when user click the submmit buuton
                    $timeout(function() {
                             $scope.closeComment();
                             }, 1000);

                        };
        }])


    .controller('PostCommentController', ['$scope', 'postFactory', function($scope,postFactory) {
            
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.post.comments.push($scope.mycomment);
        menuFactory.getPosts().update({id:$scope.post.id},$scope.post);
                
                $scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
                }
            }])


    .controller('FavoritesController', ['$scope', 'posts', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading','$timeout','$ionicPlatform','$cordovaVibration', function ($scope, posts, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading ,$timeout,$ionicPlatform,$cordovaVibration) {

            $scope.baseURL = baseURL;

            $scope.shouldShowDelete = false;

            $scope.favorites = favorites;

            $scope.posts = posts;

            console.log($scope.posts, $scope.favorites);

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

             $scope.deleteFavorite = function (index) {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirm Delete',
                    template: 'Are you sure you want to delete this item?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('Ok to delete');
                        favoriteFactory.deleteFromFavorites(index);  
                        
                    } else {
                        console.log('Canceled delete');
                    }
     
                 $scope.shouldShowDelete = false;  
               //VIBRATE
                 $ionicPlatform.ready(function () {
                     $cordovaVibration.vibrate(1000); 
                 }); 
                //VIBRATE       
                 });  
             };
               
   
      }])


    .filter('favoriteFilter', function () {
        return function (posts, favorites) {
            var out = [];
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < posts.length; j++) {
                    if (posts[j].id === favorites[i].id)
                        out.push(posts[j]);
                }
            }
            return out;

    }});













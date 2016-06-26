// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
 angular.module('lifestyle', ['ionic', 'ngCordova', 'lifestyle.controllers','lifestyle.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      $timeout(function(){
                $cordovaSplashscreen.hide();
      },3000);
  });
    
     $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
    
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })
  
   .state('app.home', {
      url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'templates/home.html',
            controller: 'PostController',
             resolve: {
              posts:  ['postFactory', function(postFactory){
                return postFactory.query();
              }]  
          }
        }
      }
    })


   .state('app.favorites', {
      url: '/favorites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html',
            controller:'FavoritesController',
          resolve: {
              posts:  ['postFactory', function(postFactory){
                return postFactory.query();
              }],
                favorites: ['favoriteFactory', function(favoriteFactory) {
                  return favoriteFactory.getFavorites();
              }]
          }
        }
      }
    })
  
   

  
  .state('app.postdetails', {
    url: '/home/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/postdetail.html',
        controller: 'PostDetailController',
        resolve: {
            post: ['$stateParams','postFactory', function($stateParams, postFactory){
                return postFactory.get({id:parseInt($stateParams.id, 10)});
            }]
        }
      }
    }
  })
  

   .state('app.post-detail-popover', {
    url: '/post-detail-popover',
    views: {
      'mainContent': {
        templateUrl: 'templates/post-detail-popover.html',
        controller: 'PostDetailController'
            }
        }
    })
      
      .state('app.post-comment', {
    url: '/post-comment',
    views: {
      'mainContent': {
        templateUrl: 'templates/post-comment.html',
        controller: 'PostDetailController'
      }
    }
      
      
  
  })
  
  
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
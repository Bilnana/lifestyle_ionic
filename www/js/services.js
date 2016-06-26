'use strict';

angular.module('lifestyle.services', ['ngResource'])
       .constant("baseURL", "http://192.168.1.101:3000/") //192.168.1.104
       .factory('postFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

            return $resource(baseURL + "posts/:id", null, {
                'update': {
                    method: 'PUT'
                }
            });

       }])

    

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"feedback/:id");
    
        }])
        
        .factory('favoriteFactory', ['$resource','$localStorage', 'baseURL', function ($resource, localStorage,baseURL) {
               
                var favFac = {};
               // var favorites={};
                var favorites = localStorage.getObject('favorites', '[]');
            
                favFac.addToFavorites = function (index) {
                    for (var i = 0; i < favorites.length; i++) {
                        if (favorites[i].id == index)
                            return;
                    }
                        favorites.push({id: index});
                        localStorage.storeObject('favorites', favorites);
                       
                    };
      
            
                 favFac.deleteFromFavorites = function (index) {
                    for (var i = 0; i < favorites.length; i++) {
                        if (favorites[i].id == index) {
                            favorites.splice(i, 1);
                        }
                        
                    }
                      localStorage.storeObject('favorites', favorites);
                       
                    }

                        favFac.getFavorites = function () {
                        return favorites;
                    };

                       return favFac;
    }])

    .factory('$localStorage', ['$window', function($window) {
              return {
                store: function(key, value) {
                  $window.localStorage[key] = value;
                },
                get: function(key, defaultValue) {
                  return $window.localStorage[key] || defaultValue;
                },
                storeObject: function(key, value) {
                  $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function(key,defaultValue) {
                  return JSON.parse($window.localStorage[key] || defaultValue);
                }
              }
            }])


;

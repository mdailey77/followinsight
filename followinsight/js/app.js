var AngularTwitterApp = angular.module('twitterApp', ['ngResource']);

AngularTwitterApp.factory('Userservice', ['$resource', function($resource){
	return $resource("php/connect.php?id=:id");	
}]);
/*
AngularTwitterApp.config(function($routeProvider) {
    $routeProvider
    // route for the home page
    .when('/', {
        templateUrl : 'pages/home.html',
        controller  : 'mainController'
    })
    // route for the twitterid page
    .when('/twitterId', {
        templateUrl : 'pages/twitterid.html',
        controller  : 'twitterIdController'
    }).
    otherwise({
        redirectTo: '/'
    });   
});
*/
AngularTwitterApp.controller('mainController', function($scope, Userservice) {
    $scope.loading = false;
    $scope.counter = 0;   
    $scope.error = false;
    $scope.users = [];
    $scope.getResult = function(id){   
        $scope.loading = true;
        Userservice.get({
            id: id
        }, function(user) {
            console.log(user);  
            if(user.error) {
                $scope.error = true;
                $scope.message = "Validation Error please fill the user_id or screen_name field";
            }else{
                if(!user.errors){
                    $scope.counter += 1;
                    user.position = $scope.counter;
                    $scope.users.push(user);
                    $scope.error = false;
                }else{            
                    $scope.error = true;
                    $scope.message = user.errors[0]['message']+" - "+user.errors[0]['code'] ;
                }               
            }                      
        }); 
        $scope.loading = false;
    };
    
    $scope.removeUser = function(index){
        $scope.usuarios.splice(index, 1);
    }; 
});

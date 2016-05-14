angular.module('twitterApp', ['ngResource'])			
.factory('TwitterUser', ['$resource', function($resource){
	return $resource("php/twitterconnect.php?id=:id");	
}])
.factory('KloutUser', ['$resource', function($resource){
	return $resource("php/kloutconnect.php?id=:id");
}])
.filter('datetime', function($filter)
{
	return function(input)
	{
		if(input == null){ return ""; }
		var _date = $filter('date')(new Date(input),
			'MMMM d, y - hh:mm:ss');
		return _date;
	};
})
.filter('verifiedFilter', function () {
	return function (input) {				  
	   if (input) {
			input = 'yes';
		} else {
			input = 'no';
		}				   
	   return input;
	}
})
.filter('locationFilter', function () {
	return function (input) {
		var userlocation = "location not set";
		if(input != ""){				
			userlocation = "located in " + input;
		}									   
	   return userlocation;
	}
})
.filter('profileimageFilter', function () {
	return function (input) {
	   if (input == null) {return ""; }				   
	   var imageformat = input.substr(input.lastIndexOf('.') + 1);
	   var trimmedinput = input.substring(0, input.indexOf('_normal'));
	   if (imageformat == 'png') {
			var original_profileimage = trimmedinput + '.png';
		} else if (imageformat == 'jpg'){
			var original_profileimage = trimmedinput + '.jpg';
		} else if (imageformat == 'jpeg'){
			var original_profileimage = trimmedinput + '.jpeg';
		} else if (imageformat == 'gif'){
			var original_profileimage = trimmedinput + '.gif';
		}
	   return original_profileimage;
	}
})
.controller('mainController', function($scope, TwitterUser, KloutUser) {
	$scope.buttontext = "Get Insight";
	$scope.kloutscore = null;
	$scope.error = false;
	$scope.users = [];
	$scope.getResult = function(id){
		$scope.users = [];
		$scope.buttontext = "Loading";		
		TwitterUser.get({
			id: id
		}, function(user) {						
			if(user.error) {
				$scope.error = true;
				$scope.message = "Please enter a screenname.";
			}else{
				if(!user.errors){
					console.log(user);
					$scope.users.push(user);
					$scope.error = false;
				}else{            
					$scope.error = true;
					$scope.message = user.errors[0]['message']+" - "+user.errors[0]['code'] ;
				}               
			}                      
		}).$promise.then(function(user){
			KloutUser.get({
				id: user.id
			}, function(userkloutscore) {
				if(!userkloutscore) {							
					console.log('An error occurred. No Klout score returned.');
				}else{
					$scope.kloutscore = userkloutscore.score;
					var score_stringified = JSON.stringify(userkloutscore);
					console.log('The Klout API response: ' + score_stringified);
				}
				$scope.buttontext = "Get Insight";
			});
		});					
	};				
	$scope.removeUser = function(index){
		$scope.users.splice(index, 1);
	}; 
});

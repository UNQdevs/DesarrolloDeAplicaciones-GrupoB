feag.controller('categoryControllerList', function ($scope, $http, $location, $routeParams) {
	$http.get("http://localhost:8081/backend_api/rest/categoryService/categories").success(function(response) {
		$scope.categories = response;
		}).error(function() {
			console.log("error");
	});
});

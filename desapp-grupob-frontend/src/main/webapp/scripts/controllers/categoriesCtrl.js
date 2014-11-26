feag.controller('categoriesCtrl', function ($scope, $filter, $http, $location, $route, $q, $log, $rootScope, $timeout, $translate,dialogs) {
    
	// Variables
	var restWebService = "http://localhost:8081/backend_api/rest/";
	
	//Integrar globalmente en el app.js
	$scope.lang = 'en-US';
	$scope.language = 'English';
	
	//-- Listeners & Watchers --// Integrar globalmente en el app.js
	$scope.$watch('lang',function(val,old){
		switch(val){
			case 'en-US':
				$scope.language = 'English';
				break;
			case 'es':
				$scope.language = 'Spanish';
				break;
		}
	});
	
	//-- Methods --// Integrar globalmente en el app.js
	$scope.setLanguage = function(lang){
		$scope.lang = lang;
		$translate.use(lang);
		console.log(lang);
	};
	
	$scope.closeAlert = function(index) {
		    $scope.alerts.splice(index, 1);
		  };
	
	// Get all categories	  
	function getAll () {
		$http.get(restWebService + "categoryService/categories")
        .success(function (response) {
            $scope.categories = response;
        }).error(function () {
            console.log("Error al listar categorias");
        }); 
	}
	
	//Initial call to render list
	getAll();
	
	// By perform remote validation, check if the input name already exists in db.
	// For that define validation method returning $q promise. 
	// If promise resolves to string validation failed.
    $scope.checkName = function (data) {
    	var d = $q.defer();
    	if (data == undefined) {
    		d.reject('Input a name...');
    	}
    	else {
		    	$http.get(restWebService + "categoryService/byName/"+data)
		        .success(function(res) {
		        	 res = res || {};
		        	 if(res.status === 'ok') { // {status: "ok"}
		        	        d.resolve()
		        	 } else { // {status: "error", msg: "Message from server..."}
		        	        d.resolve(res.msg)
		        	 }
		        }).error(function(e){
		        d.reject('Error: already exists');
		        });
    	}
        return d.promise;
    };

    $scope.launchConfirmDeleteDialog = function(id) {
	    var dlg = dialogs.confirm();
		dlg.result.then(function(btn){
			$scope.removeCategory (id);
		},function(btn){
			console.log("Delete cancelled");
		});
    };
    
    // add category
    $scope.saveCategory = function (data) {
    	$http.post(restWebService + 'categoryService/save', data).success(
				function(data, status, headers, config) {
					if (status == 201) {
						$scope.alerts = [];
		            	$scope.alerts.push({type: 'success' , msg: 'Saved!'});
		            	console.log("Save Category OK");
		            	getAll(); //refresh table with new state
					}
				}).error(function(data, status, headers, config) {
			console.log("An Error occurred while trying to store a category, with name: "+data.name);
		});
    };

    // update category
    $scope.updateCategory = function (data, id) {
    	angular.extend(data, {id:id});
    	var jsonCategory = angular.toJson(data);
    	$http.put(restWebService + 'categoryService/'+id, jsonCategory).success(
    			function(data, status, headers, config){
    				console.log("status del success de mkUpdate: "+status);
    				if(status == 200){
    					$scope.alerts = [];
		            	$scope.alerts.push({type: 'success' , msg: 'Updated!'});
    					console.log("Update Category OK");
    					getAll(); //refresh table with new state
    				}
       	}).error(function(data, status, headers, config){
       		console.log("An Error occurred while trying to update a category: "+id);
    	});
    };

    // delete category
    $scope.removeCategory = function (id) {
    	$http.delete(restWebService+'categoryService/'+ id).success(
				function(data, status, headers, config) {
					if (status == 204) {
						$scope.alerts = [];
		            	$scope.alerts.push({type: 'danger' , msg: 'Deleted!'});
						console.log("Delete Category OK");
						getAll();//refresh table with new state
					}
				}).error(function(data, status, headers, config) {
					console.log("An Error occurred while trying to delete a category: "+id);
		});
    };
});

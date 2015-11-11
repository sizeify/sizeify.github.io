var app = angular.module('AdminApp', ['ngRoute']);
var controllers = {};
var factories = {};
app.controller(controllers);
app.factory(factories);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
   	templateUrl: 'partials/admin/users.html',
    controller: 'UsersController',
  })
  .when('/products', {
   	templateUrl: 'partials/admin/products.html',
    controller: 'ProductsController',
  })
  .when('/logs', {
   	templateUrl: 'partials/admin/logs.html',
    controller: 'LogsController',
  })
  .otherwise('/');
});

controllers.MainController = function ($scope, $route, $routeParams, $location, AdminFact){
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
}


controllers.UsersController = function($scope, AdminFact){
	function getUsers() {
		AdminFact.getUsers()
		.success(function (data){
			$scope.users = data;
		});
	} getUsers();	

	$scope.toggleAdmin = function (id){
		AdminFact.toggleAdmin(id)
		.success(function (err, data){
			getUsers();
			$scope.$apply();
		});
	}
}

controllers.ProductsController = function($scope, AdminFact){
	$scope.addNewProduct = function () {
		AdminFact.addNewProduct($scope.newProduct)
		.success(function (err, data){
			$scope.newProduct = {};
			$scope.$apply();
		});
	}
}

controllers.LogsController = function($scope, AdminFact){
	function getLogs() {
		AdminFact.getLogs()
		.success(function (data){
			$scope.logs = data;
		});
	} getLogs();
}

factories.AdminFact = function($http){
	var services = {};

	services.addNewProduct = function (newProduct){
		return $.post('/api/newProduct', newProduct);
	}

	services.toggleAdmin = function (id){
		return $.post('/api/toggleAdmin/' + id, {});
	}

	services.getUsers = function(){
		return $http.get('/api/user');
	}

	services.getLogs = function(){
		return $http.get('/api/logs');
	}

	return services;
}

var app = angular.module('App', ['ngRoute']);
var controllers = {};
var factories = {};
app.controller(controllers);
app.factory(factories);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
   	templateUrl: 'partials/users/landing.html',
    controller: 'MainController',
  })
  .when('/products', {
   	templateUrl: 'partials/users/productlist.html',
    controller: 'AllProducts',
  })
  .when('/product', {
    templateUrl: 'partials/users/product.html',
    controller: 'SingleProduct',
  })
  .when('/preferences', {
   	templateUrl: 'partials/users/preferences.html',
    controller: 'UserPrefs',
  })
  .when('/cart', {
    templateUrl: 'partials/users/cart.html',
    controller: 'Cart',
  })
  .otherwise('/');
});



controllers.Cart = function ($scope, MainFact) {
  MainFact.getCart()
  .success(function (data){
    $scope.totalPrice = 0;
    data.forEach(function(i){
      console.log(i);
      i.price = i.quantity * i.product.price;
      $scope.totalPrice = $scope.totalPrice + i.price;
    });
    $scope.items = data;
  });

}

controllers.SingleProduct = function ($scope, MainFact, $location) {
  MainFact.getProduct($location.search().id)
  .success(function (data){
    $scope.item = data;
  });

  $scope.cartProduct = function () {
    MainFact.cartProduct($location.search().id)
    .then(MainFact.editCartQty());
  }

}

controllers.AllProducts = function ($scope, MainFact, $location) {
	function getProducts() {
		MainFact.getProducts($location.search().content)
		.success(function (data){
			$scope.products = data;
		});
	} getProducts();	

  $scope.changeProduct = function (newProduct) {
    $location.search('content', newProduct);
  }

}




// ]  
// app.factory('testFactory', function(){
//     var countF = 1;
//     return {
//         getCount : function () {

//             return countF;
//         },
//         incrementCount:function(){
//            countF++;
//             return countF;
//         }
//     }               
// });
// x

// function FactoryCtrl($scope, testService, testFactory)
// {
//     $scope.countFactory = testFactory.getCount;
//     $scope.clickF = function () {
//         $scope.countF = testFactory.incrementCount();
//     };
// }








controllers.MainController = function ($scope, MainFact, $q){
  MainFact.getCartQty().then(function (data){
    $scope.cartQty =  data;
    console.log(data);
  });
  // MainFact.getCartQty().success(function (data){
  //   $scope.cartQty = data;
  //   $scope.$apply();
  // });
  // console.log();
}


controllers.UserPrefs = function ($scope, MainFact) {
  $scope.saveDimensions = function () {
    console.log($scope.userDimension);
    MainFact.saveDimensions($scope.userDimension)
    .then(alert("ayyy okayyy"));
  }
  function getDimensions (){

  }

}

factories.MainFact = function ($http, $q){
	var services = {};
  var theCartQty = 0;

  services.editCartQty = function (factor){
    if (factor == 0)
      factor = 1;
    theCartQty = theCartQty + factor;
  }

	services.getProducts = function (content) {
    var url = '/api/products';
    if (content != null){
      url = url + '?type=' + content;
    }

		return $http.get(url);
	}

  services.getProduct = function (id) {
    return $http.get('/api/products/'+id);
  }

  services.cartProduct = function (id) {
    return $http.post('/api/cart/'+id);
  }
  services.getCart = function () {
    return $http.get('/api/cart/');
  }

  services.getCartQty = function (){
    return $q(function (resolve, reject) {
       setTimeout(function() {
        if(theCartQty != 0)
          resolve(theCartQty);
        $http.get('/api/cartQty')
        .success(function (data, msg){
          theCartQty = data[0].qty;
          console.log("updateCArt");
          resolve(theCartQty);
        });  
      }, 1000);
    });
  }

  services.saveDimensions = function (newDimensions){
    return $http.post('/api/dimensions', newDimensions);
  }


	return services;
}

/**
 * AngularJS Web Application
 */
var app = angular.module('WebApp', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/about", {templateUrl: "partials/about.html"})
    .when("/detail/:id", {templateUrl: "partials/detail.html", controller: "DetailCtrl"})
	.when("/contact", {templateUrl: "partials/contact.html"})
    .otherwise({
       redirectTo: "/"
     });
}]);


app.config(function($asideProvider) {
  angular.extend($asideProvider.defaults, {
    container: 'body',
    html: true
  });
});

app.factory("ShotsPage", function($resource) {
	var api = $resource("http://api.dribbble.com/shots/popular?page=:page",
    { callback: "JSON_CALLBACK" },
    { get: { method: "JSONP" }});
	
	return api;
});

app.factory("ShotDetail", function($resource) {
	var api = $resource("http://api.dribbble.com/shots/:id",
    { callback: "JSON_CALLBACK" },
    { get: { method: "JSONP" }});
	
	return api;
});


 app.directive('loading',   ['$http' ,function ($http) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.show();
                    }else{
                        elm.hide();
                    }
                });
            }
        };

 }]);

/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function ($scope, $location, $http, ShotsPage) {
  console.log("Page Controller reporting.");
    
    $scope.currentPage = 1;
    ShotsPage.get({ page: $scope.currentPage }, function (data) {
      $scope.shots = data.shots;
    });
    
  $scope.showDetail = function(idShot) {
		console.log(idShot);
		$location.path("/detail/"+idShot);
	}
  
  $scope.totalItems = 500;
  $scope.currentPage = 1;
   $scope.paginaService = ShotsPage;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
      $scope.paginaService.get({page: $scope.currentPage}, function (data) {
          $scope.shots = data.shots;
      });
  };

  $scope.maxSize = 5;
 
  
  $scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message to Joao!'};

  $scope.asideContato = {title: 'Contato', nome:'Joao', telefone:'4563321'};
    
});

app.controller('DetailCtrl', function ($scope, $location, $http, $route, ShotDetail) {
  console.log("Detail Controller reporting.");

  ShotDetail.get({ id: $route.current.params.id }, function (data) {
      $scope.shot = data;
    });
});


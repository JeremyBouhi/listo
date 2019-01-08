angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/overview.html',
            controller: 'OverviewController',
            controllerAs: 'OverviewVm'
        })

        // nerds page that will use the NerdController
        .when('/nerds', {
            templateUrl: 'views/trip.html',
            controller: 'TripController',
            controllerAs: 'TripVm'
        });

    $locationProvider.html5Mode(true);

}]);

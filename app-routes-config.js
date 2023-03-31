app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: './pages/main.html',
            controller: 'controller'
        })
        .when('/403', {
            templateUrl: './pages/403.html'
        })
        .when('/404', {
            templateUrl: './pages/404.html'
        })
        .otherwise({
            redirectTo: '/404'
        });
});
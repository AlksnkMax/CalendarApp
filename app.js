var CalendarApp = angular.module('CalendarApp', ['ui.router', 'ngAnimate', 'LocalStorageModule','ui.bootstrap']);

CalendarApp.controller('Ctrl', ['$scope', '$location', function ($scope, $location) {
  $scope.$on('$stateChangeStart', function(next, current) {
    $scope.style = 'style-' + $location.url().substring(1);
  });
}]);

CalendarApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/calendar");

  $stateProvider
         .state('calendar', {
             url: "/calendar",
             templateUrl: "templates/calendar.html",
             controller: "calendarCtrl"
         })
         .state('eventList', {
             url: "/event-list",
             templateUrl: "templates/event-list.html",
             controller: "eventListCtrl"
         });
}]);

CalendarApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('CalendarApp')
    .setNotify(true, true)
});

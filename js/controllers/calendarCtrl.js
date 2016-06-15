CalendarApp.controller('calendarCtrl', ['$scope', '$location', 'appService','$timeout',
function($scope, $location, service, $timeout) {

  service.data = service.get();
  service.update();
  $scope.date = service.date;
  $scope.calendarData = service.data.calendarData;
  $scope.month = service.month;
  $scope.daysOfWeek = service.daysOfWeek;
  $scope.firstDay = new Date($scope.date.getFullYear(),$scope.date.getMonth(),1).getDay();
  $scope.events = [];
  var eventHeight;
  var dateHeight;

  (function Constructor() {
    checkForEmptyObjectAndIncorrectMonth();
    prepareEventObject();
  })();

  $timeout(function() {
    eventHeight = $('.event-preview').height() + 3;
    dateHeight = $('.date').height();
    calcCountEventsInBlock();
  });

  $(window).resize(function() {
    calcCountEventsInBlock();
  });

  function calcCountEventsInBlock() {
    $scope.countEventsInBlock = Math.floor(($('.day-block').height() - dateHeight) / eventHeight);
    $scope.$apply();
  }

  function DateObject (date, holiday) {
    this.date = date;
    this.events = [];
    this.holiday = holiday;
  }

  function checkForEmptyObjectAndIncorrectMonth() {
    Date.prototype.getDaysInMonth = function() {
      return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
    };
    if (!service.checkMonth() || $scope.calendarData.length == 0) {
      service.clear();
      $scope.calendarData = [];
      var holiday;
      if ($scope.firstDay == 0) $scope.firstDay = 7;
      for (var i = 1; i < $scope.firstDay; i++) {
        $scope.calendarData.push(null);
      }
      for (var i = 1; i < $scope.date.getDaysInMonth()+1; i++) {
        if (service.holidays[$scope.date.getMonth()][i]) {
          holiday = service.holidays[$scope.date.getMonth()][i];
        } else {
          holiday = undefined;
        }
        $scope.calendarData.push(new DateObject(new Date().setDate(i), holiday));
      }
      for (var i = $scope.date.getDaysInMonth()+$scope.firstDay; i <= 42; i++) {
        $scope.calendarData.push(null);
      }
    }
  }

  function prepareEventObject() {
    $scope.calendarData.forEach(function(item){
      if (item) {
        item.date = new Date(item.date);
        item.events.forEach(function(item2){
          if (item2 instanceof Array) {
            item2.forEach(function(item3){
              if (!($scope.events[item.date.getDate()] instanceof Array)) {
                $scope.events[item.date.getDate()] = [];
              }
              $scope.events[item.date.getDate()].push(item3);
            });
          }
        });
      }
    });
  }

  $scope.openEventList = function(index, clickDate) {
    if (clickDate) {
      service.data.clickIndex = index;
      service.data.calendarData = $scope.calendarData;
      service.save();
      $location.path('/event-list');
    }
  }
}]);

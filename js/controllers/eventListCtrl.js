CalendarApp.controller('eventListCtrl', ['$scope', '$location', 'appService', function($scope, $location, service) {
  service.data = service.get();
  service.update();
  $scope.calendarData = service.data.calendarData;
  $scope.localDate = $scope.calendarData[service.data.clickIndex];
  $scope.localDate.date = new Date($scope.localDate.date);
  $scope.month = service.month;
  $scope.localDay = service.daysOfWeek[$scope.localDate.date.getDay()-1];

  function updateTimeAndCheckEvents() {
    var haveEvent = false;
    if ($scope.localDate.holiday) haveEvent = true;
    $scope.localDate.events.forEach(function(item){
      if (item instanceof Array) {
        if (item.length > 0) haveEvent = true;
        item.forEach(function(item) {
          item.time = new Date(item.time);
        });
      }
    });
    if (!haveEvent) {
      $scope.showFreeDay = true;
      $scope.noAnimation = true;
    }
  }
  updateTimeAndCheckEvents();

  function EventObject (time, title, description) {
    this.time = time;
    this.title = title;
    this.description = description;
  }

  $scope.backToCalendar = function() {
    $location.path('/calendar');
  }
  $scope.addEvent = function() {
    $scope.showFreeDay = false;
    $scope.showAddEventBool = true;
  }
  $scope.closeEventWindow = function() {
    $scope.showAddEventBool = false;
    $scope.showViewEventBool = false;
    $scope.showEditEventBool = false;
    $scope.timeMessageBool = false;
    $scope.timeMessageIncorrectBool = false;
    $scope.titleMessageBool = false;
    $scope.descriptionMessageBool = false;
    $scope.showFreeDay = false;
    $scope.noAnimation = false;
    updateForm($scope.localDate.date,"","",true);
  }
  $scope.viewEvent = function(event, index) {
    $scope.index = index;
    $scope.event = event;
    $scope.showViewEventBool = true;
  }
  $scope.editEvent = function(event) {
    updateForm(event.time,
               event.title,
               event.description);
    $scope.showEditEventBool = true;
    $scope.showAddEventBool = true;
    $scope.showViewEventBool = false;
    $scope.event = event;
  }
  function updateForm(time, title, description, reset) {
    if (reset) {
      time.setHours(12);
      time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);
    }
    $scope.time = new Date(time);
    $scope.title = title;
    $scope.description = description;
  };
  updateForm($scope.localDate.date,"","",true);

  function messageCheck(countOfWords) {
    ($scope.time < new Date()) ?
      $scope.timeMessageBool = true :
      $scope.timeMessageBool = false;
    if (!$scope.time) {
      $scope.timeMessageIncorrectBool = true;
      $scope.timeMessageBool = false;
    } else {
      $scope.timeMessageIncorrectBool = false;
    }
    !$scope.title ?
      $scope.titleMessageBool = true :
      $scope.titleMessageBool = false;
    (countOfWords < 5 && $scope.description) ?
      $scope.descriptionMessageBool = true :
      $scope.descriptionMessageBool = false;
  };

  $scope.ok = function(func, event) {
    var reg = /\s* \s*/;
    var countOfWords = $scope.description.split(reg).length;
    messageCheck(countOfWords);
    if ($scope.title && $scope.time
        && (countOfWords > 4 || !$scope.description)
        && $scope.time > new Date()) {
      func(event);
      if (event && event.time.getHours != $scope.index) {
        $scope.saveEvent(event);
        $scope.removeEvent(event, $scope.index, true);
      }
      sortEvents();
      service.save();
      $scope.closeEventWindow();
    }
  };

  $scope.updateEvent = function(event) {
    event.time = $scope.time;
    event.title = $scope.title;
    event.description = $scope.description;
  };

  $scope.saveEvent = function(event) {
    var event = event || $scope;
    var hours = event.time.getHours();
    if (!($scope.localDate.events[hours] instanceof Array)) {
      $scope.localDate.events[hours] = [];
    }
    $scope.localDate.events[hours].push(new EventObject(
      event.time,
      event.title,
      event.description
    ));
    sortEvents();
  }

  function sortEvents() {
    $scope.localDate.events.forEach(function(item){
      if (item) item.sort(sort);
    });
  }

  function sort(a, b) {
    if (a.time.getMinutes() < b.time.getMinutes()) {
      return -1;
    }
    if (a.time.getMinutes() > b.time.getMinutes()) {
      return 1;
    }
    return 0;
  }

  $scope.removeEvent = function(event, index, bool) {
    var index = index || $scope.index;
    var idx = $scope.localDate.events[index].indexOf(event);
    $scope.localDate.events[index].splice(idx, 1);
    if (!bool) service.save();
  }
}]);

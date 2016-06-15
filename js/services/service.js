CalendarApp.service('appService', ['localStorageService', function(localStorageService) {
  var self = this;
  self.date = new Date();
  self.monthes = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  self.daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  self.holidays = [
    { '1': 'New Year', '7': 'Christmas'},
    { '14': "Valentine's Day"},
    { '8': "International Women's Day"},
    { '1': "April Fools' Day"},
    { '9': 'Victory Day'},
    { '1': "Children's Day"},
    { '7': 'Kupala Night'},
    { '2': 'VDV Day'},
    { '1': 'Knowledge Day'},
    { '31': 'Halloween'},
    { '1': "All Saints' Day"},
    { '25': 'Christmas'}
  ];
  self.month = self.monthes[self.date.getMonth()];
  self.data = {};
  self.checkMonth = function() {
    if (self.month != self.data.month) {
      self.data.month = self.month;
      self.save();
      return false;
    }
    return true;
  }
  self.update = function() {
    self.date = new Date();
    self.month = self.monthes[self.date.getMonth()];
  }
  self.save = function() {
    localStorageService.set('data', self.data);
  }
  self.clear = function() {
    localStorageService.clearAll();
  }
  self.get = function() {
    return localStorageService.get('data') ? localStorageService.get('data') :
      {
        'calendarData': [],
        'clickIndex': 0,
        'month': self.month
      };
  }
  return self;
}]);

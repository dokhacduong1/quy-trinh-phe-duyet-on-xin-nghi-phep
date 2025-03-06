(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customBoxScript', function() {
    return {
      template: '<script ng-src="{{properties.src}}"></script>'
    };
  });

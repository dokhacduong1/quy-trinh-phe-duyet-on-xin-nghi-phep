(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customMyInput', function() {
    return {
      controllerAs: 'ctrl',
      controller: function PbInputCtrl($scope, $log, widgetNameFactory) {

  'use strict';

  this.name = widgetNameFactory.getName('pbInput');
  this.inputId = widgetNameFactory.getId('pbInput');
  this.ngModelOptions = { allowInvalid: true, debounce: $scope.properties.debounce }

  if (!$scope.properties.isBound('value')) {
    $log.error('the pbInput property named "value" need to be bound to a variable');
  }
}
,
      template: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n    <link rel="stylesheet" href="assets/css/style1.css">\n</head>\n<body>\n    <input type="text" class="input-custom" placeholder="Email">\n</body>\n</html>'
    };
  });

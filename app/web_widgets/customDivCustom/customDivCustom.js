(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customDivCustom', function() {
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
      template: '\n<div class="box-custom">\n  <div class="custom ">\n    <div class="box-icon" ng-style="{\'background\': properties.color}">\n      <img ng-src="{{properties.imageLogo}}"  alt="" />\n    </div>\n\n    <div class="box-content">\n      <h2 ng-style="{\'color\': properties.color}" ng-bind-html="properties.object.price | uiTranslate">250k</h2>\n      <p ng-bind-html="properties.object.status | uiTranslate">Sales</p>\n    </div>\n  </div>\n</div>\n'
    };
  });

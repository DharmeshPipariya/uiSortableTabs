var app = angular.module('myApp', ['ui.bootstrap', 'sortableTabs']);

app.controller('TabsDemoCtrl', function ($scope) {
    $scope.data = [];
    $scope.data.tabs = [
      { title: 'Dynamic Title 1', content: 'Dynamic content 1', active: true },
      { title: 'Dynamic Title 2', content: 'Dynamic content 2' },
      { title: 'Dynamic Title 3', content: 'Dynamic content 3' }
    ];
});
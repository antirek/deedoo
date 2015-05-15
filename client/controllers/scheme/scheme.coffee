angular.module 'bedo'
.controller 'SchemeController', [
  '$scope',
  '$scope'
  'Scheme',
  ($scope, $state, Scheme)->
    $scope.data = []
    $scope.data = Scheme.query()
]
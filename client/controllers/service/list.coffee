angular.module 'bedo'
.controller 'ServicesController', [
  '$scope',
  '$scope'
  'Service',
  ($scope, $state, Service)->
    $scope.services = []
    $scope.services = Service.query()
    $scope.delete = (index)->
      service = $scope.services[index]
      $scope.services.splice index, 1
      service.$delete()

]
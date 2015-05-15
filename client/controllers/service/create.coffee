angular.module 'bedo'
.controller 'ServicesNewController', [
  '$scope',
  '$state',
  'Service',
  'Host',
  ($scope, $state, Service, Host)->
    $scope.service = new Service
      resources: []
      dependencies: []
    $scope.hosts = []
    $scope.hosts = Host.query ()->
      if $scope.hosts.length is 0
        $state.go 'hosts', {}, reload: true
    $scope.services = []
    $scope.services = Service.query()
    $scope.addResource = ()->
      $scope.service.resources.push
        name: ''
        username: ''
        password: ''
        port: ''
    $scope.deleteResource = (index)->
      $scope.service.resources.splice index, 1
    $scope.addDependencies = ()->
      $scope.service.dependencies.push
        service_id: ''
        role: ''
        resource_id: ''
    $scope.deleteDependencies = (index)->
      $scope.service.dependencies.splice index, 1
    $scope.serviceChange = (index)->
      dependecy = $scope.service.dependencies[index]
      dependecy.service = $scope.services.filter((obj)->
        obj._id is dependecy.service_id
      )[0]

    $scope.save = ()->
      $scope.service.$save ()->
        $state.go 'services', {}, reload: true
]
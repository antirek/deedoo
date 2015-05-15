angular.module 'bedo'
.controller 'ServicesUpdateController', [
  '$scope',
  '$state',
  '$stateParams'
  'Service',
  'Host',
  ($scope, $state, $stateParams, Service, Host)->
    $scope.hosts = []
    $scope.hosts = Host.query ()->
      if $scope.hosts.length is 0
        $state.go 'hosts', {}, reload: true
    $scope.services = []
    setServiceToDependency = (dependecy)->
      dependecy.service = $scope.services.filter((obj)->
        obj._id is dependecy.service_id
      )[0]
    $scope.services = Service.query ()->
      $scope.service = Service.get id: $stateParams.id, ()->
        for key of $scope.service.dependencies
          setServiceToDependency $scope.service.dependencies[key]

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
      setServiceToDependency $scope.service.dependencies[index]

    $scope.save = ()->
      $scope.service.$save ()->
        $state.go 'services', {}, reload: true
]
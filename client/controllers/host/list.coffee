angular.module 'bedo'
.controller 'HostsController', [
  '$scope',
  '$scope'
  'Host',
  ($scope, $state, Host)->
    $scope.hosts = []
    $scope.hosts = Host.query()
    $scope.delete = (index)->
      host = $scope.hosts[index]
      $scope.hosts.splice index, 1
      host.$delete()

]
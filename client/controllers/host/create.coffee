angular.module 'bedo'
.controller 'HostsNewController', [
  '$scope',
  '$state',
  'Host',
  ($scope, $state, Host)->
    $scope.host = new Host
    $scope.save = ()->
      $scope.host.$save ()->
        $state.go 'hosts', {}, reload: true
]
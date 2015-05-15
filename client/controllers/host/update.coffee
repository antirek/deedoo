angular.module 'bedo'
.controller 'HostUpdateController', [
  '$scope',
  '$state',
  '$stateParams',
  'Host',
  ($scope, $state, $stateParams, Host)->
    $scope.host = Host.get id: $stateParams.id

    $scope.save = ()->
      $scope.host.$save ()->
        $state.go 'hosts', {}, reload: true
]
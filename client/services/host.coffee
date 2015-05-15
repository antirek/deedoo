angular.module 'bedo'
.factory 'Host', ['$resource', ($resource)->
  $resource '/hosts/:id', id: '@_id'
]
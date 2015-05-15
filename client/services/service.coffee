angular.module 'bedo'
.factory 'Service', ['$resource', ($resource)->
  $resource '/services/:id', id: '@_id'
]
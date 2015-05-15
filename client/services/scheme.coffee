angular.module 'bedo'
.factory 'Scheme', ['$resource', ($resource)->
  $resource '/scheme/'
]
angular.module 'bedo'
.config ['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state
      name: 'main'
      url: '/'
      template: ''
  .state
      name: 'hosts'
      url: '/hosts'
      templateUrl: '/partials/hosts/list'
      controller: 'HostsController'
  .state
      name: 'hosts_create'
      url: '/hosts/create'
      templateUrl: '/partials/hosts/create'
      controller: 'HostsNewController'
  .state
      name: 'hosts_update'
      url: '/hosts/update/:id'
      templateUrl: '/partials/hosts/update'
      controller: 'HostUpdateController'

  .state
      name: 'services'
      url: '/services'
      templateUrl: '/partials/services/list'
      controller: 'ServicesController'
  .state
      name: 'services_create'
      url: '/services/create'
      templateUrl: '/partials/services/create'
      controller: 'ServicesNewController'
  .state
      name: 'services_update'
      url: '/services/update/:id'
      templateUrl: '/partials/services/update'
      controller: 'ServicesUpdateController'

  .state
      name: 'scheme'
      url: '/scheme'
      templateUrl: '/partials/scheme/scheme'
      controller: 'SchemeController'
]

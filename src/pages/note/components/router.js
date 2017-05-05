routers.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routers($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/other');

    $stateProvider.state('index', {
        url: '/home',
        template: require('./index.html')
    })
}

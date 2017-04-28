var insurance = angular.module('insurance', ['ui.router','adddriver','map', 'login', 'Road167', 'fixaddress', 'renbao_main', 'addorder']);
insurance.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'view/login.html'
        })
        .state('renbao_main', {
            url: '/renbao_main',
            templateUrl: 'view/renbao/main.html'
        })
        .state('renbao_main.addorder', {
            url: '/addorder',
            templateUrl: 'view/renbao/addorder.html'
        })
        .state('renbao_main.fixaddress', {
            url: '/fixaddress',
            templateUrl: 'view/renbao/fixaddress.html'
        })
        .state('renbao_main.adddriver', {
            url: '/adddriver',
            templateUrl: 'view/renbao/adddriver.html'
        })
        .state('renbao_main.fixaddress.map', {
            url: '/map',
            templateUrl: 'view/renbao/map.html'
        })


})
function isError(err) {
    if (err.data.http_status == 401.1 || err.data.http_code == 'userId.head.illeagl') {
        layer.msg('您的账号在别处登录，请重新登录');
        setTimeout(function () {
            goto_view('login');
        }, 2000);
    }
    if (err.data.http_status == 400) {
        layer.msg(err.data.message);
    }
    if (err.data.http_status >= 500) {
        layer.msg('网络出现问题了，请刷新重试');
    }
}
function goto_view(v) {
    var baseUrl = window.location.href;
    //window.location.reload();
    baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
    window.location.href = baseUrl + "#!/" + v;
    return { 'a': 1, b: 2 };
}
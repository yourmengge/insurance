var insurance = angular.module('insurance', ['track', 'detail', 'ui.router', 'evaluation', 'adddriver', 'map', 'login', 'Road167', 'fixaddress', 'renbao_main', 'addorder', 'orderlist']);
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
        .state('renbao_main.evaluation', {
            url: '/evaluation',
            templateUrl: 'view/renbao/evaluation.html'
        })
        .state('renbao_main.fixaddress', {
            url: '/fixaddress',
            templateUrl: 'view/renbao/fixaddress.html'
        })
        .state('renbao_main.adddriver', {
            url: '/adddriver',
            templateUrl: 'view/renbao/adddriver.html'
        })
        .state('renbao_main.detail', {
            url: '/detail',
            templateUrl: 'view/renbao/detail.html'
        })
        .state('renbao_main.map', {
            url: '/map',
            templateUrl: 'view/renbao/map.html'
        })
        .state('renbao_main.orderlist', {
            url: '/orderlist',
            templateUrl: 'view/renbao/orderlist.html'
        })
        .state('renbao_main.track', {
            url: '/track',
            templateUrl: 'view/renbao/track.html'
        })
        .state('renbao_main.addorder.map', {
            url: '/map',
            templateUrl: 'view/renbao/map.html'
        })
        .state('watchphoto', {
            url: '/watchphoto',
            templateUrl: 'view/watchphoto.html'
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
function ToLocalTime(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var nowtime = y + '-' + add0(m) + '-' + add0(d);
    return nowtime;
}
function add0(m) {
    return m < 10 ? '0' + m : m
}
insurance.filter('ToDay', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var nowtime = y + '-' + add0(m) + '-' + add0(d);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});

insurance.filter('ToTime', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});
insurance.filter('ToLocal', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }

    }
    return ToLocal;
});
insurance.filter('Driver', function () {
    function ToLocal(array) {
        if (array.length == 0) {
            return null;
        } else {
            return array[0].driverName + ' - ' + array[0].driverPhone;
        }


    }
    return ToLocal;
});
insurance.filter('OrderStatus', function () {
    function OrderStatus(text) {
        switch (text) {
            case 1:
                return '待接单'
                break;
            case 2:
                return '待分配'
                break;
            case 3:
                return '进行中'
                break;
            case 4:
                return '已完成'
                break;
            case 7:
                return '系统取消'
                break;
            case 8:
                return '查勘取消'
                break;
            case 9:
                return '历史未完成'
                break;

            default:
                break;
        }
    }
    return OrderStatus;
});
insurance.filter('OrderType', function () {
    function OrderType(text) {
        switch (parseInt(text)) {
            case 1:
                return '事故救援'
                break;
            case 2:
                return '非事故救援'
                break;

            default:
                break;
        }
    }
    return OrderType;
});
insurance.filter('CreateRole', function () {
    function CreateRole(text) {
        switch (parseInt(text)) {
            case 0:
                return '后台下单'
                break;
            case 2:
                return '调度下单'
                break;
            case 3:
                return '查勘下单'
                break;
            case 4:
                return '用户下单'
                break;
            case 7:
                return '保险后台下单'
                break;
            default:
                break;
        }
    }
    return CreateRole;
});
insurance.filter('InsuranceType', function () {
    function InsuranceType(text) {
        switch (text) {
            case 0:
                return '未知类型'
                break;
            case 2:
                return '三者车'
                break;
            case 3:
                return '三者车和标的车'
                break;
            case 1:
                return '标的车'
                break;

            default:
                break;
        }
    }
    return InsuranceType;
});
insurance.filter('CarType', function () {
    function CarType(text) {
        switch (parseInt(text)) {
            case 1:
                return '吊车'
                break;
            case 2:
                return '拖车'
                break;
            case 3:
                return '其他'
                break;
            case 4:
                return '拖加吊'
                break;
            case 5:
                return '非事故救援车'
                break;

            default:
                break;
        }
    }
    return CarType;
});
insurance.filter('Price', function () {
    function Price(text) {
        if (text == null) {
            return null;
        } else {
            return text / 100 + '元';
        }
    }
    return Price;
});

insurance.filter('Distance', function () {
    function Price(text) {
        if (text == null) {
            return null;
        } else {
            return (text / 1000).toFixed(1) + '公里';
        }
    }
    return Price;
});
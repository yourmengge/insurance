var insurance = angular.module('insurance', ['addshop4S', 'batchshop4S', 'shop4S', 'nar_location', 'disasterdriverorderlist', 'disastermap', 'driverordertotle', 'disasterorderlist', 'totleorder', 'batchaddorder', 'review', 'driverlocation', 'disasterdriver', 'disasterinspector', 'site', 'disasterdetail', 'disaster', 'createdisaster', 'addorder_nar', 'selectlocation', 'editorder', 'track', 'detail', 'team', 'ui.router', 'evaluation', 'adddriver', 'map', 'login', 'Road167', 'fixaddress', 'main', 'addorder', 'orderlist']);
insurance.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'view/login.html'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'view/main.html'
        })

        .state('main.addshop4S', {
            url: '/addshop4S',
            templateUrl: 'view/addshop4S.html'
        })
        .state('main.addorder', {
            url: '/addorder',
            templateUrl: 'view/addorder.html'
        })
        .state('main.shop4S', {
            url: '/shop4S',
            templateUrl: 'view/shop4S.html'
        })
        .state('main.batchshop4S', {
            url: '/batchshop4S',
            templateUrl: 'view/batchshop4S.html'
        })
        .state('main.addorder_nar', {
            url: '/addorder_nar',
            templateUrl: 'view/addorder_nar.html'
        })
        .state('main.selectlocation', {
            url: '/selectlocation',
            templateUrl: 'view/selectlocation.html'
        })
        .state('main.disasterdriverorderlist', {
            url: '/disasterdriverorderlist',
            templateUrl: 'view/disasterdriverorderlist.html'
        })
        .state('main.editorder', {
            url: '/editorder',
            templateUrl: 'view/editorder.html'
        })
        .state('main.team', {
            url: '/team',
            templateUrl: 'view/team.html'
        })
        .state('main.disastermap', {
            url: '/disastermap',
            templateUrl: 'view/disastermap.html'
        })
        .state('main.createdisaster', {
            url: '/createdisaster',
            templateUrl: 'view/createdisaster.html'
        })
        .state('main.disasterdetail', {
            url: '/disasterdetail',
            templateUrl: 'view/disasterdetail.html'
        })
        .state('main.site', {
            url: '/site',
            templateUrl: 'view/site.html'
        })
        .state('main.disasterinspector', {
            url: '/disasterinspector',
            templateUrl: 'view/disasterinspector.html'
        })
        .state('main.disasterdriver', {
            url: '/disasterdriver',
            templateUrl: 'view/disasterdriver.html'
        })
        .state('main.driverlocation', {
            url: '/driverlocation',
            templateUrl: 'view/driverlocation.html'
        })
        .state('main.review', {
            url: '/review',
            templateUrl: 'view/review.html'
        })
        .state('main.batchaddorder', {
            url: '/batchaddorder',
            templateUrl: 'view/batchaddorder.html'
        })
        .state('main.totleorder', {
            url: '/totleorder',
            templateUrl: 'view/totleorder.html'
        })
        .state('main.disasterorderlist', {
            url: '/disasterorderlist',
            templateUrl: 'view/disasterorderlist.html'
        })
        .state('main.driverordertotle', {
            url: '/driverordertotle',
            templateUrl: 'view/driverordertotle.html'
        })
        .state('main.evaluation', {
            url: '/evaluation',
            templateUrl: 'view/evaluation.html'
        })
        .state('main.nar_location', {
            url: '/nar_location',
            templateUrl: 'view/nar_location.html'
        })
        .state('main.fixaddress', {
            url: '/fixaddress',
            templateUrl: 'view/fixaddress.html'
        })
        .state('main.adddriver', {
            url: '/adddriver',
            templateUrl: 'view/adddriver.html'
        })
        .state('main.detail', {
            url: '/detail',
            templateUrl: 'view/detail.html'
        })
        .state('main.map', {
            url: '/map',
            templateUrl: 'view/map.html'
        })
        .state('main.disaster', {
            url: '/disaster',
            templateUrl: 'view/disaster.html'
        })
        .state('main.orderlist', {
            url: '/orderlist',
            templateUrl: 'view/orderlist.html'
        })
        .state('main.track', {
            url: '/track',
            templateUrl: 'view/track.html'
        })
        .state('main.addorder.map', {
            url: '/map',
            templateUrl: 'view/map.html'
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
            closeloading();
            goto_view('login');

        }, 2000);
    }
    if (err.data.http_status == 400) {
        layer.msg(err.data.message);
        closeloading();
    }
    if (err.data.http_status >= 500) {
        layer.msg('网络出现问题了，请刷新重试');
        closeloading();
    }
}
function getString(url) {
    var type = url.split('=');
    return type[1];
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
insurance.filter('SecondOrder', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {

            return '是';
        } else {
            return '否';
        }
    }
    return ToLocal;
});
insurance.filter('Arrive', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            return '未到达'
        } else {
            return '已到达';
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
        if (array == null) {
            return '';
        } else {
            return array[0].driverName + ' - ' + array[0].driverPhone;
        }


    }
    return ToLocal;
});
insurance.filter('DisasterShi', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[0] + string.split('#')[1];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterQu', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[2];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterProvince', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[0];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterCity', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[1];
        }


    }
    return ToLocal;
});
insurance.filter('Drivers', function () {

    function ToLocal(array) {
        var drivers = '';
        var a = '';
        if (array == null) {
            return '';
        } else {
            for (var i = 0; i < array.length; i++) {
                a = array[i].driverName + ' - ' + array[i].driverPhone;
                drivers = drivers + a + ';';

            }

            return drivers;

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
            case 81:
                return '保险人员取消'
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
insurance.filter('TaskStatus', function () {
    function TaskStatus(text) {
        switch (parseInt(text)) {
            case 1:
                return '派遣审核中'
                break;
            case 2:
                return '前往事故地点'
                break;
            case 3:
                return '审核未通过'
                break;
            default:
                break;
        }
    }
    return TaskStatus;
});
insurance.filter('TaskFlag', function () {
    function TaskFlag(text) {
        switch (parseInt(text)) {
            case 0:
                return '任务结束'
                break;
            case 2:
                return '前往目的地点'
                break;
            case 4:
                return '审核未通过'
                break;
            case 1:
                return '前往事故地点'
                break;
            case 8:
                return '查勘取消'
                break;
            case 81:
                return '保险人员取消'
                break;
            case 9:
                return '任务取消'
                break;
            case 7:
                return '管理员取消'
                break;
            case 6:
                return '公里数未填写'
                break;
            default:
                break;
        }
    }
    return TaskFlag;
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
insurance.filter('AccidentCarNoType', function () {
    function Price(text) {
        if (text != 1) {
            return null;
        } else {
            return '挂';
        }
    }
    return Price;
});
insurance.filter('ServiceItems', function () {
    var a = '';
    function ServiceItems(array) {
        a = '';
        if (array != null) {
            for (var i = 0; i < array.length; i++) {
                if (i == array.length - 1) {
                    a = a + array[i];
                } else {
                    a = a + array[i] + '+';
                }
            }
            return a;
        } else {
            return '';
        }
    }
    return ServiceItems;
})
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
insurance.filter('Shi', function () {
    function Shi(address) {
        if (address == null || address.length == 0) {
            return null;
        } else {
            address = address.replace(/-/g, "");
            if (address.indexOf('省') != -1) {
                if (address.indexOf('市') != -1) {
                    return address.substring(address.indexOf('省') + 1, address.indexOf('市'));
                } else {
                    return null;
                }
            } else {
                if (address.indexOf('市') != -1) {
                    return address.substring(0, address.indexOf('市'));
                } else {
                    return null;
                }

            }
        }

    }
    return Shi;
});
insurance.filter('Qu', function () {
    function Qu(address) {
        if (address == null || address.length == 0) {
            return null;
        } else {
            address = address.replace(/-/g, "");
            if (address.indexOf('省') != -1) {
                if (address.indexOf('市') != -1) {
                    if (address.indexOf('区') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('区'));
                    } else if (address.indexOf('县') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('县'));
                    }

                } else {
                    return null;
                }
            } else {
                if (address.indexOf('市') != -1) {
                    if (address.indexOf('区') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('区'));
                    } else if (address.indexOf('县') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('县'));
                    }
                } else {
                    return null;
                }

            }
        }

    }
    return Qu;
});
var index;
function loading() {
    index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}
function closeloading() {
    layer.close(index);
}
function contains(e, d) {
    for (var i = 0; i < e.length; i++) {
        if (d == e[i]) {
            return true;
        }
    }
}

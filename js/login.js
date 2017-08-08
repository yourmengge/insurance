var login = angular.module('login', ['Road167']);

login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        if ($scope.name != null && $scope.password != null) {
            loading();
            APIService.login($scope.name, $scope.password).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg('登录成功');
                    sessionStorage.setItem('lmId', 1)
                    sessionStorage.setItem('funcList', res.data.funcList)

                    if (contains(res.data.funcList, 1) || contains(res.data.funcList, 1001)) {
                        sessionStorage.setItem('zhipaidiaodu', 1);
                    } else {
                        sessionStorage.setItem('zhipaidiaodu', 0);
                    }

                    setTimeout(function () {
                        goto_view('main');
                    }, 1000);
                }
                isError(res)
            })
        } else {
            layer.msg('账号密码不能为空')
        }

    }
    // $(document).keydown(function (e) {
    //     console.log(e.keyCode);
    //     var theEvent = e || window.event;
    //     var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    //     if (code == 13 || code == 108) {
    //         $scope.login();
    //         return false;
    //     }
    //     return true;
    // });
    $scope.keydown = function (e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13 || code == 108) {
            $scope.login();
            return false;
        }
        return true;
    }
    function contains(e, d) {
        for (var i = 0; i < e.length; i++) {
            if (d == e[i]) {
                return true;
            }
        }
    }
}])
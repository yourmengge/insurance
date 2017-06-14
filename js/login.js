var login = angular.module('login', ['Road167']);
Array.prototype.contains = function (e) {
    for (i = 0; i < this.length && this[i] != e; i++);
    return !(i == this.length);
}
login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        if ($scope.name != null && $scope.password != null) {
            loading();
            APIService.login($scope.name, $scope.password).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg('登录成功');
                    sessionStorage.setItem('lmId', 1)
                    if (res.data.funcList.contains(1)) {
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
}])
var login = angular.module('login', ['Road167']);
login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        APIService.login($scope.name, $scope.password).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('登录成功');
                sessionStorage.setItem('lmId', 1)
                setTimeout(function () {
                    goto_view('renbao_main/addorder');
                }, 1000);
            }
            isError(res)
        })
    }
}])
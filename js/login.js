var login = angular.module('login', ['Road167']);
login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        APIService.login($scope.name, $scope.password).then(function (res) {
            if(res.data.http_status == 200){
                layer.msg('登录成功');
                setTimeout(function() {
                    g
                }, 1000);
            }
        })
    }
}])
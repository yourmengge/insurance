var main = angular.module('renbao_main', ['Road167']);
main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $('.left_menu p').click(function () {
        $(this).addClass('left_menu_click').siblings().removeClass('left_menu_click');
        sessionStorage.setItem('lmId', $(this).attr('id'));
    })
    $scope.logout = function () {
        APIService.user_logout().then(function (res) {
            if(res.data.result_status == 0){
                layer.msg('退出成功');
                setTimeout(function() {
                    goto_view('login')
                }, 2000);
            }
        })
    }
    $scope.initData = function () {
        $scope.companyName = sessionStorage.getItem('companyName');
        $scope.adminName = sessionStorage.getItem('adminName');
        $('#' + sessionStorage.getItem('lmId')).addClass('left_menu_click').siblings().removeClass('left_menu_click');
    }
}])
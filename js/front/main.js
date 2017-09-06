var main = angular.module('main', ['Road167']);
main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $('.left_menu p').click(function () {
        $(this).addClass('left_menu_click').siblings().removeClass('left_menu_click');
        sessionStorage.setItem('lmId', $(this).attr('id'));
        sessionStorage.setItem('jiexi_success', '');
        sessionStorage.removeItem('filter')
        sessionStorage.removeItem('disaster_filter');
        // sessionStorage.removeItem('nar_address');
        // sessionStorage.removeItem('nar_address_fixaddress');
    })
    $scope.logout = function () {
        APIService.user_logout().then(function (res) {
            if (res.data.result_status == 0) {
                layer.msg('退出成功');
                // sessionStorage.removeItem('nar_address');
                // sessionStorage.removeItem('nar_address_fixaddress');
                a = [];
                setTimeout(function () {
                    goto_view('login')
                }, 2000);
            }
        })
    }
    $scope.goto = function () {
        goto_view('main/disaster')
    }
    $scope.initData = function () {
        $scope.isShop4SAdmin = sessionStorage.getItem('isShop4sAdmin');
        $scope.isThrid = sessionStorage.getItem('isThrid');
        if ($scope.isShop4SAdmin == 'true' || $scope.isThrid == 'true') {
            $('.left_menu p').css('display', 'none');
            $scope.isShop4SAdmin = 'true';
            $scope.companyName = sessionStorage.getItem('companyName');
            $scope.adminName = sessionStorage.getItem('adminName');
        } else {
            $('.left_menu p').css('display', 'none')
            $scope.companyName = sessionStorage.getItem('companyName');
            $scope.adminName = sessionStorage.getItem('adminName');
            $('#' + sessionStorage.getItem('lmId')).addClass('left_menu_click').siblings().removeClass('left_menu_click');
            APIService.get_menu().then(function (res) {
                if (res.data.http_status == 200) {
                    if (res.data.items != null) {
                        for (var i = 0; i < res.data.items.length; i++) {
                            $('.left_menu .' + res.data.items[i].url).css('display', 'block')
                            $('.left_menu .payment').css('display', 'block')
                        }
                    }

                } else {
                    isError(res)
                }
            })

        }

    }
}])
var payment = angular.module('payment', ['Road167']);
payment.controller('paymentCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.limit = limit;
        $scope.offset = 0;
        $scope.name = '';
        $scope.page_p = show;
        $scope.status = 'THIRD_ALL';
        $scope.ordertype = '';
        $scope.current = 1;
        $scope.get_payment_list();
    }
    $scope.get_payment_list = function () {
        APIService.get_payment_list($scope.offset, $scope.limit, $scope.name, $scope.ordertype, $scope.status).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                //分页部分
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
                }
                $scope.up = hide;
                $scope.page_show();
            } else {
                isError(res);
            }
        })
    }
    $scope.page_show = function () {
        if ($scope.current == 1) {
            $scope.down = show;
            $scope.up = hide;
        } else if ($scope.current == $scope.pageCount) {
            $scope.down = hide;
            $scope.up = show;
        } else {
            $scope.down = show;
            $scope.up = show;
        }
    }
    $scope.statusTexts = [{
        id: 'THIRD_ALL',
        name: '显示全部'
    }, {
        id: 'THIRD_PENDING_PAY',
        name: '待付款'
    }, {
        id: 'THIRD_PAYED',
        name: '已付款'
    }]
    $scope.orderTypeTexts = [{
        id: '',
        name: '显示全部'
    }, {
        id: 3,
        name: '查勘员'
    }, {
        id: 7,
        name: '保险公司管理员'
    }]
    $scope.search = function () {
        $scope.current = 1;
        $scope.offset = 0;
        $scope.get_payment_list();
    }
    $scope.detail = function (orderNo) {
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'not');
        goto_view('main/payment/detail');
    }
    $scope.paymentdetail = function (orderNo, orderFrom) {
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('orderFrom', orderFrom);
        goto_view('main/payment/paymentdetail');
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
        }
        if (type == 'up') {
            $scope.current = $scope.current - 1;
        }
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + '/order/payment/bill?BillStatus=' + $scope.status + '&createName=' + $scope.name + '&createRoleId=' + $scope.ordertype, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])
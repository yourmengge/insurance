var audit = angular.module('audit', ['Road167']);
audit.controller('auditCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
    $scope.initData = function () {
        $scope.verifyType = sessionStorage.getItem('audit_type');
        if ($scope.verifyType == 'BILL') {
            $scope.statusTexts = $scope.statusTexts2;
            $scope.title = '发票'
        } else {
            $scope.statusTexts = $scope.statusTexts1;
            $scope.title = '报价'
        }

        $scope.fleetName = '';
        $scope.status = 1;
        $scope.limit = limit;
        $scope.offset = 0;
        $scope.current = 1;
        $scope.get_order_quote_list();
    }
    $scope.searchAll = function () {
        APIService.get_order_quote_list($scope.verifyType, $scope.fleetName, '', $scope.limit, $scope.offset).then(function (res) {
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
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    //查看详情
    $scope.detail = function (data) {
        sessionStorage.setItem('orderNo', data.orderNo)
        sessionStorage.setItem('audit_orderNo', data.orderNo)
        sessionStorage.setItem('audit_address', data.accidentAddress)
        sessionStorage.setItem('audit_fix', data.fixAddress)
        sessionStorage.setItem('audit_fleetName', data.grabFleetName)
        sessionStorage.setItem('billStatus', data.settleStatus)
        if ($scope.verifyType == 'BILL') {
            goto_view('main/auditB/detailB')
        } else {
            goto_view('main/auditQ/detailQ')
        }
    }
    //获取列表
    $scope.get_order_quote_list = function () {
        APIService.get_order_quote_list($scope.verifyType, $scope.fleetName, $scope.status, $scope.limit, $scope.offset).then(function (res) {
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
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    //查询
    $scope.search = function () {
        $scope.offset = 0;
        $scope.current = 1;
        $scope.get_order_quote_list();
    }
    $scope.Page = function (type) {
        $scope.openDetail = -1;
        if (type == 'home') {
            $scope.current = 1;

        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;

        }
        if (type == 'down') {
            $scope.current = $scope.current + 1;

        }
        if (type == 'up') {
            $scope.current = $scope.current - 1;

        }
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + '/order-quote/list/third?VerifyType=' + $scope.verifyType + '&fleetName=' + $scope.fleetName + '&verifyStatus=' + $scope.status, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
            } else {
                isError(res)
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
    $scope.statusTexts1 = [{
        id: 1,
        name: '待审核'
    }, {
        id: 3,
        name: '审核不通过'
    }, {
        id: 2,
        name: '审核通过'
    }, {
        id: '',
        name: '显示全部'
    }]

    $scope.statusTexts2 = [{
        id: 1,
        name: '待审核'
    }, {
        id: 3,
        name: '审核不通过'
    }, {
        id: '',
        name: '显示全部'
    }]
}])
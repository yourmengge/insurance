var disasterorderlist = angular.module('disasterorderlist', ['Road167']);
disasterorderlist.controller('disasterorderlistCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    $scope.statusTexts = [
        { id: 'ALL', name: '全部订单' },
        { id: 'BE_GRAB', name: '待接单' },
        { id: 'DOING', name: '进行中' },
        { id: 'FINISH', name: '已完成' },
        { id: 'CANCEL', name: '已取消' }
    ]
    $scope.editOrder = function (data) {
        goto_view('main/editorder');
        sessionStorage.setItem('editorder', JSON.stringify(data));
        sessionStorage.setItem('location_lat', data.accidentLatitude);
        sessionStorage.setItem('location_lng', data.accidentLongitude);
        sessionStorage.setItem('location_address', data.accidentAddress);
        sessionStorage.setItem('isDisaster', 'yes');
    }
    $scope.detail = function (orderNo) {
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'yes');
        goto_view('main/detail');
    }
    $scope.initData = function () {
        var today = time.getTime();
        $('#startDay').val(ToLocalTime(today - 2678400000));
        $('#endDay').val(ToLocalTime(today));
        $scope.get_date();
        $scope.status = 0;
        $scope.caseNo = '';
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.status = sessionStorage.getItem('disasterstatus_site');
        $scope.areaList = sessionStorage.getItem('disaster_area')
        $scope.status2 = 'ALL'
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.get_disaster_order_list($scope.disasterId, $scope.status2, '', '', '')
    }

    //查看大灾订单列表
    $scope.get_disaster_order_list = function (disasterId, status, startDay, endDay, caseNo) {
        APIService.get_disaster_order_list(disasterId, status, startDay, endDay, caseNo, limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res)
            }
        })
    }
    $scope.search = function () {
        $scope.get_date();
        $scope.get_disaster_order_list($scope.disasterId, $scope.status2, $scope.start, $scope.endDay, $scope.caseNo).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.orderCounts == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.list = res.data.items;
                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.orderCounts / limit);
                    if ($scope.pageCount <= 1) {
                        $scope.page_p = hide;
                    } else {
                        $scope.page_p = show;
                    }
                    $scope.up = hide;
                    //分页结束
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.get_date = function () {
        var startDate = $('#startDay').val();
        var endDate = $('#endDay').val();
        $scope.start = startDate.split("-");
        $scope.endDay = endDate.split("-");
        $scope.start = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
        $scope.endDay = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
    }
    $scope.toexcel = function () {
        $("#table2excel").table2excel({
            // 不被导出的表格行的CSS class类
            exclude: ".noExl",
            // 导出的Excel文档的名称
            name: "Excel Document Name",
            // Excel文件的名称
            filename: "下载"
        });
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
            $scope.up = hide;
            $scope.down = show;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
            $scope.up = show;
            $scope.down = hide;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
            if ($scope.current == $scope.pageCount) {
                $scope.down = hide;
            }
        }
        if (type == 'up') {
            $scope.down = show;
            $scope.current = $scope.current - 1;
            if ($scope.current == 1) {
                $scope.up = hide;
            }
        }
        loading();
        APIService.paging(urlV1 + '/order/disaster/list?disasterId=' + $scope.disasterId + '&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&OrderStatus2=' + $scope.status2 + '&caseNo=' + $scope.caseNo, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
    $scope.cancel = function (orderNo) {
        if (confirm('确定要取消订单吗')) {
            loading();
            APIService.cancel_order(orderNo).then(function (res) {
                if (res.data.http_status == 200) {
                    $scope.orderList = res.data.orderList;
                    layer.msg('取消订单成功');
                    closeloading();
                    $scope.initData();
                } else {
                    isError(res);
                }
            })
        }
    }
}])
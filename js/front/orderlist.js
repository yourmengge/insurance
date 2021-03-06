var orderlist = angular.module('orderlist', ['Road167']);
var time = new Date();
orderlist.controller('orderlistCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        var today = time.getTime();
        $('#startDay').val(ToLocalTime(today - 2678400000));
        $('#endDay').val(ToLocalTime(today));
        $scope.get_date();
        $scope.status = 0;
        $scope.caseNo = '';
        APIService.get_order_list(10, $scope.start, $scope.endDay, 0, '').then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.orderList = res.data.orderList;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.orderCounts / limit);
                if (res.data.orderCounts <= limit) {
                    $scope.page_p = hide;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    $scope.editOrder = function (data) {
        goto_view('main/editorder');
        sessionStorage.setItem('editorder', JSON.stringify(data));
        sessionStorage.setItem('location_lat',data.accidentLatitude);
        sessionStorage.setItem('location_lng',data.accidentLongitude);
        sessionStorage.setItem('location_address',data.accidentAddress)
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
    $scope.search = function () {
        loading();
        $scope.get_date();
        APIService.get_order_list(10, $scope.start, $scope.endDay, $scope.status, $scope.caseNo).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.orderCounts == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.orderList = res.data.orderList;
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
    $scope.detail = function (orderNo) {
        sessionStorage.setItem('orderNo', orderNo);
        goto_view('main/detail');
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
        APIService.paging(urlV1 + third + urlOrder + '?$limit=' + limit + '&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&status=' + $scope.status + '&caseNo=' + $scope.caseNo, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if(res.data.http_status == 200){
                closeloading();
                $scope.orderList = res.data.orderList;
            }else{
                isError(res)
            }
            
        })
    }
    $scope.statusTexts = [
        { id: 0, name: '全部订单' },
        { id: 1, name: '待接单' },
        { id: 2, name: '待分配' },
        { id: 3, name: '进行中' },
        { id: 4, name: '已完成' },
        { id: 7, name: '后台取消' },
        { id: 8, name: '查勘取消' },
        { id: 9, name: '历史未完成' }
    ]
    $scope.cancel = function (orderNo) {
        if (confirm('确定要取消订单吗')) {
            loading();
            APIService.cancel_order(orderNo).then(function (res) {
                if (res.data.http_status == 200) {
                    $scope.orderList = res.data.orderList;
                    layer.msg('取消订单成功');
                    $scope.initData();
                } else {
                    isError(res);
                }
            })
        }
    }
}])
var disasterorderlist = angular.module('disasterorderlist', ['Road167']);
disasterorderlist.controller('disasterorderlistCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
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
    $scope.openDiv = function (index) {
        if ($scope.openDetail == index) {
            $scope.openDetail = -1;
        } else {
            $scope.openDetail = index;
        }

    }
    $scope.editOrder = function (data) {
        goto_view('main/editorder');
        sessionStorage.setItem('editorder', JSON.stringify(data));
        sessionStorage.setItem('location_lat', data.accidentLatitude);
        sessionStorage.setItem('location_lng', data.accidentLongitude);
        sessionStorage.setItem('location_address', data.accidentAddress);
        sessionStorage.setItem('isDisaster', 'yes');
    }
    $scope.reset_date = function () {
        var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
        var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
        $('#startDay').val('20' + s)
        $('#endDay').val('20' + e)
    }
    $scope.detail = function (orderNo) {
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'yes');
        goto_view('main/detail');
    }
    $scope.initData = function () {
        $scope.table = show;
        $scope.page_p = show;
        $scope.tips = '';
        $scope.openDetail = -1;
        $scope.nowTime = new Date().getTime();
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
        if (JSON.parse(sessionStorage.getItem('filter')) != null) {
            var a = JSON.parse(sessionStorage.getItem('filter'))
            $scope.start = a.startDate;
            $scope.endDay = a.endDate;
            $scope.status2 = a.status2;
            $scope.caseNo = a.keyword;
            $scope.reset_date();
        }
        $scope.get_disaster_order_list($scope.disasterId, $scope.status2, $scope.start, $scope.endDay, $scope.caseNo)
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
                    $scope.table = show;
                    $scope.tips = ''
                    $scope.page_p = show;
                    $scope.down = show;
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
        filter.endDate = $scope.endDay;
        filter.keyword = $scope.caseNo;
        filter.startDate = $scope.start;
        filter.status2 = $scope.status2;
        sessionStorage.setItem('filter', JSON.stringify(filter));
        APIService.get_disaster_order_list($scope.disasterId, $scope.status2, $scope.start, $scope.endDay, $scope.caseNo, 10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                    $scope.page_p = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.list = res.data.items;
                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.count / limit);
                    if ($scope.pageCount <= 1) {
                        $scope.page_p = hide;
                    } else {
                        $scope.page_p = show;
                        $scope.down = show;
                    }
                    $scope.up = hide;
                    //分页结束
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.searchAll = function () {
        sessionStorage.removeItem('filter');
        $scope.initData();
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
        window.open(host + urlV1 + '/order/export/disaster?disasterId=' + $scope.disasterId + '&OrderStatus2=' + $scope.status2 + '&$limit=999&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&keyword=' + $scope.caseNo + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
        //window.open('http://dev.road167.com:8080/extrication/v1/order/export');
        // APIService.export().then(function (res) {
        //     console.log(res.data);
        // })
        // $http({
        //     method: 'GET',
        //     url: host + urlV1 + '/order/export/disaster?disasterId=' + $scope.disasterId + '&OrderStatus2=' + $scope.status2 + '&$limit=99&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&caseNo=' + $scope.caseNo,
        //     headers: {
        //         "Content-Type": undefined,
        //         "Authorization": APIService.token,
        //         "user-id": APIService.userId
        //     },
        //     responseType: 'blob',
        // }).then(function (res) {
        //     var blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        //     console.log(blob)
        //     var a = document.createElement("a");
        //     document.body.appendChild(a);
        //     a.download = '订单.xls';
        //     a.href = URL.createObjectURL(blob);
        //     a.click();
        // })
        // $("#table2excel").table2excel({
        //     // 不被导出的表格行的CSS class类
        //     exclude: ".noExl",
        //     // 导出的Excel文档的名称
        //     name: "Excel Document Name",
        //     // Excel文件的名称
        //     filename: "下载"
        // });
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
        APIService.paging(urlV1 + '/order/disaster/list?disasterId=' + $scope.disasterId + '&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&OrderStatus2=' + $scope.status2 + '&keyword=' + $scope.caseNo, limit, type, $scope.pageCount, $scope.current).then(function (res) {
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
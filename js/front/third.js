var third = angular.module('third', ['Road167']);
var time = new Date();

third.controller('thirdCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
    $scope.initData = function () {
        $scope.table = show;
        $scope.openDetail = -1;
        $scope.tips = '';
        loading();
        $scope.page_p = show;
        var today = time.getTime();
        $('#startDay').val(ToLocalTime(today - 2678400000));
        $('#endDay').val(ToLocalTime(today));
        $scope.get_date();
        $scope.status = 0;
        $scope.ordertype = '';
        $scope.caseNo = '';
        $scope.current = 1;
        if (sessionStorage.getItem('filter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('filter'))
            $scope.start = a.startDate;
            $scope.endDay = a.endDate;
            $scope.status = a.status;
            $scope.caseNo = a.keyword;
            $scope.ordertype = a.ordertype;
            if (a.order_current != '') {
                $scope.current = a.order_current;
            }
            $scope.reset_date();
        }
        $scope.get_order_list();

    }
    $scope.get_order_list = function () {
        APIService.get_order_list_third(10, $scope.start, $scope.endDay, $scope.status, $scope.caseNo, $scope.ordertype, ($scope.current - 1) * 10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.orderList = res.data.orderList;
                //分页部分

                $scope.pageCount = Math.ceil(res.data.orderCounts / limit);
                if (res.data.orderCounts <= limit) {
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
    $scope.reset_date = function () {
        var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
        var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
        $('#startDay').val('20' + s)
        $('#endDay').val('20' + e)
    }
    $scope.openDiv = function (index) {
        if ($scope.openDetail == index) {
            $scope.openDetail = -1;
        } else {
            $scope.openDetail = index;
        }

    }
    $scope.editOrder = function (data) {
        goto_view('main/editorder');
        $scope.save_filter();
        sessionStorage.setItem('editorder', JSON.stringify(data));
        sessionStorage.setItem('location_lat', data.accidentLatitude);
        sessionStorage.setItem('location_lng', data.accidentLongitude);
        sessionStorage.setItem('location_address', data.accidentAddress);
        sessionStorage.setItem('isDisaster', 'not');
    }
    $scope.toexcel = function (status, caseNo) {
        window.open(host + urlV1 + '/order/export/third?status=' + $scope.status + '&orderType=' + $scope.ordertype + '&$limit=999&startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&keyword=' + $scope.caseNo + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
        //window.open('http://dev.road167.com:8080/extrication/v1/order/export');
        // APIService.export().then(function (res) {
        //     console.log(res.data);
        // })
        // $http({
        //     method: 'GET',
        //     url: host + urlV1 + '/order/export/third?status=' + $scope.status + '&$limit=999&startDay=' + $scope.start + '&endDay=' + $scope.endDay  + '&keyword=' + $scope.caseNo,
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
    $scope.isNum = function (e) {//限制输入0到100的正整数
        var preventDefault = function () {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox 
            }
        }
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57))) {//限制输入数字

        } else {
            preventDefault();
        }
    }
    $scope.jump = function () {
        if ($scope.input_jump > $scope.pageCount) {
            alert('传送失败')
        } else {
            $scope.current = $scope.input_jump;
            $scope.get_order_list();
        }
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.save_filter();

        $scope.openDetail = -1;
        loading();
        APIService.get_order_list_third(10, $scope.start, $scope.endDay, $scope.status, $scope.caseNo, $scope.ordertype, ($scope.current - 1) * 10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.orderCounts == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                    $scope.page_p = hide;
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
                        $scope.down = show;
                    }
                    $scope.up = hide;
                    $scope.page_show();
                    //分页结束
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.save_filter = function () {
        $scope.get_date();
        filter.endDate = $scope.endDay;
        filter.keyword = $scope.caseNo;
        filter.startDate = $scope.start;
        filter.status = $scope.status;
        filter.ordertype = $scope.ordertype;
        filter.order_current = $scope.current;
        sessionStorage.setItem('filter', JSON.stringify(filter));
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
        $scope.save_filter();
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'not');
        goto_view('main/detail');
    }
    $scope.Page = function (type) {
        if ($scope.start - $scope.endDay <= 0) {
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

            $scope.save_filter();
            $scope.page_show();
            loading();
            APIService.paging(urlV1 + urlThird + urlOrder + '?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&status=' + $scope.status + '&orderType=' + $scope.ordertype + '&keyword=' + $scope.caseNo + '&insuranceType=THIRD_CAR', limit, type, $scope.pageCount, $scope.current).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    $scope.orderList = res.data.orderList;
                } else {
                    isError(res)
                }
            })
        } else {
            layer.msg('开始时间应在结束时间之前');
        }

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
    $scope.statusTexts = [
        { id: 0, name: '全部订单' },
        { id: 1, name: '待接单' },
        { id: 2, name: '待分配' },
        { id: 3, name: '进行中' },
        { id: 4, name: '已完成' },
        { id: 8, name: '查勘取消' },
        { id: 81, name: '保险人员取消' },
        { id: 9, name: '历史未完成' }
    ]
    $scope.orderTypeTexts = [
        { id: '', name: '全部' },
        { id: 1, name: '事故订单' },
        { id: 2, name: '非事故订单' },
        { id: 3, name: '非施救' }
    ]
    $scope.searchAll = function () {
        sessionStorage.removeItem('filter');
        $scope.initData();
    }
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
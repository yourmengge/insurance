var datastatistics = angular.module('datastatistics', ['Road167']);
datastatistics.controller('datastatisticsCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.fleetName = '';
        $scope.start = ''
        $scope.end = ''
        $scope.startMonth = '';
        $scope.endMonth = '';
        $scope.limit = limit;
        $scope.offset = 0;
        $scope.current = 1;
        loading();
        $scope.get_data_list();
    }
    //获取统计列表
    $scope.get_data_list = function () {
        APIService.get_data_list($scope.fleetName, $scope.start, $scope.end, $scope.limit, $scope.offset).then(function (res) {
            closeloading();
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
                if (res.data.count != 0) {
                    loading();
                    $scope.get_timecount_average();
                } else {
                    $scope.timeDetail.avgCreateToGrab = 0;
                    $scope.timeDetail.avgGrabToDepartureTime = 0;
                    $scope.timeDetail.avgDepartureToAccident = 0;
                    $scope.timeDetail.avgOperationTime = 0;
                }
            } else {
                isError(res)
            }
        })
    }
    //获取时间统计-均值统计
    $scope.get_timecount_average = function () {
        APIService.get_timecount_average($scope.fleetName, $scope.start, $scope.end).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.timeDetail = res.data;
            } else {
                isError(res)
            }
        })
    }
    $scope.openDiv = function (index, orderNo) {
        if ($scope.openDetail == index) {
            $scope.openDetail = -1;
        } else {
            $scope.openDetail = index;
            $scope.get_data_detail(orderNo);
        }

    }

    //获取时间统计-派遣列表
    $scope.get_data_detail = function (orderNo) {
        APIService.get_data_detail(orderNo).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detailList = res.data.items;
            } else {
                isError(res)
            }
        })
    }

    $scope.search = function () {
        $scope.offset = 0;
        $scope.current = 1;
        if ($scope.startMonth != '' && $scope.endMonth != '') {
            var start = new Date($scope.startMonth);
            var end = new Date($scope.endMonth)
            $scope.start = DateFormat('yyMM', start);
            $scope.end = DateFormat('yyMM', end);
        }

        $scope.get_data_list();
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
        APIService.paging(urlV1 + '/time-count/order?fleetName=' + $scope.fleetName + '&startMonth=' + $scope.start + '&endMonth=' + $scope.end, limit, type, $scope.pageCount, $scope.current).then(function (res) {
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
}])
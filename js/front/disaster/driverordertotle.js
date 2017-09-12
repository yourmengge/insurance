var driverordertotle = angular.module('driverordertotle', ['Road167']);
driverordertotle.controller('driverordertotleCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $scope.initData = function () {
        $scope.key = '';
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.get_disaster_driver_order('', limit, '', $scope.disasterId, '')
    }

    //查询大灾司机（订单统计）
    $scope.get_disaster_driver_order = function (key, limit, status, disasterId, grabData) {
        APIService.get_disaster_driver_order(key, limit, status, disasterId, grabData).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items
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
        $scope.get_disaster_driver_order($scope.key, limit, '', $scope.disasterId, $('#startDay').val()).then(function (res) {
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
        APIService.paging(urlV1 + '/disaster-driver/list?key=' + $scope.key + '&DisasterDriverStatus=' + '&disasterId=' + $scope.disasterId + '&grabDate=' + $('#startDay').val() + '&statisOrder=true', limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
    $scope.detail = function(data){
        sessionStorage.setItem('select_driver_userId',data.userId)
        sessionStorage.setItem('select_driver_name',data.userName)
        sessionStorage.setItem('select_driver_phone',data.userPhone)
        goto_view('main/disasterdriverorderlist')
        
    }

}])
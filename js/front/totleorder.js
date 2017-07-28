var totleorder = angular.module('totleorder', ['Road167']);
totleorder.controller('totleorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    $scope.statusTexts = [
        { id: '', name: '全部' },
        { id: 0, name: '待启用' },
        { id: 1, name: '进行中' },
        { id: 2, name: '已关闭' }
    ]
    $scope.initData = function () {
        $scope.status = '';

        $scope.disasterNo = '';
        $('#startDay').val('')
        $scope.get_disaster_totle_list('', '', '', '');
    }
    $scope.site = function (id, area, status, url,need) {
        sessionStorage.setItem('disasterId_site', id);
        sessionStorage.setItem('driver_need_site', need);
        sessionStorage.setItem('disasterstatus_site', status);
        var title = id + '-' + area.split('#')[1] + area.split('#')[2];
        sessionStorage.setItem('disaster_title', title)
        sessionStorage.setItem('disaster_area', area.split('#')[2])
        goto_view('main/' + url)
    }
    $scope.search_disaster = function () {
        if ($scope.disasterNo != '') {
            if (!isNaN($scope.disasterNo)) {
                $scope.get_disaster_totle_list($('#startDay').val(), '', $scope.status, $scope.disasterNo)
            } else {
                $scope.get_disaster_totle_list($('#startDay').val(), $scope.disasterNo, $scope.status, '')
            }
        } else {
            $scope.get_disaster_totle_list($('#startDay').val(), '', $scope.status, '')
        }
    }
    //获取订单统计列表
    $scope.get_disaster_totle_list = function (startDate, area, status, disasterId) {
        APIService.get_disaster_totle_list(startDate, area, status, disasterId, limit, 0).then(function (res) {
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
        var disasterId = ''; var area = '';
        if (!isNaN($scope.disasterNo)) {
            disasterId = $scope.disasterNo

        } else {
            area = $scope.disasterNo
        }
        APIService.paging(urlV1 + urlDisaster + '?statisOrder=true&startDate=' + $('#startDay').val() + '&areaDesc=' + area + '&disasterId=' + disasterId + '&status=' + $scope.status, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items
            } else {
                isError(res)
            }

        })
    }

}])
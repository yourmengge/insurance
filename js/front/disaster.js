var disaster = angular.module('disaster', ['Road167']);
disaster.controller('disasterCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.statusTexts = [
        { id: '', name: '全部' },
        { id: 0, name: '待启用' },
        { id: 1, name: '进行中' },
        { id: 2, name: '已关闭' }
    ]
    $scope.initData = function () {
        if (sessionStorage.getItem('createFirst') == 'yes') {
            setTimeout(function () {
                alert('请点击“场地”，“查勘”设置保全场地和大灾查勘员')
                sessionStorage.removeItem('createFirst')
            }, 1000);

        }
        $scope.status = '';
        $scope.disasterNo = '';
        $('#startDay').val('')
        $scope.get_disaster_list('', '', '', '')
    }
    $scope.get_disaster_list = function (startDate, area, status, disasterId) {
        APIService.get_disaster_list(startDate, area, status, disasterId, 10, 0).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    //查询大灾列表
    $scope.search_disaster = function () {
        if ($scope.disasterNo != '') {
            if (!isNaN($scope.disasterNo)) {
                $scope.get_disaster_list($('#startDay').val(), '', $scope.status, $scope.disasterNo)
            } else {
                $scope.get_disaster_list($('#startDay').val(), $scope.disasterNo, $scope.status, '')
            }
        } else {
            $scope.get_disaster_list($('#startDay').val(), '', $scope.status, '')
        }
    }
    $scope.site = function (id, area, status, url, need) {
        sessionStorage.setItem('disasterId_site', id);
        sessionStorage.setItem('driver_need_site', need);
        sessionStorage.setItem('disasterstatus_site', status);
        var title = id + '-' + area.split('#')[1] + area.split('#')[2];
        sessionStorage.setItem('disaster_title', title)
        sessionStorage.setItem('disaster_area', area.split('#')[2])
        goto_view('main/' + url)
    }
    $scope.start = function (data) {
        if (data.status == 0) {
            $scope.url = '/open/';
            $scope.message = '启用'
        } else {
            $scope.url = '/close/';
            $scope.message = '关闭'
        }
        if (confirm('确定要' + $scope.message + '大灾(' + data.disasterId + '-' + data.areaDesc.split('#')[2] + ')吗？')) {
            APIService.start_disaster($scope.url, data.disasterId).then(function (res) {
                if (res.data.http_status == 200) {
                    $scope.initData();
                } else {
                    isError(res)
                    $scope.initData();
                }
            })
        } else {
            $scope.initData();
        }

    }
    $scope.viewdetail = function (a) {
        sessionStorage.setItem('disasterId', a)
        goto_view('main/disasterdetail')
    }

    $scope.isChecked = function (status) {
        if (status == 1) {
            return true;
        }
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
        APIService.paging(urlV1 + urlDisaster + '?statisUser=true&startDate=' + $('#startDay').val() + '&areaDesc=' + area + '&disasterId=' + disasterId + '&status=' + $scope.status, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items
            } else {
                isError(res)
            }

        })
    }
}])
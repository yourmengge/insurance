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
        $scope.page_p = show;
        $scope.current = 1;
        $scope.status = '';
        $scope.disasterNo = '';
        if (sessionStorage.getItem('disaster_filter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('disaster_filter'))
            $scope.disasterNo = a.keyword;
            $scope.current = a.disaster_current;
            $scope.status = a.status;
        }
        if($scope.disasterNo )
        $('#startDay').val('')
        $scope.get_disaster_list('', '', $scope.status, '')
    }
    $scope.get_disaster_list = function (startDate, area, status, disasterId) {
        APIService.get_disaster_list(startDate, area, status, disasterId, 10, 0).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items
                //分页部分
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
        $scope.current = 1;
        $scope.save_filter();
        if ($scope.disasterNo != '') {
            if (!isNaN($scope.disasterNo)) {//判断是否为数字，数字表示编号搜索，非数字表示区域搜索
                $scope.get_disaster_list($('#startDay').val(), '', $scope.status, $scope.disasterNo)
            } else {
                $scope.get_disaster_list($('#startDay').val(), $scope.disasterNo, $scope.status, '')
            }
        } else {
            $scope.get_disaster_list($('#startDay').val(), '', $scope.status, '')
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
    $scope.removeSession = function(){
        sessionStorage.removeItem('disaster_filter');
    }
    $scope.save_filter = function(){
        disaster_filter.disaster_current = $scope.current;
        disaster_filter.status = $scope.status;
        sessionStorage.setItem('disaster_filter',JSON.stringify(disaster_filter))
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
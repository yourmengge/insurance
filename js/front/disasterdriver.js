var disasterdriver = angular.module('disasterdriver', ['Road167']);
disasterdriver.controller('disasterdriverCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $('#selected button').click(function () {
        $(this).addClass('selected_button_click').siblings().removeClass('selected_button_click');
    })

    $scope.initData = function () {
        $scope.type = '司机';
        $scope.message = '支持司机姓名和手机号码模糊查询';
        $scope.urlType = ''
        $scope.searchStatus = '';
        $scope.driverNeedcount = sessionStorage.getItem('driver_need_site');
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.status = sessionStorage.getItem('disasterstatus_site');
        $scope.areaList = sessionStorage.getItem('disaster_area')
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.area = $scope.areaList.split(';')[0];
        $scope.arealist = $scope.areaList.split(';');
        $scope.key = '';
        $scope.get_disaster_driver($scope.urlType, '', limit, '', $scope.disasterId)
    }
    $scope.searchAll = function(){
        $scope.get_disaster_driver($scope.urlType, '', limit, '', $scope.disasterId)
    }
    $scope.get_disaster_driver = function (type, key, limit, status, disasterId) {
        APIService.get_disaster_driver(type, key, limit, status, disasterId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.driverlist = res.data.items;
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
                isError(res)
            }
        })
    }
    $scope.add_disaster_driver = function () {
        if (!isPhone.test($scope.phone)) {
            layer.msg('电话号码不合法')
        } else {
            var data = {
                "phone": $scope.phone,
                "name": $scope.name
            }
            APIService.add_disaster_driver($scope.disasterId, data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('添加司机成功');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }

    }
    $scope.add = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').css('display', 'block')
    }
    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.update_inspector').css('display', 'none')
    }
    //退出大灾
    $scope.out = function (a) {
        if (a.userName == null || a.userName == '') {
            $scope.info = a.userPhone;
        } else {
            $scope.info = a.userName + '-' + a.userPhone;
        }
        if (confirm('确定把' + $scope.info + '退出大灾吗？')) {
            var data = {
                "disasterId": $scope.disasterId,
                "driverUserIdList": []
            }
            data.driverUserIdList.push(a.userId)
            APIService.delete_disaster_driver(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('退出成功');
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    isError(res);
                }
            })
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
        APIService.paging(urlV1 + '/disaster-driver/list?key=' + $scope.key + '&DisasterDriverStatus=' + $scope.searchStatus + '&disasterId=' + $scope.disasterId + $scope.urlType, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.driverlist = res.data.items
            } else {
                isError(res)
            }

        })
    }
    $scope.statusTexts = [{
        id: '', name: '全部司机'
    }, {
        id: 'ARRIVED', name: '已到达'
    }, {
        id: 'UNARRIVE', name: '未到达'
    }, {
        id: 'LEAVED', name: '已退出'
    }]
    $scope.change_search = function (type) {
        if (type === 'driver') {
            $scope.type = '司机';
            $scope.message = '支持司机姓名和手机号码模糊查询';
            $scope.urlType = ''
        } else {
            $scope.type = '车队';
            $scope.message = '支持车队名字和调度手机号码模糊查询';
            $scope.urlType = '&fleet=true'
        }
    }
    $scope.search = function () {
        APIService.get_disaster_driver($scope.urlType, $scope.key, limit, $scope.searchStatus, $scope.disasterId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.driverlist = res.data.items;
            } else {
                isError(res)
            }
        })
    }
    $scope.detail = function (data) {
        sessionStorage.setItem('select_driver_userId', data.userId)
        sessionStorage.setItem('select_driver_name', data.userName)
        sessionStorage.setItem('select_driver_phone', data.userPhone)
        goto_view('main/disasterdriverorderlist')

    }
}])
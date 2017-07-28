var disasterdetail = angular.module('disasterdetail', ['Road167']);
disasterdetail.controller('disasterdetailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        goto_view('main/disaster')
    }

    $scope.initData = function () {
        $scope.get_disaster_detail();

    }

    $scope.forEach = function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
            if (data.length > 3) {
                array.push(data[i])
                if (i == 2) {
                    return array;
                }
            } else {
                return data;
            }
        }
    }
    $scope.site = function (id, area, status, url,need) {
        sessionStorage.setItem('disasterId_site', id);
        sessionStorage.setItem('disasterstatus_site', status);
        var title = id + '-' + area.split('#')[1] + area.split('#')[2];
        sessionStorage.setItem('disaster_title', title)
        sessionStorage.setItem('driver_need_site', need);
        sessionStorage.setItem('disaster_area', area.split('#')[2])
        goto_view('main/' + url)
    }
    //获取大灾详情
    $scope.get_disaster_detail = function () {
        APIService.get_disaster_detail(sessionStorage.getItem('disasterId')).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                if (res.data.status == 2) {
                    $scope.message2 = '查看'
                } else {
                    $scope.message2 = '管理'
                }
                $scope.driver_need_conut = $scope.detail.driverNeedCnt;
                $scope.disasterName = res.data.disasterId + '-' + res.data.areaDesc.split('#')[2];

                $scope.site_counts = res.data.addressCount;
                $scope.siteList = res.data.addressList

                $scope.inspector_counts = res.data.inspectorCount;
                $scope.inspectorList = res.data.inspectorList

                $scope.driver_counts = res.data.driverCount;
                $scope.driverList = res.data.driverList
            } else {
                isError(res)
            }

        })
    }
    //修改司机需求量
    $scope.updatenum = function () {
        APIService.update_driver_need($scope.detail.disasterId, $scope.driver_need_conut).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('修改成功')
                $scope.get_disaster_detail();
            } else {
                isError(res)
            }
        })
    }

    $scope.$watch('driver_need_conut', function (newValue) {
        if (newValue != '' && newValue != undefined) {
            if (newValue > 1000 || newValue < 1) {
                layer.msg('设置的司机人数必须在1~1000之内')
                $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            } else if (newValue < $scope.detail.driverNeedCnt) {
                layer.msg('只能增加司机数量')
                $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            } else {
                $('#submit').removeAttr("disabled").removeClass('button_disabled');
            }
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    })

    //关闭，开启大灾
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
                    $scope.get_disaster_detail();
                } else {
                    isError(res)
                }
            })
        }

    }
}])
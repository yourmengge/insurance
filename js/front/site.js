var site = angular.module('site', ['Road167']);
site.controller('siteCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    $scope.addSite = function () {
        sessionStorage.setItem('map_type', 'add');
        goto_view('main/disastermap')
    }

    $scope.initData = function () {
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.status = sessionStorage.getItem('disasterstatus_site');
        $scope.get_disaster_address_list();
    }

    //获取保全场地列表
    $scope.get_disaster_address_list = function () {
        APIService.get_disaster_address_list($scope.disasterId, limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                }else{
                    $scope.page_p = show;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res)
            }
        })
    }
    //删除保全场地
    $scope.delete_disaster_address = function (id, abbr) {
        if (confirm('你确定要将“' + abbr + '”删除吗？本操作不可恢复'))
            APIService.delete_disaster_address(id).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('删除成功')
                    $scope.get_disaster_address_list();
                } else {
                    isError(res)
                }
            })
    }

    //修改保全场地
    $scope.update_disaster_address = function (data) {
        goto_view('main/disastermap');
        sessionStorage.setItem('map_type', 'update');
        sessionStorage.setItem('map_id', data.id);
        sessionStorage.setItem('map_address', data.address);
        sessionStorage.setItem('map_remark', data.addressAbbr);
        sessionStorage.setItem('map_lat', data.latitude);
        sessionStorage.setItem('map_lng', data.longitude);
    }

    //地图定位
    $scope.location = function (data) {
        $('.alert_bg').css('display','block');
        $('.disadter_location').css('display','block');
        $scope.lng = data.longitude;
        $scope.lat = data.latitude;
        var map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point($scope.lng, $scope.lat), 13);
        var marker = new BMap.Marker(new BMap.Point($scope.lng, $scope.lat)); // 创建标注，为要查询的地方对应的经纬度
        map.addOverlay(marker);
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    }
    $scope.close = function(){
        $('.alert_bg').css('display','none');
        $('.disadter_location').css('display','none');
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
        APIService.paging(urlV1 +  urlDisasterAddress + '/page?disasterId=' + $scope.disasterId, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items
            } else {
                isError(res)
            }

        })
    }
}])
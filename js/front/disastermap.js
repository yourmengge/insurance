var map_disaster = angular.module('disastermap', ['Road167']);
var map, localSearch;

map_disaster.controller('disastermapCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.panduan();
        $scope.initMap();
    }
    //初始化地图
    $scope.initMap = function () {
        map = new BMap.Map("allmap");
        map.addEventListener("click", showInfo);//监听点击事件，在地图上展示标记
        localSearch = new BMap.LocalSearch(map);
        setTimeout(function () {
            if ($scope.map_type == 'update') {
                map.centerAndZoom(new BMap.Point($scope.lng, $scope.lat), 13);
                var marker = new BMap.Marker(new BMap.Point($scope.lng, $scope.lat)); // 创建标注，为要查询的地方对应的经纬度
                map.addOverlay(marker);
            } else {
                // var geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function (r) {
                //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                //         map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 13);
                //     }
                // }, { enableHighAccuracy: true })
                function myFun(result) {
                    var cityName = result.name;
                    map.centerAndZoom(new BMap.Point(result.center.lng, result.center.lat), 13);
                    // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    //     
                    // }
                }
                var myCity = new BMap.LocalCity();
                myCity.get(myFun);
            }

        }, 1000);
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    }
    //判断是修改还是添加
    $scope.panduan = function () {
        $scope.map_type = sessionStorage.getItem('map_type');
        if ($scope.map_type == 'update') {//判断是修改界面还是新增界面
            $scope.text = '修改';
            $scope.searchName = sessionStorage.getItem('map_address');
            $scope.remark = sessionStorage.getItem('map_remark');
            $scope.lng = sessionStorage.getItem('map_lng');
            $scope.lat = sessionStorage.getItem('map_lat');
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $scope.text = '添加'
        }
    }


    //监听地点名输入框是否为空
    $scope.$watch('searchName', function (newValue) {
        if (newValue != null && newValue != '') {
            $scope.tips1 = 1;
        } else {
            $scope.tips1 = 0;
        }
    })
    //监听备注输入框是否为空
    $scope.$watch('remark', function (newValue) {
        if (newValue != null && newValue != '') {
            $scope.tips2 = 1;
        } else {
            $scope.tips2 = 0;
        }
    })
    //监听两个输入框是否都不为空
    $scope.$watch('tips2 + tips1', function (newValue) {
        if (newValue == 2) {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        }
    })
    /**
     * 在地图上展示搜索的地点
     */
    $scope.findPlace = function () {
        map.clearOverlays(); //清空原来的标注
        var keyword = $scope.searchName;
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            if (poi == undefined) {
                alert('未找到该地址，请点击地图选取位置')
            } else {
                $scope.lat = poi.point.lat;
                $scope.lng = poi.point.lng;
                map.centerAndZoom(poi.point, 15);
                var marker = new BMap.Marker(new BMap.Point($scope.lng, $scope.lat)); // 创建标注，为要查询的地方对应的经纬度
                map.addOverlay(marker);
            }
        });
        localSearch.search(keyword);
    }
    /**
     * 添加新的地点
     */
    $scope.add = function () {
        var data = {
            disasterId: sessionStorage.getItem('disasterId_site'),
            address: $scope.searchName,
            addressAbbr: $scope.remark,
            longitude: $scope.lng,
            latitude: $scope.lat
        }
        if (data.longitude == null || data.longitude == '') {
            layer.msg('请填写地址，并查询该地址是否存在');
        } else if (data.addressAbbr == '' || data.addressAbbr == null) {
            layer.msg('请填写地址简称');
        } else {
            loading();
            if ($scope.map_type == 'update') {
                data.id = sessionStorage.getItem('map_id');
                APIService.update_disaster_address(data).then(function (res) {
                    if (res.data.http_status == 200) {
                        closeloading();
                        layer.msg('修改成功');
                        window.history.back();
                    } else {
                        isError(res);
                    }
                })
            } else {
                APIService.add_disaster_address(data).then(function (res) {
                    if (res.data.http_status == 200) {
                        closeloading();
                        layer.msg('添加成功');
                        window.history.back();
                    } else {
                        isError(res);
                    }
                })
            }

        }

    }
    /**
     *返回上页 
     */
    $scope.goBack = function () {
        window.history.back();
    }
    /**
     * 在地图上展示点
     */
    var showInfo = function (e) {
        map.clearOverlays(); //清空原来的标注
        var geoc = new BMap.Geocoder();
        $scope.lat = e.point.lat;
        $scope.lng = e.point.lng;
        var pt = e.point;
        map.centerAndZoom(e.point, 17);
        var marker = new BMap.Marker(new BMap.Point($scope.lng, $scope.lat)); // 创建标注，为要查询的地方对应的经纬度
        map.addOverlay(marker);
        geoc.getLocation(pt, function (rs) {
            $scope.addComp = rs.addressComponents;
            $scope.searchName = $scope.addComp.province + $scope.addComp.city + $scope.addComp.district
                + $scope.addComp.street + $scope.addComp.streetNumber;
            $('#searchName').val($scope.searchName);
        });

    }
}])
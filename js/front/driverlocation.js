var driverlocation = angular.module('driverlocation', ['Road167']);
var map;
driverlocation.controller('driverlocationCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    $scope.initData = function () {
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.initMap();
        $scope.get_driver_track_list($scope.disasterId, '', 'ALL');
        $scope.status = 'ALL'
    }
    $scope.selectdriver = function (a) {
        $scope.driverName = a.userName;
        $scope.driverStatus = a.statusDesc;
        $scope.driverTime = a.modify_time;
        $scope.driverSpeed = a.latest_location.speed;
        if (a.latest_location.direction <= 45 || a.latest_location.direction > 315) {
            $scope.driverDirection = '北'
        } else if (a.latest_location.direction > 45 && a.latest_location.direction <= 135) {
            $scope.driverDirection = '东'
        } else if (a.latest_location.direction > 135 && a.latest_location.direction <= 225) {
            $scope.driverDirection = '南'
        } else if (a.latest_location.direction > 225 && a.latest_location.direction <= 315) {
            $scope.driverDirection = '西'
        }
        $scope.pt = new BMap.Point(a.latest_location.longitude, a.latest_location.latitude)
        $scope.jiexi($scope.pt,a.latest_location.longitude, a.latest_location.latitude);


    }
    $scope.statusTexts = [{ id: 'ALL', name: '全部' }, { id: 'IDLE', name: '空闲' }, { id: 'BUSY', name: '任务中' }]
    $scope.initMap = function () {
        map = new BMap.Map("allmap");
        // var geolocation = new BMap.Geolocation();
        // geolocation.getCurrentPosition(function (r) {
        //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //         map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 13);
        //         $scope.addOverlays(r.point.lng, r.point.lat);
        //     }
        //     else {
        //         alert('failed' + this.getStatus());
        //     }
        // }, { enableHighAccuracy: true })
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    }
    $scope.addOverlays = function (lng, lat) {
        var sContent =
            "<h4 class='detail_title' style='width:300px;'>司机信息</h4>" +
            "<p>名字：" + $scope.driverName + "</p><p>状态：" + $scope.driverStatus +
            "</p><p>地址：" + $scope.address + "</p><p>时间：" + $scope.driverTime +
            "</p><p>车速：" + $scope.driverSpeed + "km/h</p><p>方向：" + $scope.driverDirection + "</p>";
        var marker = new BMap.Marker(new BMap.Point(lng, lat)); // 创建标注，为要查询的地方对应的经纬度
        map.clearOverlays();
        map.addOverlay(marker);
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        marker.openInfoWindow(infoWindow);
        infoWindow.redraw();
        marker.addEventListener("click", function () {
            this.openInfoWindow(infoWindow);
            //图片加载完毕重绘infowindow
            document.getElementById('imgDemo').onload = function () {
                infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
            }
        })
    }

    //获取鹰眼中司机列表
    $scope.get_driver_track_list = function (disasterId, key, status) {
        APIService.get_driver_track_list(disasterId, key, status).then(function (res) {
            $scope.list = res.data.entities;
        })
    }
    var geoc = new BMap.Geocoder();
    //经纬度解析成地名
    $scope.jiexi = function (pt,lng,lat) {
        geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents;
            $scope.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            $scope.addOverlays(lng, lat);
        });
    }


}])
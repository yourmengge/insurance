var track = angular.module('track', ['Road167']);
var map, pnt = [], points = [], color = "red";//轨迹颜色;
track.controller('trackCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.driver = JSON.parse(sessionStorage.getItem('driver_detail'));
        $scope.departureTime = $scope.driver.departureTime;
        $scope.accidentReachTime = $scope.driver.accidentReachTime;
        $scope.taskEndTime = $scope.driver.taskEndTime;
        $scope.driverUserId = $scope.driver.driverUserId;
        $scope.carType = $scope.driver.carType;
        if ($scope.taskEndTime != null) {//任务已完成
            //如果任务结束时间比出发时间大一天以上，任务时间为出发时间加一天
            if ($scope.taskEndTime - $scope.departureTime > 86400000) {
                $scope.taskEndTime = $scope.departureTime + 86400000;
            }
            $scope.track();
            $scope.get_distance($scope.carType);
        } else {
            $scope.nowTime = new Date().getTime();
            $scope.get_location();
        }
    }
    $scope.back = function () {
        window.history.go(-1);
    }
    //获取当前定位
    $scope.get_location = function () {
        $('.distance_div').css('display', 'none')
        map = new BMap.Map("allmap");//实例化地图
        map.enableScrollWheelZoom(true);
        APIService.get_track(parseInt($scope.departureTime), parseInt($scope.nowTime), $scope.driverUserId).then(function (res) {
            if (res.data.status != 0) {
                $scope.error();
            } else if (res.data.points != '') {
                pnt = res.data.points;
                map.centerAndZoom(new BMap.Point(pnt[0], pnt[1]), 15);//展示地图中心位置，中心位置是最后位置的坐标
                marker = new BMap.Marker(new BMap.Point(pnt[0], pnt[1]));  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中
                var label = new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) });
                marker.setLabel(label);
            } else {
                layer.msg('该司机当前未上传位置')
                $scope.error();
            }
        })
    }
    //获取距离
    $scope.get_distance = function (carType) {
        if (carType == 1 || carType == 5) {//吊车
            APIService.get_track($scope.departureTime, $scope.accidentReachTime, $scope.driverUserId).then(function (res) {
                if (res.data.status != 0) {
                    $scope.error();
                } else {
                    console.log(res);
                    $scope.distance = res.data.distance;
                }
            })
        } else {
            APIService.get_track($scope.accidentReachTime, $scope.taskEndTime, $scope.driverUserId).then(function (res) {
                if (res.data.status != 0) {
                    $scope.error();
                } else {
                    console.log(res);
                    $scope.distance = res.data.distance;
                }
            })
        }
    }
    //获取历史轨迹
    $scope.track = function () {
        map = new BMap.Map("allmap");//实例化地图
        map.enableScrollWheelZoom(true);
        APIService.get_track($scope.departureTime, $scope.taskEndTime, $scope.driverUserId).then(function (res) {
            if (res.data.status != 0) {
                alert('该司机未创建entityname');
                $scope.error();
            } else {
                pnt = res.data.points;
                if (points.length < res.data.points.length) {//获取数据，判断是否有新的点，如果有新的点，points.length 会小于 res.points.length,将新增的点添加到points数组中
                    for (var i = 0; i < res.data.points.length; i++) {
                        pnt = res.data.points[i].location;
                        map.centerAndZoom(new BMap.Point(pnt[0], pnt[1]), 15);//展示地图中心位置，中心位置是最后位置的坐标
                        points.push(new BMap.Point(pnt[0], pnt[1]));//将新增的点加入到points中
                    }
                    var polyline = new BMap.Polyline(points, { strokeColor: color, strokeWeight: 3, strokeOpacity: 0.5 });   //创建折线
                    map.addOverlay(polyline);   //增加折线
                }
                myIcon = new BMap.Icon("img/start.png", new BMap.Size(40, 40), { imageOffset: new BMap.Size(6, 0), imageSize: new BMap.Size(40, 40) });//自定义图标
                myIcon2 = new BMap.Icon("img/end.png", new BMap.Size(50, 50), { imageOffset: new BMap.Size(12, -5), imageSize: new BMap.Size(35, 45) });//自定义图标
                startMarker = new BMap.Marker(new BMap.Point(res.data.start_point.longitude, res.data.start_point.latitude), { icon: myIcon });  // 创建标注
                map.addOverlay(startMarker);//添加起点图标
                marker = new BMap.Marker(new BMap.Point(res.data.end_point.longitude, res.data.end_point.latitude), { icon: myIcon2 });  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中

            }
        })
    }
    $scope.error = function () {
        
        var point = new BMap.Point(119.25139470108, 26.10503783703435);
        map.centerAndZoom(point, 16);  // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        var label = new BMap.Label("福建智网通网络公司", { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
    }
}])
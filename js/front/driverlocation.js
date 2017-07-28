var driverlocation = angular.module('driverlocation', ['Road167']);
var map, map2;
 var isInit;
driverlocation.controller('driverlocationCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    $scope.location = function () {
        APIService.get_all_disaster_orders($scope.disasterId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.pending = res.data.orderCntPending;
                $scope.allCounts = res.data.orderCntAll
            } else {
                isError(res);
            }
        })
        isInit = false;
        $('.alert_bg').css('display', 'block');
        $('.disadter_location').css('display', 'block');
        $('.all_driver_list').css('display', 'block');
        $('#allmap').css('display', 'none');
        //$scope.initMap('alldriver')

        map2 = new BMap.Map('alldriver');
        $scope.drawLocation();


    }
    $scope.drawLocation = function () {
        t = setTimeout(function () {
            $scope.drawLocation();
        }, 2000);
        map2.clearOverlays();
        APIService.get_driver_track_list($scope.disasterId, '', 'ALL', limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list_line = [];
                for (let i = 0; i < res.data.entities.length; i++) {
                    $scope.list_line.push(res.data.entities[i]);
                    $scope.showLoaction(res.data.entities[i].latest_location.longitude, res.data.entities[i].latest_location.latitude, res.data.entities[i].userName, res.data.entities[i].userPhone)

                }
                if (isInit == false) {
                    $scope.inteMap2();
                }

            } else {
                isError(res)
            }

        })

    }
    $scope.inteMap2 = function () {
        if ($scope.list_line.length != 0) {
            var point = new BMap.Point($scope.list_line[0].latest_location.longitude, $scope.list_line[0].latest_location.latitude);
        } else {
            alert('当前没有在线司机')
            var point = new BMap.Point(116.404, 39.915);
        }

        map2.centerAndZoom(point, 15);
        map2.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        isInit = true;
    }
    $scope.close = function () {
        $scope.detailDiv = hide;
        $('.alert_bg').css('display', 'none');
        $('.disadter_location').css('display', 'none');
        $('.all_driver_list').css('display', 'none');
        $('#allmap').css('display', 'block');
        clearTimeout(t)
    }
    //提醒司机
    $scope.warn = function (phone) {
        APIService.warn_driver(phone).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('提醒成功')
            } else {
                isError(res)
            }
        })
    }
    //在地图上显示司机的位置
    $scope.showLoaction = function (lng, lat, name, phone) {
        // var myIcon = new BMap.Icon("img/car.png", new BMap.Size(50, 50), { imageOffset: new BMap.Size(0, 0), imageSize: new BMap.Size(50, 50) });
        // var marker = new BMap.Marker(new BMap.Point(lng, lat), { icon: myIcon }); // 创建标注，为要查询的地方对应的经纬度
        var marker = new BMap.Marker(new BMap.Point(lng, lat)); // 创建标注，为要查询的地方对应的经纬度
        map2.addOverlay(marker);
        if (name != '' && name != null) {
            var tag = name + ':' + phone;
        } else {
            var tag = phone
        }
        var label = new BMap.Label(tag, { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);

        marker.addEventListener('click', function (e) {
            $('.map_driver_detail').css('display', 'block');
            var content = marker.getLabel().content + '';
            if (content.length == 11) {
                $scope.detail_driverName = '';
                $scope.detail_driverPhone = content;
            } else {
                $scope.detail_driverName = content.split(':')[0];
                $scope.detail_driverPhone = content.split(':')[1];
            }
            for (var i = 0; i < $scope.list_line.length; i++) {
                if ($scope.detail_driverPhone == $scope.list_line[i].userPhone) {
                    $scope.get_driver_order_list_line($scope.disasterId, $scope.list_line[i].entity_name)
                }
            }
            clearTimeout(t);
            $scope.drawLocation();
        })
    }
    $scope.initData = function () {
        $scope.pick = show;
        $scope.detailDiv = hide;
        $scope.detail_doing = 0;
        $scope.detail_done = 0;
        $scope.detail_cancel = 0;
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.initMap('allmap');
        $scope.get_driver_track_list($scope.disasterId, '', 'ALL', limit);
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.status = 'ALL'
        $scope.key = ''
        $scope.driverName = '';
        $scope.address = '';
        $scope.driverTime = '';
    }
    //获取司机订单统计
    $scope.get_driver_order_list_line = function (disasterId, userId) {
        APIService.get_driver_order_list_line(disasterId, userId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detail_cancel = res.data.orderCntCancel;
                $scope.detail_done = res.data.orderCntFinish;
                $scope.detail_doing = res.data.orderCntDoing;
                $scope.detail_fleetName = res.data.fleetName;
                if (res.data.hasOwnProperty('orderDoing')) {
                    $scope.address = res.data.orderDoing.accidentAddress;
                    $scope.fixaddress = res.data.orderDoing.fixAddress;
                } else {
                    $scope.address = ''
                    $scope.fixaddress = ''
                }
            } else {
                isError(res);
            }
        })
    }
    //查看在线司机位置，选择司机
    $scope.selectdriver2 = function (a) {
        $scope.detailDiv = 0;
        if (a.userName != undefined) {
            $scope.detail_driverName = a.userName;
        } else {
            $scope.detail_driverName = '';
        }
        $scope.detail_driverPhone = a.userPhone;
        var point = new BMap.Point(a.latest_location.longitude, a.latest_location.latitude);
        map2.centerAndZoom(point, 15);
        $scope.get_driver_order_list_line($scope.disasterId, a.entity_name)
    }
    //查看司机位置页面选择司机
    $scope.selectdriver = function (a) {
        if (a.userName != undefined) {
            $scope.driverName = a.userName;
        } else {
            $scope.driverName = '';
        }
        $scope.driverTime = a.modify_time;
        $scope.pt = new BMap.Point(a.latest_location.longitude, a.latest_location.latitude)
        $scope.jiexi($scope.pt, a.latest_location.longitude, a.latest_location.latitude);
    }
    $scope.statusTexts = [{ id: 'ALL', name: '全部' }, { id: 'IDLE', name: '空闲' }, { id: 'BUSY', name: '任务中' }]
    $scope.initMap = function (id) {
        map = new BMap.Map(id);
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
            "<p>名字：" + $scope.driverName + "</p><p>地址：" + $scope.address + "</p><p>时间：" + $scope.driverTime +
            "</p>";
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
    $scope.get_driver_track_list = function (disasterId, key, status, limit) {
        APIService.get_driver_track_list(disasterId, key, status, limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.entities;
                // //分页部分
                // $scope.current = 1;
                // $scope.pageCount = Math.ceil(res.data.userCount / limit);
                // if (res.data.userCount <= limit) {
                //     $scope.page_p = hide;
                // } else {
                //     $scope.page_p = show;
                // }
                // $scope.up = hide;
                // //分页结束
            } else {
                isError(res)
            }

        })
    }
    var geoc = new BMap.Geocoder();
    //经纬度解析成地名
    $scope.jiexi = function (pt, lng, lat) {
        geoc.getLocation(pt, function (rs) {
            var addComp = rs.addressComponents;
            $scope.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            $scope.addOverlays(lng, lat);
        });
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
        APIService.paging(urlV1 + urlDisaster + '?startDate=' + $('#startDay').val() + '&areaDesc=' + area + '&disasterId=' + disasterId + '&status=' + $scope.status, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items
            } else {
                isError(res)
            }

        })
    }

}])
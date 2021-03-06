var detail = angular.module('detail', ['Road167']);
var map, orderPic = [], accidentPic = [], fixPic = [];
detail.controller('detailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        orderPic = []; accidentPic = []; fixPic = [];
        var order = sessionStorage.getItem('orderNo');
        APIService.get_order_detail(order).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                $scope.assignDriverses = res.data.assignDriverses;
                $scope.pictures = $scope.detail.pictures;
                if ($scope.pictures.length != 0) {
                    for (var i = 0; i < $scope.pictures.length; i++) {
                        if ($scope.pictures[i].type == 1) {
                            orderPic.push($scope.pictures[i]);
                            $scope.order_pic = orderPic;
                        } else if ($scope.pictures[i].type == 2) {
                            accidentPic.push($scope.pictures[i]);
                            $scope.accident_pic = accidentPic;
                        } else {
                            fixPic.push($scope.pictures[i]);
                            $scope.fix_pic = fixPic;
                        }
                    }
                    console.log($scope.accident_pic)

                }
            } else {
                isError(res);
            }
        })
    }
    $scope.back = function () {
        window.history.go(-1);
    }
    $scope.openPic = function (path) {
        window.open(path);
    }
    $scope.location = function () {
        $('.closeBg').css('display', 'block');
        $('.detail_map').css('display', 'block');
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point($scope.detail.accidentLongitude, $scope.detail.accidentLatitude), 14);
        map.enableScrollWheelZoom(true);
        $scope.map_location($scope.detail.accidentLatitude, $scope.detail.accidentLongitude, '事故地点');
        $scope.map_location($scope.detail.fixLatitude, $scope.detail.fixLongitude, '拖送地点');
    }
    $scope.closeBG = function () {
        $('.closeBg').css('display', 'none');
        $('.detail_map').css('display', 'none');
    }
    $scope.map_location = function (lat, lng, text) {
        var new_point = new BMap.Point(lng, lat);
        var marker = new BMap.Marker(new_point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        var label = new BMap.Label(text, { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
    }

    $scope.reload = function (paiqianId) {
        loading();
        APIService.reflash_distance(paiqianId).then(function (res) {

            if (res.data.http_status == 200) {
                closeloading();
                layer.msg('同步成功');
                for (var i = 0; i < $scope.assignDriverses.length; i++) {
                    if ($scope.assignDriverses[i].id == paiqianId) {
                        $scope.assignDriverses[i].chargedDistance = res.data.distance;
                    }
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.track = function (data) {
        sessionStorage.setItem('driver_detail', JSON.stringify(data));
        goto_view('main/track')
    }
}])
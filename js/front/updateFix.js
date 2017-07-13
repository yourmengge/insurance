var updateFix = angular.module('updateFix', ['Road167']);
var map, localSearch;
updateFix.controller('updateFixCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        map = new BMap.Map("allmap");
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 13);
            }
        }, { enableHighAccuracy: true })

        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        map.addEventListener("click", showInfo);
        localSearch = new BMap.LocalSearch(map);
        $scope.type = sessionStorage.getItem('addorder_nar_type')
        if ($scope.type == '事故') {
            $scope.sessionStorageName = 'nar_address'
        } else if ($scope.type == '目的') {
            $scope.sessionStorageName = 'nar_address_fixaddress'
        } else if ($scope.type == '车行') {
            $scope.sessionStorageName = 'shop4S'
        }
    }
    $scope.change = function (text) {
        APIService.get_fixaddress_list(text, 3).then(function (res) {
            $scope.searchlist = res.data.items
            $('.add_driver_div_p').css('display', 'block')
        })
    }
    $scope.$watch('searchName', function (newValue) {
        if (newValue != null && newValue != '') {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        }
    })
    $scope.select = function (data) {

        $scope.selectFixLat = data.latitude;
        $scope.selectFixLng = data.longitude;
        $scope.selectFix = data.address;
        $scope.searchName = $scope.selectFix;

        $('.add_driver_div_p').css('display', 'none')
        map.clearOverlays(); //清空原来的标注
        var marker = new BMap.Marker(new BMap.Point($scope.selectFixLng, $scope.selectFixLat)); // 创建标注，为要查询的地方对应的经纬度
        map.addOverlay(marker);
    }
    $scope.goBack = function () {
        window.history.back();
    }
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
            console.log(rs)
            $scope.addComp = rs.addressComponents;
            $scope.searchName = $scope.addComp.province + $scope.addComp.city + $scope.addComp.district
                + $scope.addComp.street + $scope.addComp.streetNumber;
            $('#searchName').val($scope.searchName);
            $scope.selectFixLat = rs.point.lat;
            $scope.selectFixLng = rs.point.lng;
            $scope.selectFix = $scope.searchName;
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        });

    }
    $scope.add = function () {
        var data = {
            "orderNo": sessionStorage.getItem('fixaddress_orderNo'),
            "applyAddress": $scope.selectFix,
            "applyLongitude": $scope.selectFixLng,
            "applyLatitude": $scope.selectFixLat
        }
        APIService.update_fixaddress(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('目的地修改成功！')
                setTimeout(function() {
                    goto_view('main/detail')
                }, 2000);
            } else {
                isError(res)
            }
        })
    }
}])
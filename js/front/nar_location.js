var nar_location = angular.module('nar_location', ['Road167']);
var map, localSearch;
nar_location.controller('nar_locationCtrl', ['$scope', 'APIService', function ($scope, APIService) {
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
        } else {
            $scope.sessionStorageName = 'nar_address_fixaddress'
        }
    }
    $scope.change = function (text) {
        if (text != null && text != '') {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        }
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
            $scope.lat = rs.point.lat;
            $scope.lng = rs.point.lng;
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        });

    }
    $scope.add = function () {
        sessionStorage.setItem($scope.sessionStorageName, $scope.searchName);
        sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.lat);
        sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.lng);
        window.history.back();
    }
}])
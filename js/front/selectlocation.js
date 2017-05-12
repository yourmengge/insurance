var selectlocation = angular.module('selectlocation', ['Road167']);
var map, localSearch;
selectlocation.controller('selectlocationCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        map = new BMap.Map("allmap");
        map.centerAndZoom("厦门", 12);
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        map.addEventListener("click", showInfo);
        localSearch = new BMap.LocalSearch(map);
        $scope.type = sessionStorage.getItem('location_type')
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
        sessionStorage.setItem('location_address',$scope.searchName);
        sessionStorage.setItem('location_lat', $scope.lat);
        sessionStorage.setItem('location_lng', $scope.lng);
        window.history.back();
    }
}])
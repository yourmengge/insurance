var map_div = angular.module('map', ['Road167']);
var map, localSearch;

map_div.controller('mapCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        map = new BMap.Map("allmap");
        map.addEventListener("click", showInfo);
        var top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });// 左上角，添加比例尺
        var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
        localSearch = new BMap.LocalSearch(map);
        setTimeout(function () {
            map.centerAndZoom("福州", 12);
        }, 1000);
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    }
    $scope.change = function(text){
        if(text != null && text != ''){
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        }else{
            $('#add').addClass('button_disabled').attr("disabled",'true');
        }
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
    $scope.add = function () {
        var data = {
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
            APIService.add_fix_address(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('添加成功');
                } else {
                    isError(res);
                }
            })
        }

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
            $scope.addComp = rs.addressComponents;
            $scope.searchName = $scope.addComp.province + $scope.addComp.city + $scope.addComp.district
                + $scope.addComp.street + $scope.addComp.streetNumber;
            $('#searchName').val($scope.searchName);
        });

    }
}])
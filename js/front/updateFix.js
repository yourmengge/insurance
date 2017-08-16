var updateFix = angular.module('updateFix', ['Road167']);
var map, localSearch;
updateFix.controller('updateFixCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $('#selected button').click(function () {
        $(this).addClass('selected_button_click').siblings().removeClass('selected_button_click');
    })
    $scope.initData = function () {
        $scope.guding = false;
        $scope.shop4s_cfg = false;
        APIService.get_company_cfg(sessionStorage.getItem('companyNo')).then(function (res) {
            if (res.data.http_status == 200) {
                for (var i in res.data.items) {
                    if (res.data.items[i].funId == 1003) {
                        $scope.guding = true;

                    }
                    if (res.data.items[i].funId == 1005) {
                        $scope.shop4s_cfg = true;

                    }
                }
            } else {
                isError(res)
            }
        })
        map = new BMap.Map("allmap");
        $scope.select_type = sessionStorage.getItem('select_type')
        if ($scope.select_type == 'update') {
            $scope.selectTitle = '修改';
            $scope.selectTitle2 = '修改'
        } else {
            $scope.selectTitle = '选择';
            $scope.selectTitle2 = '确认'
        }
        $scope.showDiv = 'map'
        $scope.lat = '';
        $scope.shop4s_lat = '';
        $scope.fixaddress_lat = '';
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
        $scope.get_shop4S_list('', 200)
        $scope.get_fix_address('', 200)
        var myCity = new BMap.LocalCity();
        myCity.get(myFun);

        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        map.addEventListener("click", showInfo);
        localSearch = new BMap.LocalSearch(map);
        $scope.type = sessionStorage.getItem('select_map_type')
        if ($scope.type == '目的') {
            $scope.sessionStorageName = 'address_fixaddress'
        } else if ($scope.type == '目的_nar') {
            $scope.sessionStorageName = 'nar_address_fixaddress'
        }
    }
    //在地图上标注地点
    $scope.add_mark = function (lng, lat, text) {
        map.clearOverlays(); //清空原来的标注
        map.centerAndZoom(new BMap.Point(lng, lat), 13);
        var marker = new BMap.Marker(new BMap.Point(lng, lat)); // 创建标注，为要查询的地方对应的经纬度
        map.addOverlay(marker);
        var label = new BMap.Label(text, { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
    }
    //推修厂查询
    $scope.shop4s_btn = function () {
        $scope.get_shop4S_list($scope.searchshop4s, 10)
    }
    //固定目的地查询
    $scope.searchaddress = function () {
        $scope.get_fix_address($scope.searchfixaddress, 10)
    }
    //选择推修厂
    $scope.selectshop4s = function (data) {
        if (data.simpleName == '未找到符合条件的地址') {

        } else {
            $scope.add_mark(data.longitude, data.latitude, data.simpleName)
            $scope.shop4s_lat = data.latitude;
            $scope.shop4s_lng = data.longitude;
            $scope.shop4sId = data.shop4sId;
            sessionStorage.setItem('fixAddress_shop4sId', data.shop4sId)
            $scope.shop4sFullName = data.address + data.simpleName;
        }

    }

    //获取固定目的地列表
    $scope.get_fix_address = function (keyword, limit) {
        APIService.get_fix_address(keyword, limit).then(function (res) {
            if (res.data.http_status == 200) {

                if (res.data.count == 0) {
                    $scope.fixaddressList = [{
                        addressAbbr: '未找到符合条件的地址'
                    }]
                } else {
                    $scope.fixaddressList = res.data.items;
                }
            } else {
                isError(res);
            }
        })
    }
    //选择固定目的地
    $scope.selectaddress = function (data) {
        if (data.addressAbbr == '未找到符合条件的地址') {

        } else {
            $scope.add_mark(data.longitude, data.latitude, data.addressAbbr)
            $scope.fixaddress_lat = data.latitude;
            $scope.fixaddress_lng = data.longitude;
            $scope.fixaddress = data.address + data.addressAbbr;
        }
    }
    $scope.$watch('shop4s_lat', function (newValue) {
        if (newValue != '') {
            $('#shop4s').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#shop4s').addClass('button_disabled').attr("disabled", 'true');
        }
    })
    $scope.$watch('fixaddress_lat', function (newValue) {
        if (newValue != '') {
            $('#fixaddress').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#fixaddress').addClass('button_disabled').attr("disabled", 'true');
        }
    })
    $scope.change = function (text) {
        if (text.length >= $scope.searchLocation.length) {//判断字数增加还是减少

        } else {
            $scope.lat = '';
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        }


    }

    //获取推修厂列表
    $scope.get_shop4S_list = function (keyword, limit) {
        APIService.get_shop4S_list(keyword, limit).then(function (res) {
            if (res.data.http_status == 200) {

                if (res.data.count == 0) {
                    $scope.shop4slist = [{
                        simpleName: '未找到符合条件的地址'
                    }]
                } else {
                    $scope.shop4slist = res.data.items;
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.$watch('lat', function (newValue) {
        if (newValue == '' || newValue == '') {
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        } else {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
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
    $scope.tab = function (type) {
        map.clearOverlays(); //清空原来的标注
        $scope.showDiv = type;
        sessionStorage.removeItem('fixAddress_shop4sId')
    }
    $scope.findPlace = function () {
        map.clearOverlays(); //清空原来的标注
        var keyword = $scope.searchName;
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            if (poi == undefined) {
                alert('未找到该地址，请点击地图选取位置')
            } else {
                $scope.selectFixLat = poi.point.lat;
                $scope.selectFixLng = poi.point.lng;
                $scope.searchLocation = $scope.searchName;

                sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.selectFixLat);
                sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.selectFixLng);
                $('#add').removeClass('button_disabled').removeAttr("disabled");
                map.centerAndZoom(poi.point, 15);
                var marker = new BMap.Marker(new BMap.Point($scope.selectFixLng, $scope.selectFixLat)); // 创建标注，为要查询的地方对应的经纬度
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
            $scope.searchLocation = $scope.searchName;
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.lat);
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.lng);
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        });

    }
    $scope.update = function () {
        if ($scope.select_type == 'update') {
            var data = {
                "orderNo": sessionStorage.getItem('fixaddress_orderNo'),
                "applyAddress": $scope.shop4sFullName,
                "applyLongitude": $scope.shop4s_lng,
                "applyLatitude": $scope.shop4s_lat,
                'shop4sId': $scope.shop4sId
            }
            APIService.update_fixaddress(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('目的地修改成功！')
                    setTimeout(function () {
                        window.history.back();
                    }, 2000);
                } else {
                    isError(res)
                }
            })
        } else {
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.shop4s_lat);
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.shop4s_lng);
            sessionStorage.setItem($scope.sessionStorageName, $scope.shop4sFullName);
            window.history.back();
        }

    }
    $scope.update2 = function () {
        if ($scope.select_type == 'update') {
            var data = {
                "orderNo": sessionStorage.getItem('fixaddress_orderNo'),
                "applyAddress": $scope.fixaddress,
                "applyLongitude": $scope.fixaddress_lng,
                "applyLatitude": $scope.fixaddress_lat
            }
            APIService.update_fixaddress(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('目的地修改成功！')
                    setTimeout(function () {
                        window.history.back();
                    }, 2000);
                } else {
                    isError(res)
                }
            })
        } else {
            sessionStorage.removeItem('fixAddress_shop4sId')
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.fixaddress_lat);
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.fixaddress_lng);
            sessionStorage.setItem($scope.sessionStorageName, $scope.fixaddress);
            window.history.back();
        }

    }
    $scope.add = function () {
        if ($scope.select_type == 'update') {
            var data = {
                "orderNo": sessionStorage.getItem('fixaddress_orderNo'),
                "applyAddress": $scope.searchName,
                "applyLongitude": $scope.selectFixLng,
                "applyLatitude": $scope.selectFixLat
            }
            APIService.update_fixaddress(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('目的地修改成功！')
                    setTimeout(function () {
                        window.history.back();
                    }, 2000);
                } else {
                    isError(res)
                }
            })
        } else {
            sessionStorage.removeItem('fixAddress_shop4sId')
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lat', $scope.selectFixLat);
            sessionStorage.setItem($scope.sessionStorageName + '_nar_lng', $scope.selectFixLng);
            sessionStorage.setItem($scope.sessionStorageName, $scope.searchName);
            window.history.back();
        }

    }
}])
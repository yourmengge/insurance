var createdisaster = angular.module('createdisaster', ['Road167']);
var data; var array ;
createdisaster.controller('createdisasterCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        goto_view('main/disaster')
    }
    $('.disaster_area').click(function () {
        $('.find-div-body').toggle();
    })
    $('.area_btn_close').click(function () {
        $('.find-div-body').toggle();
    })

    //获取省份列表
    $scope.get_province_list = function (id) {
        return APIService.get_province_list(id);
    }
    $scope.initData = function () {
        $scope.get_company_province();
        
        // $scope.get_province_list(1).then(function (res) {
        //     if (res.data.http_status == 200) {
        //         $scope.provinceList = res.data.items;
        //         $scope.province = $scope.provinceRegionId;
        //         $scope.selectCity();
        //     } else {
        //         isError(res)
        //     }
        // })
    }
    //获取城市列表
    $scope.selectCity = function () {
        $scope.get_province_list($scope.provinceId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.cityList = res.data.items;
                $scope.city = res.data.items[0].regionId;
                $scope.selectArea();
                $scope.selectList = [];
            } else {
                isError(res)
            }
        })
    }
    //获取城市区域列表
    $scope.selectArea = function () {
        $scope.get_province_list($scope.city).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.areaList = res.data.items;
                $scope.selectList = [];
            } else {
                isError(res)
            }
        })
    }
    var area = {
        name: '',
        id: ''
    }
    $scope.selectList = [];
    //选择区域
    $scope.select = function (data) {
        area.name = data.regionName;
        area.id = data.regionId;
        $scope.selectList.push(area)

        area = {
            name: '',
            id: ''
        }
    }
    //获取公司省份
    $scope.get_company_province = function () {
        APIService.get_company_province(sessionStorage.getItem('companyId')).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.province = res.data.provinceName;
                $scope.provinceId = res.data.provinceRegionId;
                $scope.selectCity();
            } else {
                isError(res);
            }
        })
    }
    //判断是否选过
    $scope.isSelect = function (data) {
        for (var i = 0; i < $scope.selectList.length; i++) {
            if (data.regionId == $scope.selectList[i].id) {

                return true;
            }
        }
    }
    //删除所选区域
    $scope.delArea = function (index) {
        $scope.selectList.splice(index, 1)
    }

    $scope.$watch('disaster_date', function (newValue) {
        if (newValue != '' && newValue != undefined) {
            $scope.count1 = 1;
        } else {
            $scope.count1 = 0;
        }
    })

    $scope.$watch('disaster_driver', function (newValue) {
        if (newValue != '' && newValue != undefined) {
            if (newValue > 1000 || newValue < 1) {
                layer.msg('设置的司机人数必须在1~1000之内')
                $scope.count2 = 0;
            } else {
                $scope.count2 = 1;
            }
        } else {
            $scope.count2 = 0;
        }
    })

    $scope.$watch('disaster_pay', function (newValue) {
        if (newValue != '' && newValue != undefined) {
            if (newValue.length > 1000) {
                layer.msg('最多可输入1000字')
                $scope.count3 = 0;
            } else {
                $scope.count3 = 1;
            }

        } else {
            $scope.count3 = 0;
        }
    })

    $scope.$watch('selectList', function (newValue) {
        if (newValue.length != 0) {
            $scope.count4 = 1;
        } else {
            $scope.count4 = 0;
        }
    }, true)

    $scope.$watch('count4 + count3 + count2 + count1', function (newValue) {
        if (newValue == 4) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    })

    //创建大灾
    $scope.create_disaster = function () {
        data = {
            "province": $scope.provinceId,
            "city": $scope.city,
            "county": '',
            "startDate": $('#disaster_date').val(),
            "companyNo": sessionStorage.getItem('companyNo'),
            "driverNeedCnt": $scope.disaster_driver,
            "feeDesc": $scope.disaster_pay,
            "remark": $scope.disaster_remark
        }
        $scope.startDate = $('#disaster_date').val()
        $scope.selectAreaName = '';
        array = new Array();
        for (var i = 0; i < $scope.selectList.length; i++) {
            if (i == $scope.selectList.length - 1 || $scope.selectList.length == 1) {
                $scope.selectAreaName = $scope.selectAreaName + $scope.selectList[i].name;
            } else {
                $scope.selectAreaName = $scope.selectAreaName + $scope.selectList[i].name + ';';
            }
            array[i] = $scope.selectList[i].id;
        }

        // for (var i = 0; i < $scope.provinceList.length; i++) {
        //     if ($scope.provinceList[i].regionId == $scope.province) {
        //         $scope.selectProvinceName = $scope.provinceList[i].regionName;
        //     }
        // }
        for (var i = 0; i < $scope.cityList.length; i++) {
            if ($scope.cityList[i].regionId == $scope.city) {
                $scope.selectCityName = $scope.cityList[i].regionName;
            }
        }
        $('.alert_bg').css('display', 'block')
        $('.submit_alert').css('display', 'block')
    }

    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.submit_alert').css('display', 'none')
    }

    //确认创建大灾
    $scope.submit_disaster = function () {
        data.county = array.sort().join(',');
        APIService.create_disaster(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('创建成功！');
                sessionStorage.setItem('createFirst', 'yes')
                setTimeout(function () {
                    goto_view('main/disaster')
                }, 3000);
            } else {
                isError(res)
            }
        })
    }


}])
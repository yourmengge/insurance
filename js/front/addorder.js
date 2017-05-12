var addorder = angular.module('addorder', ['Road167']);
addorder.controller('addorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    // $('.addorder_div').click(function () {
    //     $('.fixaddress_div').css('display', 'none');
    // })
    $scope.change = function () {
        if ($scope.message != null && $scope.message != '') {
            $('#button').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#button').addClass('button_disabled').attr("disabled", 'disabled');
        }
    }
    $scope.analysis = function () {
        if ($scope.message == null || $scope.message == '' || $scope.message == undefined) {
            layer.msg('请粘贴短信');
        } else {
            APIService.analysis($scope.message).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('解析成功');
                    history.pushState({}, "", url + "/#!/main/addorder?type=success");
                    $scope.jiexi = hide;
                    $scope.accident = res.data.accidentAddress;
                    $scope.caseNo = res.data.caseNo;
                    $scope.accidentDriverName = res.data.accidentDriverName;
                    if (res.data.accidentCarNoType == 1) {
                        $scope.accidentCarNo = res.data.accidentCarNo + '挂';
                    } else {
                        $scope.accidentCarNo = res.data.accidentCarNo;
                    }
                    $scope.accidentCarNoType = res.data.accidentCarNoType;
                    $scope.accidentDriverPhone = res.data.accidentDriverPhone;
                    // if ($scope.accident == null || $scope.accidentDriverPhone == null) {
                    //     $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
                    // }
                }
            })
        }
    }
    $scope.addOrder = function () {
        var order = {
            accidentCarNo: $scope.accidentCarNo,
            accidentAddress: $scope.accident,
            fixAddress: $scope.fixAddress,
            accidentDriverName: $scope.accidentDriverName,
            accidentDriverPhone: $scope.accidentDriverPhone,
            caseNo: $scope.caseNo,
            accidentCarNo: $scope.accidentCarNo,
            accidentCarNoType: $scope.accidentCarNoType,
            designateGrabDriverId: '',
            insuranceType: '',
            carType: 2,
            accidentLongitude: 0,
            accidentLatitude: 0,
            fixLatitude: '',
            fixLongitude: ''
        }

        if ($scope.biaodi == true && $scope.sanzhe == true) {//标的车和三者车
            order.insuranceType = 3;
        }
        if ($scope.biaodi == true && $scope.sanzhe == false) {//标的车
            order.insuranceType = 1;
        }
        if ($scope.biaodi == false && $scope.sanzhe == true) {//三者车
            order.insuranceType = 2;
        }
        if ($scope.biaodi == false && $scope.sanzhe == false) {//保险类型未知
            order.insuranceType = 0;
        }
        if (order.accidentCarNo != null) {
            if (order.accidentCarNo.indexOf('挂') > 0) {
                order.accidentCarNo = order.accidentCarNo.replace('挂', '')
                order.accidentCarNoType = 1;
            }
        }

        for (let i = 0; i < $scope.address_list.length; i++) {
            if ($scope.address_list[i].address == $scope.Driver) {
                order.fixLatitude = $scope.address_list[i].latitude;
                order.fixLongitude = $scope.address_list[i].longitude;
            } else {
                order.fixLatitude = sessionStorage.getItem('location_lat');
                order.fixLongitude = sessionStorage.getItem('location_lng');
            }
        }
        for (let i = 0; i < $scope.driver_list.length; i++) {
            if ($scope.driver_list[i].driverMobile == $scope.driverPhone) {
                order.designateGrabDriverId = $scope.driver_list[i].driverUserId
            }
        }
        if (!isPhone.test($scope.accidentDriverPhone)) {
            layer.msg('手机号码格式不正确');
        } else {
            APIService.add_order(order).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('新增订单成功');
                    setTimeout(function () {
                        goto_view('main/orderlist');

                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }

    }
    $scope.addFixAddress = function () {
        var order = {
            accidentCarNo: $scope.accidentCarNo,
            accidentAddress: $scope.accident,
            fixAddress: $scope.fixAddress,
            accidentDriverName: $scope.accidentDriverName,
            accidentDriverPhone: $scope.accidentDriverPhone,
            caseNo: $scope.caseNo,
            accidentCarNo: $scope.accidentCarNo,
            accidentCarNoType: $scope.accidentCarNoType,
            designateGrabDriverId: $scope.Driver,
            insuranceType: '',
            carType: 2,
            accidentLongitude: 0,
            accidentLatitude: 0
        }
        if ($scope.biaodi == true && $scope.sanzhe == true) {//标的车和三者车
            order.insuranceType = 3;
        }
        if ($scope.biaodi == true && $scope.sanzhe == false) {//标的车
            order.insuranceType = 1;
        }
        if ($scope.biaodi == false && $scope.sanzhe == true) {//三者车
            order.insuranceType = 2;
        }
        if ($scope.biaodi == false && $scope.sanzhe == false) {//保险类型未知
            order.insuranceType = 0;
        }
        console.log(order)
        sessionStorage.setItem('addorder_data', JSON.stringify(order));
        sessionStorage.setItem('location_type', '目的')
        goto_view('main/selectlocation');

    }
    $scope.closeBG = function () {
        $('.closeBg').css('display', 'none');
        $('.map_div').css('display', 'none');
        APIService.get_fix_address(200).then(function (res) {
            if (res.data.count != 0) {
                $scope.address_list = res.data.items;
                $scope.fixAddress = res.data.items[0].address;
            }

        })
    }
    $scope.$watch('accident', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts1 = 0;
        } else {
            $scope.counts1 = 1;
        }
    });
    $scope.$watch('accidentDriverPhone', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts2 = 0;
        } else {
            $scope.counts2 = 1;
        }
    });
    $scope.$watch('fixAddress', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts4 = 0;
        } else {
            $scope.counts4 = 1;
        }
    });
    $scope.$watch('Driver', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts3 = 0;
        } else {
            $scope.counts3 = 1;
        }
    });
    $scope.$watch('counts1 + counts2 + counts3 + counts4', function (newValue, oldValue) {
        if (newValue == 4) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    });
    $scope.openFix = function () {
        $('#fixaddress_div').css('display', 'block')
    }
    $scope.closeFix = function () {
        $('#fixaddress_div').css('display', 'none')
    }
    $scope.openDriver = function () {
        $('#driver_div').css('display', 'block')
    }
    $scope.closeDriver = function () {
        $('#driver_div').css('display', 'none')
    }
    $scope.clickFix = function (address) {
        $scope.fixAddress = address;
        $('.fixaddress_div').css('display', 'none');
    }
    $scope.clickDriver = function (name, phone) {
        $scope.Driver = name;
        $scope.driverPhone = phone;
        $('.fixaddress_div').css('display', 'none');
    }
    $scope.initData = function () {
        $scope.biaodi = false;
        $scope.sanzhe = false;
        $scope.counts = 0;
        if (getString(location.href) == 'success') {
            $scope.jiexi = hide;
            var data = JSON.parse(sessionStorage.getItem('addorder_data'));
            if (data != null) {
                $scope.accident = data.accidentAddress;
                $scope.caseNo = data.caseNo;
                $scope.fixAddress = sessionStorage.getItem('location_address')
                $scope.accidentDriverName = data.accidentDriverName;
                $scope.accidentCarNoType = data.accidentCarNoType;
                $scope.accidentCarNo = data.accidentCarNo;
                $scope.Driver = data.designateGrabDriverId;
                $scope.accidentDriverPhone = data.accidentDriverPhone;
                if (data.insuranceType == 1) {
                    $scope.biaodi = true;
                }
                if (data.insuranceType == 2) {
                    $scope.sanzhe = true;
                }
                if (data.insuranceType == 3) {
                    $scope.biaodi = true;
                    $scope.sanzhe = true;
                }
                if (data.insuranceType == 0) {
                    $scope.biaodi == false;
                    $scope.sanzhe == false;
                }
            }
        } else {
            $scope.jiexi = show;
        }
        APIService.get_fix_address(200).then(function (res) {
            if (res.data.count != 0) {
                $scope.address_list = res.data.items;
            }

        })
        APIService.get_fav_driver_list(200).then(function (res) {
            if (res.data.count != 0) {
                $scope.error = 1;
                $scope.counts2 = 1;
                $scope.driver_list = res.data.items;
            } else {
                $scope.error = 0;
            }
        })
    }

}])

// designateGrabUserId 传司机userId


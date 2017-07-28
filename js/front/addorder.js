var addorder = angular.module('addorder', ['Road167']);
var fleet_list;
addorder.controller('addorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    // $('.addorder_div').click(function () {
    //     $('.fixaddress_div').css('display', 'none');
    // })
    fleet_list = [
        {
            bossName: "不指派调度",
            bossPhone: "",
            bossUserId: '',
            companyNo: "",
            fleetId: '不指派调度',
            fleetName: "不指派调度",
            id: ''
        }
    ]
    $scope.order = {
        accidentCarNo: '',
        accidentAddress: '',
        fixAddress: '',
        accidentDriverName: '',
        accidentDriverPhone: '',
        caseNo: '',
        accidentCarNo: '',
        accidentCarNoType: '',
        designateGrabDriverId: '',
        designateGrabUserId: '',
        insuranceType: '',
        carType: 2,
        accidentLongitude: 0,
        accidentLatitude: 0
    }
    // $scope.change = function () {
    //     if ($scope.message != null && $scope.message != '') {
    //         $('#button').removeAttr("disabled").removeClass('button_disabled');
    //     } else {
    //         $('#button').addClass('button_disabled').attr("disabled", 'disabled');
    //     }
    // }
    $scope.selectMap = function () {
        sessionStorage.setItem('select_type', 'addorder')
        goto_view('main/updateFix');
    }
    $scope.analysis = function () {
        sessionStorage.setItem('location_address', '')
        $scope.fixAddress = '';
        if ($scope.message == null || $scope.message == '' || $scope.message == undefined) {
            layer.msg('请粘贴短信');
        } else {
            APIService.analysis($scope.message).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('解析成功');
                    $scope.mode = 2;
                    if ($scope.mode == 2) {
                        $scope.mode2 = true;
                        $scope.mode1 = false;
                    } else {
                        $scope.mode1 = true;
                        $scope.mode2 = false;
                    }
                    // history.pushState({}, "", url + "insurance/#!/main/addorder?type=success");
                    sessionStorage.setItem('jiexi_success', 'success');
                    res.data.designateGrabUserId = '';
                    sessionStorage.setItem('nar_address_fixaddress_nar_lat', res.data.fixLatitude);
                    sessionStorage.setItem('nar_address_fixaddress_nar_lng', res.data.fixLongitude);
                    sessionStorage.setItem('addorder_order', JSON.stringify(res.data));
                    $scope.order = res.data;
                    $scope.order.designateGrabUserId = '';
                    $scope.jiexi = hide;
                    $scope.accident = res.data.accidentAddress;
                    $scope.caseNo = res.data.caseNo;
                    $scope.accidentDriverName = res.data.accidentDriverName;
                    $scope.fixAddress = res.data.fixAddress;
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
        $scope.addressId = sessionStorage.getItem('addressId')
        // var order = {
        //     accidentCarNo: $scope.accidentCarNo,
        //     accidentAddress: $scope.accident,
        //     fixAddress: $scope.fixAddress.split('-')[0],
        //     accidentDriverName: $scope.accidentDriverName,
        //     accidentDriverPhone: $scope.accidentDriverPhone,
        //     caseNo: $scope.caseNo,
        //     accidentCarNo: $scope.accidentCarNo,
        //     accidentCarNoType: $scope.accidentCarNoType,
        //     designateGrabUserId: $scope.GrabUserId,
        //     designateGrabDriverId: $scope.Driver,
        //     insuranceType: '',
        //     carType: 2,
        //     accidentLongitude: 0,
        //     accidentLatitude: 0,
        //     fixLatitude: '',
        //     fixLongitude: '',
        //     chargeMode: $scope.mode
        // }
        // if ($scope.fixAddress.indexOf('-') < 0) {//判断文本框中的地址是通过地图选择还是选择框选择，选择框选择的地址包含‘-’；
        //     $scope.addressId = null;

        // }
        // if ($scope.biaodi == true && $scope.sanzhe == true) {//标的车和三者车
        //     order.insuranceType = 3;
        // }
        // if ($scope.biaodi == true && $scope.sanzhe == false) {//标的车
        //     order.insuranceType = 1;
        // }
        // if ($scope.biaodi == false && $scope.sanzhe == true) {//三者车
        //     order.insuranceType = 2;
        // }
        // if ($scope.biaodi == false && $scope.sanzhe == false) {//保险类型未知
        //     order.insuranceType = 0;
        // }
        if ($scope.order.accidentCarNo != null) {//判断是否是挂车
            if ($scope.order.accidentCarNo.indexOf('挂') > 0) {
                $scope.order.accidentCarNo = $scope.order.accidentCarNo.replace('挂', '')
                $scope.order.accidentCarNoType = 1;
            }
        }
        if ($scope.addressId != null) {//addressId 不为空，该地址是通过选择框获取得到，目的地点的经纬度通过addressId从目的地点列表中获取
            for (var i = 0; i < $scope.address_list.length; i++) {
                if ($scope.address_list[i].id == $scope.addressId) {
                    $scope.order.fixLatitude = $scope.address_list[i].latitude;
                    $scope.order.fixLongitude = $scope.address_list[i].longitude;
                }
            }
        }
        if (!isPhone.test($scope.order.accidentDriverPhone)) {
            layer.msg('手机号码格式不正确');
        } else {
            $scope.order.fixLatitude = sessionStorage.getItem('nar_address_fixaddress_nar_lat');
            $scope.order.fixLongitude = sessionStorage.getItem('nar_address_fixaddress_nar_lng');
            $scope.order.fixAddress = $scope.fixAddress;
            $scope.order.chargeMode = sessionStorage.getItem('chargeMode')
            APIService.add_order($scope.order).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('新增订单成功');
                    sessionStorage.removeItem('nar_address_fixaddress');
                    sessionStorage.removeItem('nar_address_fixaddress_nar_lat');
                    sessionStorage.removeItem('nar_address_fixaddress_nar_lng');
                    sessionStorage.setItem('chargeMode', 2);
                    sessionStorage.setItem('jiexi_success', '');
                    sessionStorage.removeItem('addorder_order');
                    sessionStorage.removeItem('nar_address');
                    sessionStorage.removeItem('location_address');
                    sessionStorage.removeItem('location_lat');
                    sessionStorage.removeItem('location_lng');
                    setTimeout(function () {
                        goto_view('main/orderlist');

                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }

    }
    $scope.change2 = function () {
        sessionStorage.setItem('addorder_order', JSON.stringify($scope.order));
    }
    $scope.change3 = function (type) {
        $scope.counts6 = 1;
        // if ($scope.biaodi == true && $scope.sanzhe == true) {//标的车和三者车
        //     $scope.order.insuranceType = 3;
        // }
        // if ($scope.biaodi == true && $scope.sanzhe == false) {//标的车
        //     $scope.order.insuranceType = 1;
        // }
        // if ($scope.biaodi == false && $scope.sanzhe == true) {//三者车
        //     $scope.order.insuranceType = 2;
        // }
        // if ($scope.biaodi == false && $scope.sanzhe == false) {//保险类型未知
        //     $scope.order.insuranceType = 0;
        // }
        if (type == 1) {
            $scope.order.insuranceType = 1;
        } else {
            $scope.order.insuranceType = 2;
        }
        $scope.insurance = type;
        sessionStorage.setItem('addorder_order', JSON.stringify($scope.order));
    }
    $scope.addFixAddress = function () {
        if ($scope.biaodi == true && $scope.sanzhe == true) {//标的车和三者车
            $scope.order.insuranceType = 3;
        }
        if ($scope.biaodi == true && $scope.sanzhe == false) {//标的车
            $scope.order.insuranceType = 1;
        }
        if ($scope.biaodi == false && $scope.sanzhe == true) {//三者车
            $scope.order.insuranceType = 2;
        }
        if ($scope.biaodi == false && $scope.sanzhe == false) {//保险类型未知
            $scope.order.insuranceType = 0;
        }
        sessionStorage.setItem('addorder_order', JSON.stringify($scope.order));
        sessionStorage.setItem('location_type', '目的')
        goto_view('main/selectlocation');

    }
    // $scope.closeBG = function () {
    //     $('.closeBg').css('display', 'none');
    //     $('.map_div').css('display', 'none');
    //     APIService.get_fix_address('', 200).then(function (res) {
    //         if (res.data.count != 0) {
    //             $scope.address_list = res.data.items;
    //             $scope.fixAddress = res.data.items[0].address;
    //         }

    //     })
    // }
    $scope.$watch('order.accidentAddress', function (accident) {
        if (accident == '' || accident == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts1 = 0;
        } else {
            $scope.counts1 = 1;
        }
    });
    $scope.$watch('order.accidentCarNo', function (accident) {
        if (accident == '' || accident == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts5 = 0;
        } else {
            $scope.counts5 = 1;
        }
    });
    $scope.$watch('order.accidentDriverPhone', function (accidentDriverPhone, oldValue) {
        if (accidentDriverPhone == '' || accidentDriverPhone == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts2 = 0;

        } else {
            if (isPhone.test(accidentDriverPhone)) {
                $scope.counts2 = 1;
            } else {
                $scope.counts2 = 0;
                if (isPhone.test(oldValue)) {
                    layer.msg('电话号码不合法')
                }

            }

        }
    });
    $scope.$watch('fixAddress', function (fixAddress) {
        if (fixAddress == '' || fixAddress == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts4 = 0;
        } else {
            $scope.counts4 = 1;
        }
    });
    // $scope.$watch('Driver', function (newValue, oldValue) {
    //     if (newValue == '' || newValue == null) {
    //         $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
    //         $scope.counts3 = 0;
    //     } else {
    //         $scope.counts3 = 1;
    //     }
    // });
    $scope.$watch('counts1 + counts2  + counts4 + counts5 + counts6', function (newValue, oldValue) {
        if (newValue == 5) {
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
    // $scope.clickFix = function (address, abbr, id) {
    //     $scope.fixAddress = address + '-' + abbr;
    //     sessionStorage.setItem('location_address', $scope.fixAddress)
    //     $scope.change2();
    //     $scope.addressId = id
    //     sessionStorage.setItem('addressId', id)
    //     $('.fixaddress_div').css('display', 'none');
    // }
    $scope.clickDriver = function (name, phone, id) {
        $scope.Driver = name + '-' + phone;
        $scope.driverId = id;
        $('.fixaddress_div').css('display', 'none');
    }
    // $scope.back = function () {
    //     sessionStorage.setItem('jiexi_success', '');
    //     $scope.initData();
    // }
    $scope.chargeMode = function (type) {
        $scope.mode = type;
        sessionStorage.setItem('chargeMode', type);
    }
    $scope.back = function () {
        $scope.jiexi = 0;
        $scope.message = '';
        sessionStorage.setItem('jiexi_success', '')
        sessionStorage.removeItem('nar_address_fixaddress');
        sessionStorage.setItem('addorder_order', '{}');
        sessionStorage.setItem('chargeMode', '');
        sessionStorage.setItem('location_address', '');
        location.reload();
    }
    $scope.reset = function () {
        if (confirm('重置后页面填写的信息将被清空')) {
            sessionStorage.removeItem('nar_address_fixaddress');
            sessionStorage.setItem('addorder_order', '{}');
            sessionStorage.setItem('chargeMode', '');
            sessionStorage.setItem('location_address', '');
            location.reload();
        }
    }
    $scope.initData = function () {

        $scope.message = ''
        var funcList = sessionStorage.getItem('funcList')
        if (contains(funcList, 1) || contains(funcList, 1001)) {
            $scope.diaodu = show;
        } else {
            $scope.diaodu = hide;
        }
        if (sessionStorage.getItem('chargeMode') == '' || sessionStorage.getItem('chargeMode') == null) {
            $scope.mode = 2;
        } else {

            $scope.mode = sessionStorage.getItem('chargeMode');
        }

        if ($scope.mode == 2) {
            $scope.mode2 = true;
            $scope.mode1 = false;
        } else {
            $scope.mode1 = true;
            $scope.mode2 = false;
        }

        console.log(sessionStorage.getItem('addorder_order'))
        if (sessionStorage.getItem('addorder_order') != null) {
            if (JSON.parse(sessionStorage.getItem('addorder_order')).hasOwnProperty('insuranceType')) {
                $scope.insurance = JSON.parse(sessionStorage.getItem('addorder_order')).insuranceType;
            } else {
                $scope.insurance = '';
            }
        }


        // if ($scope.mode == 2) {
        //     $scope.mode2 = true;
        //     $scope.mode1 = false;
        // } else {
        //     $scope.mode1 = true;
        //     $scope.mode2 = false;
        // }
        $scope.counts = 0;
        if (sessionStorage.getItem('jiexi_success') == 'success') {//判断是否解析过短信
            $scope.jiexi = hide;
            var data = JSON.parse(sessionStorage.getItem('addorder_order'));
            if (data.insuranceType != undefined) {
                $scope.counts6 = 1;
            } else {
                $scope.counts6 = 0;
            }
            if (data != null) {

                $scope.order = data;
                // $scope.accident = data.accidentAddress;
                // $scope.caseNo = data.caseNo;
                // $scope.fixAddress = sessionStorage.getItem('location_address');

                if (sessionStorage.getItem('nar_address_fixaddress') != undefined) {
                    $scope.fixAddress = sessionStorage.getItem('nar_address_fixaddress')
                } else {
                    $scope.fixAddress = $scope.order.fixAddress;
                }
                // $scope.accidentDriverName = data.accidentDriverName;
                // $scope.accidentCarNoType = data.accidentCarNoType;
                // $scope.accidentCarNo = data.accidentCarNo;
                // $scope.Driver = data.designateGrabDriverId;
                // $scope.GrabUserId = data.designateGrabUserId;
                // $scope.accidentDriverPhone = data.accidentDriverPhone;

                if (data.insuranceType == 1) {
                    $scope.biaodi = true;
                }
                if (data.insuranceType == 2) {
                    $scope.sanzhe = true;
                }

            }
        } else {
            $scope.jiexi = show;
        }
        APIService.get_fix_address('', 200).then(function (res) {
            if (res.data.count != 0) {
                $scope.address_list = res.data.items;
            }

        })
        // APIService.get_fav_driver_list(200).then(function (res) {
        //     if (res.data.count != 0) {
        //         $scope.error = 1;
        //         $scope.counts2 = 1;
        //         $scope.driver_list = res.data.items;
        //     } else {
        //         $scope.error = 0;
        //     }
        // })
        APIService.get_team_list(200).then(function (res) {
            fleet_list = [
                {
                    bossName: "不指派调度",
                    bossPhone: "",
                    bossUserId: '',
                    companyNo: "",
                    fleetId: '不指派调度',
                    fleetName: "不指派调度",
                    id: ''
                }
            ]
            for (var i = 0; i < res.data.count; i++) {
                res.data.items[i].fleetName = res.data.items[i].fleetName + '-' + res.data.items[i].bossPhone
                fleet_list.push(res.data.items[i]);
            }
            $scope.driver_list = fleet_list;
            if (!$scope.order.hasOwnProperty('designateGrabUserId')) {
                $scope.order.designateGrabUserId = '';
            }

        })
    }

}])

// designateGrabUserId 传司机userId


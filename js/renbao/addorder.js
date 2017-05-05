var addorder = angular.module('addorder', ['Road167']);
addorder.controller('addorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
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
                    $scope.jiexi = hide;
                    $scope.accident = res.data.accidentAddress;
                    $scope.caseNo = res.data.caseNo;
                    $scope.accidentDriverName = res.data.accidentDriverName;
                    if (res.data.accidentCarNoType == 1) {
                        $scope.accidentCarNo = res.data.accidentCarNo + '挂';
                    } else {
                        $scope.accidentCarNo = res.data.accidentCarNo;
                    }

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
            accidentCarNoType: 0,
            designateGrabUserId: $scope.Driver,
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
        if (order.accidentAddress != '' && order.accidentDriverPhone != '' && order.designateGrabUserId != undefined) {
            APIService.add_order(order).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('新增订单成功');
                    setTimeout(function() {
                        goto_view('renbao_main/orderlist')
                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }


    }
    $scope.addFixAddress = function () {
        $('.closeBg').css('display', 'block');
        $('.map_div').css('display', 'block');
        goto_view('renbao_main/addorder/map');
        sessionStorage.setItem('map_type', 'addorder');
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
    $scope.initData = function () {
        $scope.biaodi = false;
        $scope.sanzhe = false
        APIService.get_fix_address(200).then(function (res) {
            if (res.data.count != 0) {
                $scope.address_list = res.data.items;
                $scope.fixAddress = res.data.items[0].address;
            }

        })
        APIService.get_fav_driver_list(200).then(function (res) {
            if (res.data.count != 0) {
                $scope.driver_list = res.data.items;
                $scope.Driver = res.data.items[0].driverUserId;
            }
        })
    }

}])

// designateGrabUserId 传司机userId


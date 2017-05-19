var addorder_nar = angular.module('addorder_nar', ['Road167']);
var order, pic = [], a = [], b = [];
var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');//随机数  
var code = 'a/';
var picPathName = '';
var fleet_list;
addorder_nar.controller('addorder_narCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    fleet_list = [
        {
            bossName: "不指派调度",
            bossPhone: "",
            bossUserId: 1,
            companyNo: "",
            fleetId: '不指派调度',
            fleetName: "不指派调度",
            id: '1'
        }
    ]
    $scope.getPicPathName = function (codeLength) {
        for (var i = 0; i < codeLength; i++) {//循环操作  
            var index = Math.floor(Math.random() * 52);//取得随机数的索引（0~35）  
            code += random[index];//根据索引取得随机数加到code上  
        }
        picPathName = code + '.jpg';
        code = 'a/';
        return picPathName;
    }
    $scope.push = function () {
        var input = document.getElementById("photo");
        pic.push(input.files[0]);
        console.log(pic)
    }
    $scope.readFile = function () {
        loading();
        $scope.push();
        var length = 0;
        var picPath = {
            type: 1,
            path: ''
        }
        var bucket = '';
        var f = document.getElementById("photo").value;
        if (f == "")
        { alert("请上传图片"); return false; }
        else {
            if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(f)) {
                alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
                document.getElementById("photo").value = '';
                return false;
            } else {
                for (var i = 0; i < pic.length; i++) {
                    (function (i) {
                        APIService.get(host + '/v1/aliyun/oss/sts/get-put').then(function (res) {
                            if (res.data.http_status == 200) {
                                var client = new OSS.Wrapper({
                                    region: 'oss-cn-hangzhou',
                                    accessKeyId: res.data.accessKeyId,
                                    accessKeySecret: res.data.accessKeySecret,
                                    bucket: res.data.bucketName,
                                    stsToken: res.data.securityToken
                                });
                                bucket = res.data.bucketName;
                                return client.multipartUpload($scope.getPicPathName(32), pic[i]);
                            } else {
                                throw res;
                            }
                        }).then(function (result) {
                            closeloading();
                            length++;
                            a.push('http://' + bucket + '.oss-cn-hangzhou.aliyuncs.com/' + result.name + '?x-oss-process=style/ZOOM_OUT_VIEW');
                            b.push(result.name);
                            pic = [];
                            $scope.localPic = a;

                        }).catch(function (err) {
                        });

                    })(i);
                }
            }
        }
    }
    $scope.initData = function () {
        $scope.rescueType = {
            type: 'tuoche'
        };

        APIService.get_team_list(200).then(function (res) {
            for (var i = 0; i < res.data.count; i++) {
                res.data.items[i].fleetName = res.data.items[i].fleetName + '-' + res.data.items[i].bossPhone
                fleet_list.push(res.data.items[i]);
            }
            $scope.driver_list = fleet_list;
            $scope.GrabUserId = 1;
        })
        var data = JSON.parse(sessionStorage.getItem('nar_addorder_order'));
        if (data != null) {
            $scope.accident = sessionStorage.getItem('nar_address');
            $scope.caseNo = data.caseNo;
            $scope.fixAddress = sessionStorage.getItem('nar_address_fixaddress')
            $scope.accidentDriverName = data.accidentDriverName;
            $scope.accidentCarNoType = data.accidentCarNoType;
            $scope.accidentCarNo = data.accidentCarNo;
            $scope.accidentDriverPhone = data.accidentDriverPhone;
            $scope.GrabUserId = data.designateGrabUserId;
            $scope.accidentlat = sessionStorage.getItem('nar_address_nar_lat')
            $scope.accidentlng = sessionStorage.getItem('nar_address_nar_lng')
            $scope.fixLatitude = sessionStorage.getItem('nar_address_fixaddress_nar_lat')
            $scope.fixLongitude = sessionStorage.getItem('nar_address_fixaddress_nar_lng')
            $scope.rescueType = {
                type: data.rescueType
            };
        }

        console.log(fleet_list)
    }
    $scope.$watch('rescueType.type', function (newValue) {
        if (newValue == 'tuoche') {
            $scope.fix = show
        } else {
            $scope.fix = hide
        }
    })
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
    $scope.$watch('counts1 + counts2  + counts4', function (newValue, oldValue) {
        if ($scope.fix == show) {
            $scope.counts4 = 1;
        }
        if (newValue == 3) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    });
    $scope.selectMap = function (type) {
        order = {
            accidentCarNo: $scope.accidentCarNo,
            accidentAddress: $scope.accident,
            fixAddress: $scope.fixAddress,
            accidentDriverName: $scope.accidentDriverName,
            accidentDriverPhone: $scope.accidentDriverPhone,
            caseNo: $scope.caseNo,
            accidentCarNo: $scope.accidentCarNo,
            accidentCarNoType: $scope.accidentCarNoType,
            accidentLongitude: $scope.accidentlng,
            accidentLatitude: $scope.accidentlat,
            fixLatitude: $scope.fixLatitude,
            fixLongitude: $scope.fixLongitude,
            designateGrabUserId: $scope.GrabUserId,
            orderType: 2,
            rescueType: $scope.rescueType.type
        }
        if (type == 1) {
            sessionStorage.setItem('addorder_nar_type', '事故');
        } else {
            sessionStorage.setItem('addorder_nar_type', '目的')
        }

        sessionStorage.setItem('nar_addorder_order', JSON.stringify(order));
        goto_view('main/nar_location');
    }
    $scope.addOrder = function () {
        order = {
            accidentCarNo: $scope.accidentCarNo,
            accidentAddress: $scope.accident,
            fixAddress: $scope.fixAddress,
            accidentDriverName: $scope.accidentDriverName,
            accidentDriverPhone: $scope.accidentDriverPhone,
            caseNo: $scope.caseNo,
            accidentCarNo: $scope.accidentCarNo,
            accidentCarNoType: $scope.accidentCarNoType,
            accidentLongitude: $scope.accidentlng,
            accidentLatitude: $scope.accidentlat,
            fixLatitude: $scope.fixLatitude,
            fixLongitude: $scope.fixLongitude,
            designateGrabUserId: $scope.GrabUserId,
            orderType: 2,
            rescueType: '',
            picturePaths: b
        }
        if (order.accidentCarNo != null) {//判断是否是挂车
            if (order.accidentCarNo.indexOf('挂') > 0) {
                order.accidentCarNo = order.accidentCarNo.replace('挂', '')
                order.accidentCarNoType = 1;
            }
        }
        if ($scope.rescueType.type != 'tuoche') {
            order.fixAddress = '';
            order.fixLatitude = '';
            order.fixLongitude = '';
        }
        switch ($scope.rescueType.type) {
            case 'tuoche':
                order.rescueType = 1;
                break;
            case 'songyou':
                order.rescueType = 2;
                break;
            case 'dadian':
                order.rescueType = 4;
                break;
            case 'huantai':
                order.rescueType = 8;
                break;
            case 'yingji':
                order.rescueType = 16;
                break;
            default:
                break;
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
}])
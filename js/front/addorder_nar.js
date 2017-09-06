var addorder_nar = angular.module('addorder_nar', ['Road167']);
var order, pic = [], a = [], b = [];
var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');//随机数  
var code = 'a/';
var picPathName = '';
var fleet_list;
addorder_nar.controller('addorder_narCtrl', ['$scope', 'APIService', function ($scope, APIService) {

    $scope.input = function () {
        sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
    }
    // $scope.$watch('order', function (newValue, oldValue) {
    //     if(newValue != oldValue){
    //         console.log($scope.order)
    //     }
    // })
    fleet_list = [
        {
            bossName: "不指派调度",
            bossPhone: "",
            bossUserId: '',
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
        if ($scope.order.localPic.length < 10) {
            var input = document.getElementById("photo");
            $scope.length = input.files.length;
            if ($scope.length + $scope.order.localPic.length > 10) {
                alert('最多只能添加10张照片');
                closeloading();
                $scope.length = 10 - $scope.order.localPic.length;
            }
            for (var i = 0; i < $scope.length; i++) {
                pic.push(input.files[i]);
            }
        } else {
            layer.msg('最多只能添加10张照片');
            closeloading();
        }

    }
    $scope.readFile = function () {

        $scope.push();
        var length = 0;
        var picPath = {
            type: 1,
            path: ''
        }
        if ($scope.order.localPic.length < 10) {
            var bucket = '';
            var f = document.getElementById("photo").value;
            if (f == "") {
                alert("请上传图片");
                closeloading();
                return false;
            }
            else {
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(f)) {
                    alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
                    document.getElementById("photo").value = '';
                    closeloading();
                    return false;

                } else {
                    loading();
                    $scope.pic_counts = pic.length;
                    APIService.get_oss().then(function (res) {
                        if (res.data.http_status == 200) {
                            $scope.ossRes = res.data;
                            for (let i = 0; i < pic.length; i++) {
                                (function (i) {
                                    var client = new OSS.Wrapper({
                                        region: 'oss-cn-hangzhou',
                                        accessKeyId: $scope.ossRes.accessKeyId,
                                        accessKeySecret: $scope.ossRes.accessKeySecret,
                                        bucket: $scope.ossRes.bucketName,
                                        stsToken: $scope.ossRes.securityToken
                                    });
                                    bucket = $scope.ossRes.bucketName;
                                    client.multipartUpload($scope.getPicPathName(32), pic[i]).then(function (result) {
                                        a.push('http://' + bucket + '.oss-cn-hangzhou.aliyuncs.com/' + result.name + '?x-oss-process=style/ZOOM_OUT_VIEW');
                                        b.push(result.name);
                                        sessionStorage.setItem('pic_b', b)
                                        length++;
                                        pic = [];
                                        if (length == $scope.length) {
                                            layer.msg('上传成功')
                                            closeloading();
                                            document.getElementById("photo").value = '';
                                            if ($scope.flag == 0) {
                                                $scope.order.localPic = $scope.order.localPic.concat(a);
                                                $scope.order.picturePaths = $scope.order.picturePaths.concat(b)
                                                $scope.flag = 1;
                                                a = [];
                                                b = [];
                                            } else {
                                                $scope.order.localPic = a;
                                                $scope.order.picturePaths = b;
                                                a = [];
                                                b = [];
                                            }

                                            $scope.selectPic();
                                            $scope.initData();
                                            console.log(a)
                                        }

                                    })
                                })(i);
                            }
                        }
                    });
                }
            }
        }
    }
    $scope.del = function (index) {
        b.splice(index, 1);
        a.splice(index, 1);
        $scope.order.localPic.splice(index, 1);
        $scope.order.picturePaths.splice(index, 1);
        $scope.selectPic();
    }
    $scope.chargeMode = function (type) {
        $scope.mode = type;
        sessionStorage.setItem('chargeMode', type);
    }
    $scope.initData = function () {
        $scope.flag = 0;
        $scope.order = {
            accidentCarNo: '',
            accidentAddress: '',
            fixAddress: '',
            accidentDriverName: '',
            accidentDriverPhone: '',
            caseNo: '',
            accidentCarNo: '',
            accidentLongitude: '',
            accidentLatitude: '',
            fixLatitude: '',
            fixLongitude: '',
            designateGrabUserId: '',
            orderType: 2,
            rescueType: '',
            localPic: [],
            chargeMode: 2,
            picturePaths: []
        }
        //判断是否允许指派调度
        var funcList = sessionStorage.getItem('funcList')
        if (contains(funcList, 1) || contains(funcList, 1001)) {
            $scope.diaodu = show;
        } else {
            $scope.diaodu = hide;
        }
        //收费方式
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

        if (JSON.parse(sessionStorage.getItem('nar_addorder_order')) != null) {
            $scope.order = JSON.parse(sessionStorage.getItem('nar_addorder_order'));
            if (!$scope.order.hasOwnProperty('rescueType')) {//不存在rescueType，默认值为拖车
                $scope.rescueType = {
                    type: 'tuoche'
                };
            } else {//存在
                if ($scope.order.rescueType != '') {//存在rescueType，且值不为空
                    $scope.rescueType = {
                        type: $scope.order.rescueType
                    };
                } else {//值为空，默认为拖车
                    $scope.rescueType = {
                        type: 'tuoche'
                    };
                }

            }
        } else {
            $scope.rescueType = {
                type: 'tuoche'
            };
        }

        if (sessionStorage.getItem('nar_address') != null) {
            $scope.order.accidentAddress = sessionStorage.getItem('nar_address')
            sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
        }
        if (sessionStorage.getItem('nar_address_fixaddress') != null) {
            $scope.order.fixAddress = sessionStorage.getItem('nar_address_fixaddress')
            sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
        }
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
            if (data == null) {
                $scope.GrabUserId = '';
            }

        })
    }
    $scope.$watch('rescueType.type', function (newValue) {
        $scope.order.rescueType = newValue;
        $scope.counts4 = 1;
        sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
        if (newValue == 'tuoche') {
            $scope.fix = show;
            if ($scope.order != null) {
                if ($scope.order.fixAddress == '') {
                    $scope.counts4 = 0;
                } else {
                    $scope.counts4 = 1;
                }
            }


        } else {
            $scope.counts4 = 1;
            $scope.fixAddress = '';
            $scope.fix = hide;
        }
    })
    $scope.reset = function () {
        if (confirm('重置后页面填写的信息将被清空')) {
            sessionStorage.removeItem('fixAddress_shop4sId');
            sessionStorage.removeItem('nar_address_fixaddress');
            $scope.order = {
                accidentCarNo: '',
                accidentAddress: '',
                fixAddress: '',
                accidentDriverName: '',
                accidentDriverPhone: '',
                caseNo: '',
                accidentCarNo: '',
                accidentLongitude: '',
                accidentLatitude: '',
                fixLatitude: '',
                fixLongitude: '',
                designateGrabUserId: '',
                orderType: 2,
                rescueType: '',
                localPic: [],
                picturePaths: []
            }
            sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
            sessionStorage.setItem('nar_address', '')
            sessionStorage.setItem('nar_address_fixaddress', '');
            sessionStorage.setItem('chargeMode', '')
            $scope.chargeMode(2);
            location.reload();
        }

    }
    $scope.$watch('order.localPic', function (newValue) {
        sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
    })
    $scope.$watch('order.accidentAddress', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts1 = 0;
        } else {
            $scope.counts1 = 1;
        }
    });
    $scope.$watch('order.accidentCarNo', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts5 = 0;
        } else {
            $scope.counts5 = 1;
        }
    });
    $scope.$watch('order.accidentDriverPhone', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts2 = 0;
        } else {
            if (isPhone.test(newValue)) {
                $scope.counts2 = 1;
            } else {
                $scope.counts2 = 0;
                if (isPhone.test(oldValue)) {
                    layer.msg('电话号码不合法')
                }

            }

        }
    });
    $scope.$watch('order.fixAddress', function (newValue, oldValue) {
        if ($scope.order.rescueType == 'tuoche') {
            if (newValue == '' || newValue == null) {
                $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
                $scope.counts4 = 0;
            } else {
                $scope.counts4 = 1;
            }
        } else {
            $scope.counts4 = 1;
        }

    });
    $scope.$watch('counts1 + counts2  + counts4 + counts5', function (newValue, oldValue) {
        if (newValue == 4) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    });
    $scope.selectPic = function (type) {
        sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
    }
    $scope.selectMap = function (type) {
        if (type == 1) {
            sessionStorage.setItem('addorder_nar_type', '事故_nar');
            goto_view('main/nar_location');
        } else {
            sessionStorage.setItem('select_map_type', '目的_nar');
            sessionStorage.setItem('select_type', 'addorder')
            goto_view('main/updateFix');
        }

    }
    $scope.addOrder = function () {
        // if ($scope.order.accidentCarNo != null) {//判断是否是挂车
        //     if ($scope.order.accidentCarNo.indexOf('挂') > 0) {
        //         $scope.order.accidentCarNo = $scope.order.accidentCarNo.replace('挂', '')
        //         $scope.order.accidentCarNoType = 1;
        //     }
        // }

        $scope.order.accidentLongitude = sessionStorage.getItem('nar_address_nar_lng')
        $scope.order.accidentLatitude = sessionStorage.getItem('nar_address_nar_lat')
        $scope.order.fixLatitude = sessionStorage.getItem('nar_address_fixaddress_nar_lat')
        $scope.order.fixLongitude = sessionStorage.getItem('nar_address_fixaddress_nar_lng')
        if (sessionStorage.getItem('fixAddress_shop4sId') != null) {
            $scope.order.shop4sId = sessionStorage.getItem('fixAddress_shop4sId')
        }
        if ($scope.rescueType.type != 'tuoche') {
            $scope.order.shop4sId = '';
            $scope.order.fixAddress = '';
            $scope.order.fixLatitude = '';
            $scope.order.fixLongitude = '';
        }
        switch ($scope.rescueType.type) {
            case 'tuoche':
                $scope.order.rescueType = 32;
                break;
            case 'songyou':
                $scope.order.rescueType = 2;
                break;
            case 'dadian':
                $scope.order.rescueType = 4;
                break;
            case 'huantai':
                $scope.order.rescueType = 8;
                break;
            case 'yingji':
                $scope.order.rescueType = 16;
                break;
            default:
                break;
        }
        // if (order.designateGrabUserId == 1) {
        //     order.designateGrabUserId = ''
        // }
        if (!isPhone.test($scope.order.accidentDriverPhone)) {
            layer.msg('手机号码格式不正确');
        } else {
            $scope.order.chargeMode = sessionStorage.getItem('chargeMode')
            APIService.add_order($scope.order).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('新增订单成功');
                    $scope.order.localPic = [];
                    a = [];
                    b = [];
                    sessionStorage.removeItem('nar_address_fixaddress');
                    sessionStorage.removeItem('nar_address_fixaddress_nar_lat');
                    sessionStorage.removeItem('nar_address_fixaddress_nar_lng');
                    sessionStorage.setItem('chargeMode', 2);
                    sessionStorage.removeItem('nar_addorder_order');
                    sessionStorage.removeItem('nar_address');
                    sessionStorage.removeItem('nar_address_fixaddress');
                    sessionStorage.removeItem('fixAddress_shop4sId');
                    $scope.order = {
                        accidentCarNo: '',
                        accidentAddress: '',
                        fixAddress: '',
                        accidentDriverName: '',
                        accidentDriverPhone: '',
                        caseNo: '',
                        accidentCarNo: '',
                        accidentLongitude: '',
                        accidentLatitude: '',
                        fixLatitude: '',
                        fixLongitude: '',
                        designateGrabUserId: '',
                        orderType: 2,
                        rescueType: '',
                        localPic: [],
                        picturePaths: []
                    }
                    sessionStorage.setItem('nar_addorder_order', JSON.stringify($scope.order));
                    // $scope.reset();
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
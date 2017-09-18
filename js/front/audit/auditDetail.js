var auditDetail = angular.module('auditDetail', ['Road167']);
auditDetail.controller('auditDetailCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
    $scope.initData = function () {
        $scope.remark = '';
        $scope.orderNo = sessionStorage.getItem('audit_orderNo');
        $scope.address = sessionStorage.getItem('audit_address');
        $scope.fix = sessionStorage.getItem('audit_fix');
        $scope.fleetName = sessionStorage.getItem('audit_fleetName');
        $scope.billStatus = sessionStorage.getItem('billStatus');
        $scope.get_detail();
    }
    //获取报价详情
    $scope.get_detail = function () {
        APIService.get_orderquote_detail($scope.orderNo).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                $scope.carNo = res.data.accidentCarNo;
                if (res.data.settleStatus == 412 || res.data.settleStatus == 422) {
                    $scope.settleStatus = 412
                } else {
                    $scope.settleStatus = 413
                }

            } else {
                isError(res)
            }
        })
    }
    //获取发票详情
    $scope.get_order_bill = function () {
        APIService.get_order_bill($scope.orderNo).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                $scope.carNo = res.data.carNo;
                // $scope.settleStatusDesc = res.data.
            } else {
                isError(res)
            }
        })
    }
    //审核
    $scope.autid_order = function (type) {
        var data = {
            "verifyStatus": type,
            "verifyRemark": $scope.remark
        }
        if ($scope.title == '报价') {//报价详情点击审核按钮
            APIService.patch_order_quote($scope.orderNo, data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('确认审核');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    isError(res)
                }
            })
        } else {
            APIService.patch_order_bill($scope.orderNo, data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('确认审核');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    isError(res)
                }
            })
        }
    }
    $scope.openPic = function (path) {
        window.open(path);
    }

}])
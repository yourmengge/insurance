var addshop4S = angular.module('addshop4S', ['Road167']);
addshop4S.controller('addshop4SCtrl', ['$scope', 'APIService', "$http", function ($scope, APIService, $http) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
        sessionStorage.removeItem('shop4S_data');
        sessionStorage.removeItem('shop4S');
    }
    $scope.initData = function () {
        $scope.data = {
            "branchCompany": '',
            "pushFixCode": '',
            "fullName": '',
            "simpleName": '',
            "address": '',
            "longitude": '',
            "latitude": '',
            "afterSaleMgr": '',
            "afterSalePhone": '',
            "afterSaleMgr2": '',
            "afterSalePhone2": ''
        }
        if (JSON.parse(sessionStorage.getItem('shop4S_data') != '') && JSON.parse(sessionStorage.getItem('shop4S_data') != undefined)) {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            $scope.data.address = sessionStorage.getItem('shop4S');
            $scope.data.longitude = sessionStorage.getItem('shop4S_nar_lng');
            $scope.data.latitude = sessionStorage.getItem('shop4S_nar_lat');
        }

        if (sessionStorage.getItem('shop4S_type') == 'add') {
            $scope.title = '添加推修厂'
        } else {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            $scope.title = '修改推修厂'
        }

    }

    //确定按钮
    $scope.submit_button = function () {
        if (sessionStorage.getItem('shop4S_type') == 'add') {
            $scope.add_shop4S($scope.data);
        } else {
            $scope.update_shop4S($scope.data);
        }
    }

    //添加推修厂
    $scope.add_shop4S = function (data) {
        APIService.add_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('添加成功');
                setTimeout(function () {
                    sessionStorage.removeItem('shop4S_data');
                    sessionStorage.removeItem('shop4S');
                    goto_view('main/shop4S')
                }, 2000);
            } else {
                isError(res);
            }
        })
    }

    //修改推修厂
    $scope.update_shop4S = function (data) {
        APIService.update_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('修改成功');
                setTimeout(function () {
                    sessionStorage.removeItem('shop4S_data');
                    sessionStorage.removeItem('shop4S');
                    goto_view('main/shop4S')
                }, 2000);
            } else {
                isError(res);
            }
        })
    }
    $scope.selectMap = function (type) {
        sessionStorage.setItem('addorder_nar_type', '车行')
        sessionStorage.setItem('shop4S_data', JSON.stringify($scope.data));
        goto_view('main/nar_location');
    }

    $scope.$watch('data.pushFixCode', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts1 = 0;
        } else {
            $scope.counts1 = 1;
        }
    });
    $scope.$watch('data.afterSalePhone', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts2 = 0;
        } else {
            if (isPhone.test(newValue)) {
                $scope.counts2 = 1;
            } else {
                $scope.counts2 = 0;
            }

        }
    });
    $scope.$watch('data.address', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts4 = 0;
        } else {
            $scope.counts4 = 1;
        }
    });
    $scope.$watch('data.fullName', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts3 = 0;
        } else {
            $scope.counts3 = 1;
        }
    });
    $scope.$watch('counts1 + counts2 + counts3  + counts4', function (newValue, oldValue) {
        if (newValue == 4) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    });
}])
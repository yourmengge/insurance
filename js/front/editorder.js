var editorder = angular.module('editorder', ['Road167']);
var data;
editorder.controller('editorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.goBack = function () {
        window.history.back();
    }
    $scope.initData = function () {
        data = JSON.parse(sessionStorage.getItem('editorder'));
        $scope.editCaseNo = data.caseNo;
        if (sessionStorage.getItem('isSecondOrder') == 'yes') {
            $scope.second = show;
        } else {
            $scope.second = hide;

        }
        $scope.editDriverName = data.accidentDriverName;
        $scope.editDriverPhone = data.accidentDriverPhone;

        if (sessionStorage.getItem('update_nar_lat') == '' || sessionStorage.getItem('update_nar_lat') == null) {
            $scope.lat = sessionStorage.getItem('location_lat');
            $scope.lng = sessionStorage.getItem('location_lng');
            $scope.editAddress = sessionStorage.getItem('location_address')
        } else {
            $scope.lat = sessionStorage.getItem('update_nar_lat');
            $scope.lng = sessionStorage.getItem('update_nar_lng');
            $scope.editAddress = sessionStorage.getItem('update')
        }





        $scope.orderNo = data.orderNo;
        $scope.isDisaster = sessionStorage.getItem('isDisaster')
        if ($scope.isDisaster == 'yes') {
            $scope.title = sessionStorage.getItem('disaster_title')
        }
    }
    $scope.selectMap = function () {
        data.caseNo = $scope.editCaseNo;
        data.accidentDriverName = $scope.editDriverName;
        data.accidentDriverPhone = $scope.editDriverPhone;
        sessionStorage.setItem('editorder', JSON.stringify(data))
        sessionStorage.setItem('addorder_nar_type', '修改事故')
        goto_view('main/nar_location');
    }
    $scope.addOrder = function () {
        var data = {
            accidentAddress: $scope.editAddress,
            accidentDriverName: $scope.editDriverName,
            accidentDriverPhone: $scope.editDriverPhone,
            caseNo: $scope.editCaseNo,
            accidentLatitude: $scope.lat,
            accidentLongitude: $scope.lng
        }
        loading();
        APIService.update_order(data, $scope.orderNo).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                sessionStorage.setItem('update_nar_lat', '');
                layer.msg('修改成功');
                $scope.goBack();
            } else {
                isError(res)
            }
        })
    }
}])
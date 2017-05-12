var editorder = angular.module('editorder', ['Road167']);
editorder.controller('editorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.goBack = function () {
        window.history.back();
    }
    $scope.initData = function () {
        var data = JSON.parse(sessionStorage.getItem('editorder'));
        $scope.editCaseNo = data.caseNo;
        $scope.editDriverName = data.accidentDriverName;
        $scope.editDriverPhone = data.accidentDriverPhone;
        $scope.lat = sessionStorage.getItem('location_lat');
        $scope.lng = sessionStorage.getItem('location_lng');
        $scope.editAddress = sessionStorage.getItem('location_address')
        $scope.orderNo = data.orderNo
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
        APIService.update_order(data, $scope.orderNo).then(function (res) {
            if(res.data.http_status == 200){
                layer.msg('修改成功');
                $scope.goBack();
            }else{
                isError(res)
            }
        })
    }
}])
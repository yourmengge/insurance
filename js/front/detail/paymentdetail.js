var paymentdetail = angular.module('paymentdetail', ['Road167']);
paymentdetail.controller('paymentdetailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.orderNo = sessionStorage.getItem('orderNo');
        $scope.get_detail();
    }
    //获取详情
    $scope.get_detail = function () {
        APIService.get_detail($scope.orderNo).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                if((res.data.orderFlag & 1) > 0 && res.data.chargeMode == 2){//已授权
                    $scope.auth = true  
                }else{
                    $scope.auth = false
                }
            } else {
                isError(res)
            }
        })
    }
    /**
     *返回上页 
    */
    $scope.back = function () {
        window.history.back();
    }
    $scope.BigPic = function(path){
        window.open(path)
    }

}])
var addorder = angular.module('addorder', ['Road167']);
addorder.controller('addorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.change = function(){
        if($scope.message != null && $scope.message != ''){
            $('#button').removeAttr("disabled").removeClass('button_disabled');
        }else{
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
                    $scope.accidentCarNo = res.data.accidentCarNo;
                    $scope.accidentDriverPhone = res.data.accidentDriverPhone;
                    if($scope.accident == null || $scope.accidentDriverPhone == null){
                        $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
                    }
                }
            })
        }
    }
    $scope.initData = function () {
        APIService.get_fix_address(200).then(function (res) {
            $scope.address_list = res.data.items;
            $scope.fixAddress = res.data.items[0].address;
        })
        APIService.get_fav_driver_list(10).then(function (res) {
            $scope.driver_list = res.data.items;
            $scope.Driver = res.data.items[0].driverUserId;
        })
    }
}])

// designateGrabUserId 传司机userId


var addorder = angular.module('addorder', ['Road167']);
addorder.controller('addorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.analysis = function () {
        if ($scope.message == null || $scope.message == '' || $scope.message == undefined) {
            layer.msg('请粘贴短信');
        } else {
            APIService.analysis($scope.message).then(function (res) {
                console.log(res)
                if (res.data.http_status == 200) {
                    layer.msg('解析成功');
                    $scope.jiexi = hide;
                    $scope.accident = res.data.accidentAddress;
                    $scope.caseNo = res.data.caseNo;
                    $scope.accidentDriverName = res.data.accidentDriverName;
                    $scope.accidentCarNo = res.data.accidentCarNo;
                    $scope.accidentDriverPhone = res.data.accidentDriverPhone;

                }
            })
        }
    }
}])




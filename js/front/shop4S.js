var shop4S = angular.module('shop4S', ['Road167']);
shop4S.controller('shop4SCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.get_shop4S_list('', limit)
    }

    //获取4S店列表
    $scope.get_shop4S_list = function (keyword, limit) {
        APIService.get_shop4S_list(keyword, limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.shopList = res.data.items;
            } else {
                isError(res);
            }
        })
    }
}])
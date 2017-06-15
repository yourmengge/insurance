var disasterdriver = angular.module('disasterdriver', ['Road167']);
disasterdriver.controller('disasterdriverCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $scope.initData = function () {
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.status = sessionStorage.getItem('disasterstatus_site');
        $scope.areaList = sessionStorage.getItem('disaster_area')
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.area = $scope.areaList.split('、')[0];
        $scope.arealist = $scope.areaList.split('、');
        $scope.key = '';
        $scope.get_disaster_driver('list', '', 10, '', $scope.disasterId)
    }
    $scope.get_disaster_driver = function (type, key, limit, status, disasterId) {
        APIService.get_disaster_driver(type, key, limit, status, disasterId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.driverlist = res.data.items;
            }
        })
    }

}])
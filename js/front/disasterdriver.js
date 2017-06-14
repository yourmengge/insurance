var disasterdriver = angular.module('disasterdriver', ['Road167']);
disasterdriver.controller('disasterdriverCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }


}])
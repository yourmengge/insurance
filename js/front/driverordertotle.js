var driverordertotle = angular.module('driverordertotle', ['Road167']);
driverordertotle.controller('driverordertotleCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }


}])
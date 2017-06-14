var totleorder = angular.module('totleorder', ['Road167']);
totleorder.controller('totleorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }


}])
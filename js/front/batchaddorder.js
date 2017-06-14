var batchaddorder = angular.module('batchaddorder', ['Road167']);
batchaddorder.controller('batchaddorderCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    
}])
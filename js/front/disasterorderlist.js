var disasterorderlist = angular.module('disasterorderlist', ['Road167']);
disasterorderlist.controller('disasterorderlistCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }


}])
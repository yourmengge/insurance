var disasterinspector = angular.module('disasterinspector', ['Road167']);
disasterinspector.controller('disasterinspectorCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }
    // $scope.addinspector = function(){
    //     $('.find-div-body').toggle();
    // }

    $('#addinspector').click(function () {
        $('.addinspector_div').toggle(500);
    })
    $('#cancle').click(function () {
        $('.addinspector_div').toggle();
    })

}])
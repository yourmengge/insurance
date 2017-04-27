var main = angular.module('renbao_main', ['Road167']);
main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $('.left_menu p').click(function(){
        $(this).addClass('left_menu_click').siblings().removeClass('left_menu_click');
        sessionStorage.setItem('lmId',$(this).attr('id'));
    })
    $scope.initData = function(){
        $scope.adminName = sessionStorage.getItem('adminName');
        $('#' + sessionStorage.getItem('lmId')).addClass('left_menu_click').siblings().removeClass('left_menu_click');
    }
}])
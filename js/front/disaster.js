var disaster = angular.module('disaster', ['Road167']);
disaster.controller('disasterCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.statusTexts = [
        { id: 0, name: '全部' },
        { id: 1, name: '待启用' },
        { id: 2, name: '进行中' },
        { id: 3, name: '已关闭' }
    ]
    $scope.initData = function () {
        $scope.status = 0;
        $scope.get_disaster_list()
    }
    $scope.get_disaster_list = function () {
        APIService.get_disaster_list().then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items
            } else {
                isError(res);
            }
        })
    }
    $scope.site = function(id,area,status){
        sessionStorage.setItem('disasterId_site',id);
        sessionStorage.setItem('disasterstatus_site',status);
        var title = id + '-' + area.split('#')[1] + area.split('#')[2];
        sessionStorage.setItem('disaster_title',title)
        goto_view('main/site')
    }
    $scope.start = function (data) {
        if (data.status == 0) {
            $scope.url = '/open/';
            $scope.message = '启用'
        } else {
            $scope.url = '/close/';
            $scope.message = '关闭'
        }
        if (confirm('确定要' + $scope.message + '大灾(' + data.disasterId + '-' + data.areaDesc.split('#')[2] + ')吗？')) {
            APIService.start_disaster($scope.url, data.disasterId).then(function (res) {
                if (res.data.http_status == 200) {
                    $scope.get_disaster_list();
                }
            })
        } else {
            $scope.isChecked(data.status);
        }

    }
    $scope.viewdetail = function (a) {
        sessionStorage.setItem('disasterId', a)
        goto_view('main/disasterdetail')
    }

    $scope.isChecked = function (status) {
        if (status == 1) {
            return true;
        }
    }
}])
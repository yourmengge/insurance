var shop4S = angular.module('shop4S', ['Road167']);
shop4S.controller('shop4SCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.checked = [];
        $scope.select_one = false;
        $scope.all = false;
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

    //页面跳转
    $scope.goto = function (type, a) {
        sessionStorage.setItem('shop4S_type', type)
        if (a == '') {

        } else {
            sessionStorage.setItem('shop4S_data', JSON.stringify(a));
        }

        goto_view('main/addshop4S')
    }


    //全选
    $scope.selectAll = function () {
        $scope.select_one = false;
        if (!$scope.all) {
            $scope.select_one = true;
            $scope.all = true;
            $scope.checked = [];
            angular.forEach($scope.shopList, function (i, index) {
                $scope.checked.push(i.id);
            })
        } else {
            $scope.all = false;
            $scope.select_one = false;
            $scope.checked = [];
        }
    }

    //单选
    $scope.selectOne = function (id) {
        if (contains($scope.checked, id)) {
            angular.forEach($scope.checked, function (i, index) {
                if ($scope.checked[index] == id) {
                    $scope.checked.splice(index, 1);
                    $scope.all = false;
                }
            })
        } else {
            $scope.checked.push(id);
            if ($scope.checked.length == $scope.shopList.length) {
                $scope.all = true;
            }
        }
    }

    //删除
    $scope.delete = function () {
        var data = 'id=';
        if ($scope.checked.length == 1) {
            data = data + $scope.checked[0];
        } else {
            angular.forEach($scope.checked, function (i, index) {
                if (index != $scope.checked.length - 1) {
                    data = data + i + '$id='
                } else {
                    data = data + i;
                }
            })
        }
        console.log(data);
        APIService.delete_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('删除成功');
                setTimeout(function () {
                    $scope.initData();
                }, 2000);
            } else {
                isError(res);
            }
        })
    }
}])
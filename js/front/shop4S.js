var shop4S = angular.module('shop4S', ['Road167']);
shop4S.controller('shop4SCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.checked = [];
        $scope.select_one = false;
        $scope.keyword = '';
        $scope.all = false;
        $scope.page_p = show;
        $scope.get_shop4S_page('', limit)
    }

    //获取4S店列表
    $scope.get_shop4S_page = function (keyword, limit) {
        APIService.get_shop4S_page(keyword, limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.shopList = res.data.items;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res);
            }
        })
    }

    //页面跳转
    $scope.goto = function (type, a) {
        sessionStorage.setItem('shop4S_type', type)
        if (a == '') {
            sessionStorage.removeItem('shop4S_data');
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
                $scope.checked.push(i.shop4sId);
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
        if ($scope.checked.length == 0) {
            alert('未选中任何推修厂')
        } else {
            var data = 'id=';
            if ($scope.checked.length == 1) {
                data = data + $scope.checked[0];
            } else {
                angular.forEach($scope.checked, function (i, index) {
                    if (index != $scope.checked.length - 1) {
                        data = data + i + '&id='
                    } else {
                        data = data + i;
                    }
                })
            }
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

    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
            $scope.up = hide;
            $scope.down = show;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
            $scope.up = show;
            $scope.down = hide;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
            if ($scope.current == $scope.pageCount) {
                $scope.down = hide;
            }
        }
        if (type == 'up') {
            $scope.down = show;
            $scope.current = $scope.current - 1;
            if ($scope.current == 1) {
                $scope.up = hide;
            }
        }
        loading();
        APIService.paging(urlV1 + '/shop4s/page?keyword=' + $scope.keyword, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.shopList = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])
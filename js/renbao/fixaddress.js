var fixaddress = angular.module('fixaddress', ['Road167']);
fixaddress.controller('fixaddressCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.addFixAddress = function () {
        $('.closeBg').css('display', 'block');
        $('.map_div').css('display', 'block')
    }
    $scope.closeBG = function () {
        $('.closeBg').css('display', 'none');
        $('.map_div').css('display', 'none');
        goto_view('renbao_main/fixaddress');
        $scope.initData();
    }
    $scope.initData = function () {
        $('.closeBg').css('display', 'none');
        $('.map_div').css('display', 'none');
        APIService.get_fix_address(10).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.fix_address_list = res.data.items;
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
    $scope.delete = function (data) {
        if (confirm('你确定要将“' + data.addressAbbr + '”删除吗？本操作不可恢复！')) {
            APIService.del_fix_address(data.id).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('删除成功！')
                    setTimeout(function () {
                        $scope.initData();
                    }, 1000);
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
        APIService.paging(urlV1 + fav_address + '/all?', limit, type, $scope.pageCount, $scope.current).then(function (res) {
            $scope.fix_address_list = res.data.items;
        })
    }

}])
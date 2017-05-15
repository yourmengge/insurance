var adddriver = angular.module('adddriver', ['Road167']);
adddriver.controller('adddriverCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.addDriver = function () {
        $('.add_driver_div').toggle(500);
    }
    $scope.cencle = function () {
        $('.add_driver_div').toggle(500);
        $scope.phone = null;
        $('.add_driver_div_p').css('display', 'none');
    }
    $scope.input_tel = function () {

        if (isPhone.test($scope.phone)) {
            loading();
            APIService.get_driver_list($scope.phone).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    $('.add_driver_div_p').css('display', 'block');
                    if (res.data.count == 0) {
                        $scope.name = '未找到相关匹配';
                        $scope.driverphone = '';
                    } else {
                        $('#submit').removeAttr("disabled").removeClass('button_disabled');
                        $scope.name = res.data.items[0].name;
                        $scope.driverphone = $scope.phone;
                        $scope.userId = res.data.items[0].userId;
                    }

                } else {
                    isError(res);
                }
            })

        } else {
            $('.add_driver_div_p').css('display', 'none');
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    }
    $scope.submit_add = function () {
        var data = {
            driverName: $scope.name,
            driverMobile: $scope.phone,
            driverUserId: $scope.userId
        }
        loading();
        APIService.add_driver(data).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                layer.msg('添加成功！')
                setTimeout(function () {
                    $scope.initData();
                    $scope.phone = null;
                    $('.add_driver_div_p').css('display', 'none');
                    $('.add_driver_div').css('display', 'none');
                }, 1000);
            } else {
                isError(res);
            }
        })
    }
    $scope.select = function () {
        $('.add_driver_div_p').css('display', 'none');
    }
    $scope.initData = function () {
        loading();
        APIService.get_fav_driver_list(10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    $scope.tips = '没有数据';
                    $scope.table = hide;
                    $scope.page_p = hide;

                } else {
                    $scope.tips = '';
                    $scope.table = show;
                    $scope.page_p = show;
                    $scope.fav_driver_list = res.data.items;
                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.count / limit);
                    if (res.data.count <= limit) {
                        $scope.page_p = hide;
                    }
                    $scope.up = hide;
                    //分页结束
                }

            } else {
                isError(res);
            }
        })

    }
    $scope.delete = function (data) {

        if (confirm('确定移除 ' + data.driverName + '-' + data.driverMobile + '吗？')) {
            loading();
            APIService.delete_driver(data.id).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg(data.driverName + '-' + data.driverMobile + '移除成功！');
                    $scope.initData();
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
        APIService.paging(urlV1 + fav_driver + '/all?', limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.fav_driver_list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])

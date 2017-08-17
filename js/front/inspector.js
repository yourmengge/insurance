var inspector = angular.module('inspector', ['Road167']);
inspector.controller('inspectorCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $scope.limit = 50;
        $scope.edit_div = hide;
        $scope.phone = '';
        $scope.Name = '';
        $scope.get_inspector_list($scope.limit);
    }
    $scope.get_inspector_list = function (limit) {
        APIService.get_inspector_list(limit).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.userList;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    $scope.update = function (data) {
        $('.alert_bg').css('display', 'block');
        $scope.edit_div = show;
        $('#edit').css('display', 'block');
        $scope.editName = data.name;
        $scope.userId = data.userId;
    }
    $scope.submit_edit = function () {
        APIService.update_user_name($scope.userId, { name: $scope.editName }).then(function (res) {
            if(res.data.http_status == 200){
                layer.msg('修改成功');
                setTimeout(function() {
                    $scope.close();
                    $scope.initData();
                }, 1000);
            }else{
                isError(res)
            }
        })
    }
    // $scope.search = function () {
    //     loading();
    //     APIService.search_team($scope.searchName).then(function (res) {
    //         if (res.data.http_status == 200) {
    //             closeloading();
    //             if (res.data.count == 0) {
    //                 $('.add_driver_div_p').css('display', 'none');
    //             } else {
    //                 $('.add_driver_div_p').css('display', 'block');
    //                 $scope.searchlist = res.data.fleetList;
    //             }
    //         } else {
    //             isError(res);
    //         }
    //     })
    // }
    // $scope.select = function (data) {
    //     $('.add_driver_div_p').css('display', 'none');
    //     $scope.searchName = data.name;
    //     $scope.fleetId = data.fleetId;
    //     $('#submit').removeAttr("disabled").removeClass('button_disabled');
    // }
    $scope.addDriver = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
    }
    // $scope.cencle = function () {
    //     $('.add_driver_div').toggle(500);
    //     $scope.phone = null;
    //     $('.add_driver_div_p').css('display', 'none');
    //     $scope.phone = '';
    //     $scope.Name = '';
    // }
    $scope.close = function () {
        $scope.phone = '';
        $scope.Name = '';
        $('#edit').css('display', 'none');
        $scope.edit_div = hide;
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.update_inspector').css('display', 'none')
    }
    $scope.delete = function (data) {

        if (confirm('确定离职' + data.name + '吗？')) {
            loading();
            APIService.delete_inspector(data.userId).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('离职成功！');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    isError(res);
                }
            })
        }
    }
    $scope.submit_add = function () {

        if (isPhone.test($scope.phone)) {
            var data = {
                'name': $scope.Name,
                'phone': $scope.phone
            }
            loading();
            APIService.add_inspector(data).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {

                    layer.msg('添加成功');
                    setTimeout(function () {
                        location.reload();
                    }, 1000);

                    $scope.cencle();
                } else {
                    isError(res);
                }
            })
        } else {
            layer.msg('请输入合法的手机号码')
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
        APIService.paging(urlV1 + '/third/user?roleId=3&bOrderCounts=true', $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.userList;
            } else {
                isError(res)
            }

        })
    }
}])
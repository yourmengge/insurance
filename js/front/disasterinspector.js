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

    $scope.cancle = function () {
        $scope.key = '';
        $scope.inspectorName = [];
        $('.addinspector_div').toggle(500);
    }

    $scope.initData = function () {
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.status = sessionStorage.getItem('disasterstatus_site');
        $scope.areaList = sessionStorage.getItem('disaster_area')
        $scope.area = $scope.areaList.split('、')[0];
        $scope.arealist = $scope.areaList.split('、');
        $scope.key = '';
        $scope.get_disaster_inspector_list();
    }
    //修改查勘员
    $scope.update = function (data) {
        $scope.selectId = data.id;
        $('.alert_bg').css('display', 'block')
        $('.update_inspector').css('display', 'block')
        $scope.update_area = data.responsibleArea;
        if (data.userName != null) {
            $scope.updateInspector = data.userName + '-' + data.userMobile;
        } else {
            $scope.updateInspector = data.userMobile;
        }
    }
    //确认修改
    $scope.update_submit = function () {
        var data = {
            id: $scope.selectId,
            responsibleArea: $scope.update_area
        }
        APIService.update_disaster_inspector(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('修改成功');
                $scope.close();
                $scope.get_disaster_inspector_list();
            } else {
                isError(res)
            }
        })
    }
    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.update_inspector').css('display', 'none')
    }
    //查询大灾查勘员列表
    $scope.get_disaster_inspector_list = function () {
        APIService.get_disaster_inspector_list($scope.disasterId, 10).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
            } else {
                isError(res)
            }
        })
    }
    //选择查勘员
    $scope.check = function (data) {
        if (data.name == '未找到相关匹配') {
            $scope.key = '';
        } else {
            $scope.key = data.phone;
            $scope.inspectorUserId = data.userId;
        }

        $scope.inspectorName = [];
    }
    $scope.$watch('key', function (newValue) {
        if (newValue != '') {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#add').addClass('button_disabled').attr("disabled", 'true');
        }
    })
    //移除查勘员
    $scope.delInspector = function (data) {
        if (confirm('确定移除' + data.userName + '-' + data.userMobile + '吗？')) {
            APIService.delete_disaster_inspector(data.id).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg(data.userName + '-' + data.userMobile + '移除成功！');
                    $scope.get_disaster_inspector_list();
                } else {
                    isError(res)
                }
            })
        }
    }
    //添加查勘员
    $scope.add_disaster_inspector = function () {
        var data = {
            "disasterId": $scope.disasterId,
            "userId": $scope.inspectorUserId,
            "responsibleArea": $scope.area
        }
        APIService.add_disaster_inspector(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('添加成功')
                $('.addinspector_div').toggle();
                $scope.get_disaster_inspector_list();
            } else {
                isError(res);
            }
        })
    }
    //查询查勘员
    $scope.searchkey = function () {
        if (!isNaN($scope.key)) {
            $scope.keyName = 'phone'
        } else {
            $scope.keyName = 'name'
        }

        $scope.inspectorName = [];
        APIService.get_disaster_inspector(sessionStorage.getItem('companyNo'), $scope.keyName, $scope.key).then(function (res) {
            if (res.data.http_status == 200) {
                if (res.data.totalElements == 0) {
                    $scope.inspectorName.push({ name: '未找到相关匹配' });
                } else {
                    for (var i = 0; i < res.data.totalElements; i++) {
                        var data = {
                            name: '',
                            phone: '',
                            userId: ''
                        }
                        if (res.data.content[i].name != null) {
                            data.name = res.data.content[i].name + '-';
                        } else {
                            data.name = '';
                        }
                        data.phone = res.data.content[i].phone;
                        data.userId = res.data.content[i].userId;
                        $scope.inspectorName.push(data)
                    }
                }
            } else {
                isError(res)
            }
        })
    }

}])
var companyfleet = angular.module('companyfleet', ['Road167']);
companyfleet.controller('companyfleetCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $scope.keyword = '';
        $scope.searchName = '';
        $scope.get_company_fleet('', limit);
        //获取公司信息
        $scope.get_company_detail();
    }
    $scope.get_company_detail = function () {
        APIService.get_company_province(sessionStorage.getItem('companyId')).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.current_mode = res.data.orderDispatchMode;
                switch ($scope.current_mode) {
                    case 1:
                        $scope.currentTitle = '就近抢单模式'
                        break;
                    case 2:
                        $scope.currentTitle = '抢单模式'
                        break;
                    case 3:
                        $scope.currentTitle = '按权重指派'
                        break;
                    default:
                        break;
                }
            } else {
                isError(res)
            }
        })
    }
    function isInteger(obj) {
        return obj % 1 === 0
    }
    $scope.inputNum = function () {
        var weight = 0;
        $scope.bili = '';
        for (var i in $scope.team_list) {
            weight = $('#' + $scope.team_list[i].fleetId).val();
            if (i == $scope.team_list.length - 1) {
                $scope.bili = $scope.bili + weight
            } else {
                $scope.bili = $scope.bili + weight + ' : '
            }
        }
    }
    $scope.update_weight = function () {
        var temp = {
            "fleetId": '',
            "weight": ''
        };
        var data = [];
        for (var i in $scope.team_list) {
            temp.fleetId = $scope.team_list[i].fleetId;
            temp.weight = $('#' + temp.fleetId).val();
            console.log(typeof (temp.weight))
            if (temp.weight < 0 || temp.weight >= 100 || !isInteger(temp.weight)) {
                layer.msg('提示错误');
                break;
            }
            data.push(temp);
            temp = {
                "fleetId": '',
                "weight": ''
            };
            if (i == $scope.team_list.length - 1) {
                APIService.weight_cfg(sessionStorage.getItem('companyNo'), { req: data }).then(function (res) {
                    if (res.data.http_status == 200) {
                        layer.msg('配置成功');
                        $scope.close();
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            }
        }

    }
    $scope.changeMode = function (type) {
        if ($scope.current_mode != type) {
            switch (type) {
                case 1:
                    $scope.message = '就近抢单模式'
                    break;
                case 2:
                    $scope.message = '抢单模式'
                    break;
                case 3:
                    $scope.message = '按权重指派'
                    break;
                default:
                    break;
            }
            if (confirm($scope.message)) {
                var data = {
                    orderDispatchMode: type
                }
                APIService.update_company(sessionStorage.getItem('companyId'), data).then(function (res) {
                    if (res.data.http_status == 200) {
                        layer.msg('切换模式成功');
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            }
        } else {

        }

    }
    $scope.get_company_fleet = function (keyword, limit) {
        APIService.get_company_fleet(keyword, limit).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.team_list = res.data.items;
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

    $scope.search = function () {
        loading();
        APIService.search_team($scope.searchName).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    $('.add_driver_div_p').css('display', 'none');
                } else {
                    $('.add_driver_div_p').css('display', 'block');
                    $scope.searchlist = res.data.fleetList;
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.$watch('searchName', function (newValue) {
        if (newValue == null || newValue == '') {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    })
    $scope.select = function (data) {
        $('.add_driver_div_p').css('display', 'none');
        $scope.searchName = data.name;
        $scope.fleetId = data.fleetId;
        $('#submit').removeAttr("disabled").removeClass('button_disabled');
    }
    $scope.openTips = function (id) {
        $('#' + id).css('display', 'block');
    }
    $scope.closeTips = function (id) {
        $('#' + id).css('display', 'none');
    }
    $scope.addDriver = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
    }
    $scope.weightCfg = function () {
        $('.alert_bg').css('display', 'block')
        $('.weightCfg_div').toggle();
        var weight = 0;
        $scope.bili = 0;
        for (var i in $scope.team_list) {
            weight = $scope.team_list[i].weight;
            if (i == $scope.team_list.length - 1) {
                $scope.bili = $scope.bili + weight
            } else {
                $scope.bili = $scope.bili + weight + ' : '
            }
        }
    }
    $scope.cencle = function () {
        $('.add_driver_div').toggle(500);
        $scope.phone = null;
        $('.add_driver_div_p').css('display', 'none');
    }
    $scope.close = function () {
        $scope.bili = '';
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.weightCfg_div').css('display', 'none')
    }
    $scope.delete = function (data) {

        if (confirm('确定移除 ' + data.fleetName + '吗？')) {
            loading();
            APIService.delete_company_fleet(data.id).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg(data.fleetName + '移除成功！');
                    setTimeout(function () {
                        $scope.initData()
                    }, 1000);
                } else {
                    isError(res);
                }
            })
        }
    }
    $scope.submit_add = function () {
        loading();
        APIService.search_team($scope.searchName).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    layer.msg('该车队不存在，请重新确认车队名是否有误')
                } else {
                    var data = {
                        fleetId: $scope.fleetId
                    }
                    APIService.add_company_fleet(data).then(function (res) {
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
                }
            } else {
                isError(res);
            }
        })
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
        APIService.paging(urlV1 + '/company-fleet?keyword=' + $scope.keyword, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.team_list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])
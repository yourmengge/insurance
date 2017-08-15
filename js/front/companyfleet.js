var companyfleet = angular.module('companyfleet', ['Road167']);
companyfleet.controller('companyfleetCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $('#startDay').val('');
        $('#endDay').val('');
        $scope.limit = 200;
        $scope.num = [];
        $scope.keyword = '';
        $scope.open = false;
        $scope.searchName = '';
        $scope.table = show;
        $scope.get_company_fleet('', $scope.limit);
        $scope.tips = '当前无车队，请尽快配置车队启用模式，以免影响接单'
        //获取公司信息
        $scope.get_company_detail();
    }
    $scope.get_company_detail = function () {
        APIService.get_company_province(sessionStorage.getItem('companyId')).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.current_mode = res.data.orderDispatchMode;
                $scope.witchTpye($scope.current_mode);
            } else {
                isError(res)
            }
        })
    }
    $scope.witchTpye = function (type) {
        switch (type) {
            case 1:
                $scope.alert = '';
                $scope.currentTitle = '就近抢单模式'
                $scope.description = $scope.Texts[0];
                break;
            case 2:
                $scope.alert = '确定移除' + $scope.delete_fleetName + '的抢单。'
                $scope.currentTitle = '抢单模式'
                $scope.description = $scope.Texts[1];
                break;
            case 3:
                $scope.alert = '确定移除' + $scope.delete_fleetName + '车队，请尽快调整车队比例配置，以免影响订单分配！'
                $scope.currentTitle = '按比例指派'
                $scope.description = $scope.Texts[2];
                break;
            default:
                break;
        }
    }
    $scope.changeMode = function () {
        $('.description').toggle();
        $scope.open = !$scope.open;
    }
    $scope.Texts = [
        '刚下单推送30公里范围内，30公里范围内的调度可以抢单；3分钟未接单推送50公里范围内，50公里范围内的调度可以抢单；5分钟未接单推送70公里范围内，70公里范围内的调度可以抢单。',
        '加入抢单模式的车队都可以抢单，不受范围限制。',
        '系统会根据配置比例，直接指派订单给对应的调度；若比例相同时，平均分配。'
    ]
    function isInteger(obj) {
        return obj % 1 === 0
    }
    $scope.scale = function (weight) {
        if (isAllEqual($scope.num) && $scope.num[0] == 0) {
            return parseInt(100 / $scope.num.length)
        } else {
            return parseInt(weight * 100 / $scope.totle)
        }

    }
    function isAllEqual(array) {//判断数组内所有值是否相等
        if (array.length > 0) {
            return !array.some(function (value, index) {
                return value !== array[0];
            });
        } else {
            return true;
        }
    }
    $scope.inputNum = function (e, id) {
        var totle = 0;
        var array = [];
        for (let i in $scope.team_list) {
            var num = $('#' + $scope.team_list[i].fleetId).val()
            if (num == '') {
                num = '0';
            }
            array.push(num);
            totle = parseInt(num) + totle;
        }
        if (isAllEqual(array) && $('#' + $scope.team_list[0].fleetId).val() == 0) {
            for (var i in $scope.team_list) {
                $('.' + $scope.team_list[i].fleetId).text(parseInt(100 / $scope.team_list.length) + '%')
            }
        } else {
            for (var i in $scope.team_list) {
                weight = $('#' + $scope.team_list[i].fleetId).val();
                if (weight == '') {
                    weight = 0;
                }
                $('.' + $scope.team_list[i].fleetId).text(parseInt(weight * 100 / totle) + '%')
            }
        }

    }
    $scope.lose_focus = function () {
        $('input').removeClass('wrong_input');
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
            if (temp.weight < 0 || temp.weight >= 100 || !isInteger(temp.weight)) {
                layer.msg('请输入大于等于0的整数');
                $('#' + temp.fleetId).addClass('wrong_input').focus();
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

    $scope.switchMode = function (type, e) {
        if ($scope.current_mode == type) {

        } else {
            $scope.message = '确定退出' + $scope.currentTitle + '，现有模式配置失效！'
            if (confirm($scope.message)) {
                var data = {
                    orderDispatchMode: type
                }
                APIService.update_company(sessionStorage.getItem('companyId'), data).then(function (res) {
                    if (res.data.http_status == 200) {
                        layer.msg('切换模式成功');
                        $('.description').toggle();
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            } else {
                if (window.event) {
                    window.event.returnValue = false;
                }
                else {
                    e.preventDefault(); //for firefox 
                }
            }
        }

    }
    // $scope.changeMode = function (type) {
    //     if ($scope.current_mode != type) {
    //         switch (type) {
    //             case 1:
    //                 $scope.message = '就近抢单模式'
    //                 break;
    //             case 2:
    //                 $scope.message = '抢单模式'
    //                 break;
    //             case 3:
    //                 $scope.message = '按权重指派'
    //                 break;
    //             default:
    //                 break;
    //         }
    //         if (confirm($scope.message)) {
    //             var data = {
    //                 orderDispatchMode: type
    //             }
    //             APIService.update_company(sessionStorage.getItem('companyId'), data).then(function (res) {
    //                 if (res.data.http_status == 200) {
    //                     layer.msg('切换模式成功');
    //                     $scope.initData();
    //                 } else {
    //                     isError(res);
    //                 }
    //             })
    //         }
    //     } else {

    //     }

    // }
    $scope.isSelect = function (type) {
        if (type == $scope.current_mode) {
            return true;
        } else {
            return false;
        }
    }
    $scope.get_company_fleet = function () {
        var startDay = $('#startDay').val();
        var endDay = $('#endDay').val();
        APIService.get_company_fleet(startDay, endDay).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.team_list = res.data.items;
                $scope.totle = 0;
                for (var i in $scope.team_list) {
                    $scope.totle = $scope.totle + $scope.team_list[i].weight;
                    $scope.num.push($scope.team_list[i].weight)
                }
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
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
        $('#' + id).toggle(200);
    }
    $scope.closeTips = function (id) {
        $('#' + id).css('display', 'none');
    }

    $scope.isNum = function (e, id) {//限制输入0到100的正整数
        var preventDefault = function () {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox 
            }
        }
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57))) {//限制输入数字
            var num = $('#' + id).val();
            if (num > 10) {
                preventDefault();
            } else if (num == 10) {
                if (k != 48) {
                    preventDefault();
                }
            }
            if (num.length == 3) {
                preventDefault();
            }

        } else {
            preventDefault();
        }
    }
    $scope.addDriver = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
    }
    $scope.write = function () {
        var weight = 0;
        var totle = 0;
        for (let i in $scope.team_list) {
            totle = $scope.team_list[i].weight + totle;
        }
        // for (var i in $scope.team_list) {
        //     weight = $scope.team_list[i].weight;
        //     $('.' + $scope.team_list[i].fleetId).text(parseInt(weight * 100 / totle) + '%')
        // }
        if (isAllEqual($scope.num) && $scope.team_list[0].weight == 0) {
            for (var i in $scope.team_list) {
                $('.' + $scope.team_list[i].fleetId).text(parseInt(100 / $scope.team_list.length) + '%')
            }
        } else {
            for (var i in $scope.team_list) {
                weight = $scope.team_list[i].weight;
                $('.' + $scope.team_list[i].fleetId).text(parseInt(weight * 100 / totle) + '%')
            }
        }
    }
    $scope.weightCfg = function () {
        $('.alert_bg').css('display', 'block')
        $('.weightCfg_div').toggle();
        $scope.write();

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
        $('.weightCfg_div').css('display', 'none');
        $scope.initData();
    }

    $scope.delete = function (data) {
        $scope.delete_fleetName = data.fleetName;
        $scope.witchTpye($scope.current_mode);
        if (confirm($scope.alert)) {
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
                            if ($scope.current_mode == 3) {
                                layer.msg($scope.searchName + '添加成功，请立即配置接单比例！');
                            } else {
                                layer.msg('添加成功');
                            }


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
        APIService.paging(urlV1 + '/company-fleet?keyword=' + $scope.keyword, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.team_list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])
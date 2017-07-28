var companyfleet = angular.module('companyfleet', ['Road167']);
companyfleet.controller('companyfleetCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $scope.keyword = '';
        $scope.searchName = '';
        $scope.get_company_fleet('', limit);
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
    $scope.addDriver = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
    }
    $scope.cencle = function () {
        $('.add_driver_div').toggle(500);
        $scope.phone = null;
        $('.add_driver_div_p').css('display', 'none');
    }
    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.update_inspector').css('display', 'none')
    }
    $scope.delete = function (data) {

        if (confirm('确定移除 ' + data.fleetName + '吗？')) {
            loading();
            APIService.delete_company_fleet(data.id).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg(data.fleetName + '移除成功！');
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
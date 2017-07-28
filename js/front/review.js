var review = angular.module('review', ['Road167']);
review.controller('reviewCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $scope.initData = function () {
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.get_disaster_driver_review($scope.disasterId);
    }
    //获取退出司机列表
    $scope.get_disaster_driver_review = function (disasterId) {
        APIService.get_disaster_driver_review(disasterId,limit).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res)
            }
        })
    }

    //司机退出审核
    $scope.reviw_disaster_driver = function (data, type) {
        if (data.userName == null || data.userName == '') {
            $scope.userName = data.userPhone
        } else {
            $scope.userName = data.userName + '-' + data.userPhone
        }
        if (type == 1) {
            $scope.message = '同意'
        } else {
            $scope.message = '拒绝'
        }
        if (confirm('确定' + $scope.message + $scope.userName + '退出大灾吗？')) {
            APIService.reviw_disaster_driver(data.id, type).then(function (res) {
                if (res.data.http_status == 200) {
                    if (type == 1) {
                        layer.msg($scope.userName + '退出大灾成功！');
                        setTimeout(function () {
                            $scope.initData();
                        }, 2000);
                    } else {
                        $scope.initData();
                    }
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
        APIService.paging(urlV1  + '/disaster-driver/verify/list?disasterId=' + $scope.disasterId + '&applyStatus=APPLY', limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items
            } else {
                isError(res)
            }

        })
    }
}])
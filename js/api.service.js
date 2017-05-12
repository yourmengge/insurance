var Road167 = angular.module('Road167', []);
Road167.factory('APIService', function ($http) {
    var service = {
        token: sessionStorage.getItem('token'),
        userId: sessionStorage.getItem('userId')
    }
    service.get = function (url) {
        return $http({
            method: 'GET',
            url: url,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    service.post = function (url, data) {
        return $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    service.put = function (url, data) {
        return $http({
            method: 'PUT',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };
    service.patch = function (url, data) {
        return $http({
            method: 'PATCH',
            url: url,
            data: data,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };

    service.delete = function (url) {
        return $http({
            method: 'DELETE',
            url: url,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        })
    };

    //解析短信
    service.analysis = function (message) {
        return service.post(host + urlV1 + urlOrder + urlActions + '/parse', { 'message': message });
    }

    //手机号查询司机
    service.get_driver_list = function (phone) {
        return service.get(host + urlV1 + urlDriver + '/all?phone=' + phone);
    }

    //添加指派司机
    service.add_driver = function (data) {
        return service.post(host + urlV1 + fav_driver, data);
    }

    //获取指派司机列表
    service.get_fav_driver_list = function (limit) {
        return service.get(host + urlV1 + fav_driver + '/all?$limit=' + limit);
    }

    //删除指派司机列表中的司机，传司机列表中，司机Id
    service.delete_driver = function (id) {
        return service.delete(host + urlV1 + fav_driver + '/' + id);
    }

    //新增固定目的地点
    service.add_fix_address = function (data) {
        return service.post(host + urlV1 + fav_address, data);
    }

    //修改固定目的地点
    service.update_fix_address = function (data) {
        return service.patch(host + urlV1 + fav_address, data);
    }

    //获取固定目的地点列表
    service.get_fix_address = function (limit) {
        return service.get(host + urlV1 + fav_address + '/all?$limit=' + limit);
    }

    //删除固定目的地点，传列表中的Id
    service.del_fix_address = function (id) {
        return service.delete(host + urlV1 + fav_address + '/' + id);
    }

    // 新增订单
    service.add_order = function (data) {
        return service.post(host + urlV1 + urlOrder + urlAdd, data);
    }

    //获取评价列表
    service.get_evaluation = function (limit) {
        return service.get(host + urlV1 + order_eval + '/page?$limit=' + limit);
    }

    //获取订单详情
    service.get_order_detail = function (orderNo) {
        return service.get(host + urlV1 + urlOrder + "/" + orderNo + '?bVerifyAddress=true');
    }

    //同步距离
    service.reflash_distance = function (id) {
        return service.post(host + urlV1 + urlAssigndrivers + '/' + id + '/acitons' + '/chargedistance', { '': '' });
    }

    //获取轨迹
    service.get_track = function (stime, etime, userId) {
        return service.get(host + urlV1 + urlTrack1 + parseInt(stime / 1000) + urlTrack2 + parseInt(etime / 1000) + urlTrack3 + userId + urlTrack4);
    }

    //获取订单列表
    service.get_order_list = function (limit, startDay, endDay, status, caseno) {
        return service.get(host + urlV1 + third + urlOrder + '?$limit=' + limit + '&startDay=' + startDay + '&endDay=' + endDay + '&status=' + status + '&caseNo=' + caseno);
    }

    //获取已配置施救车队列表
    service.get_team_list = function (limit) {
        return service.get(host + urlV1 + urlSpecify_fleet + '/all?$limit=' + limit);
    }

    //删除已配置施救车队
    service.delete_team = function (id) {
        return service.delete(host + urlV1 + urlSpecify_fleet + '/' + id);
    }

    //查询车队
    service.search_team = function (name) {
        return service.get(host + urlV1 + urlFleet + '/list?$offset=0&$limit=3&fleetname=' + name);
    }

    //添加施救车队
    service.add_team = function (data) {
        return service.post(host + urlV1 + urlSpecify_fleet, data);
    }

    //取消订单
    service.cancel_order = function (order) {
        return service.patch(host + urlV1 + urlOrder + '/' + order + urlActions + '/cancel', { '': '' })
    }

    //修改订单
    service.update_order = function (data, orderNo) {
        return service.patch(host + urlV1 + urlOrder + '/' + orderNo, data);
    }

    //获取菜单
    service.get_menu = function () {
        return service.get(host + urlV1 + '/menu');
    }
    //分页
    service.paging = function (url, limit, type, pagecount) {
        if (type == 'home') {
            offset = 0;
        }
        if (type == 'end') {
            offset = (pagecount - 1) * limit;
        }
        if (type == 'down') {
            offset = limit + offset;
        }
        if (type == 'up') {
            offset = offset - limit;
        }
        return service.get(host + url + '&$limit=' + limit + '&$offset=' + offset);
    }

    //退出登录
    service.user_logout = function () {
        return service.delete(host + urlV1 + urlUser + urlActions + '/loginout');
    }

    //登录
    service.login = function (phone, password, roleId) {
        var password = hex_md5(password);
        var data = {
            password: password,
            phone: phone,
            roleId: 7
        };

        return $http.post(host + urlLogin + urlAction + urlToken, data).then(function (res) {
            if (res.data.http_status == 200) {
                service.userId = res.data.userId;
                service.token = res.data.token;
                sessionStorage.setItem('companyName', res.data.companyName);
                sessionStorage.setItem('adminName', res.data.name);
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('userId', res.data.userId);
                return res;
            } else {
                return res;
            }
        });
    };

    return service;
})
Road167.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {
        "Content-Type": 'application/json'
    };
    $httpProvider.defaults.transformRequest = function (value) {
        return JSON.stringify(value);
    };
});
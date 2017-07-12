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

    //上传图片,获取oss权限
    service.get_oss = function () {
        return service.get(host + '/v1/aliyun/oss/sts/get-put');
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

    //获取司机轨迹列表
    service.get_driver_track_list = function (disasterId, key, status, limit) {
        return service.get(host + urlV1 + urlTrack5 + disasterId + urlKey + key + urlTaskStatus + status + '&$limit=' + limit)
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

    //创建大灾
    service.create_disaster = function (data) {
        return service.post(host + urlV1 + '/disaster', data)
    }

    //获取大灾列表
    service.get_disaster_list = function (startDate, area, status, disasterId, limt, offset) {
        return service.get(host + urlV1 + urlDisaster + '?statisUser=true&startDate=' + startDate + '&areaDesc=' + area + '&disasterId=' + disasterId + '&status=' + status + '&$limit=' + limit + '&$offset=' + offset)
    }

    //获取大灾订单统计列表
    service.get_disaster_totle_list = function (startDate, area, status, disasterId, limt, offset) {
        return service.get(host + urlV1 + urlDisaster + '?statisOrder=true&startDate=' + startDate + '&areaDesc=' + area + '&disasterId=' + disasterId + '&status=' + status + '&$limit=' + limit + '&$offset=' + offset)
    }

    //查看大灾订单列表
    service.get_disaster_order_list = function (disasterId, status, startDay, endDay, caseNo, limit) {
        return service.get(host + urlV1 + '/order/disaster/list?disasterId=' + disasterId + '&OrderStatus2=' + status + '&caseNo=' + caseNo + '&startDay=' + startDay + '&endDay=' + endDay + '&$limit=' + limit)
    }


    //获取大灾详情
    service.get_disaster_detail = function (disasterId) {
        return service.get(host + urlV1 + '/disaster/' + disasterId)
    }

    //修改司机需求量
    service.update_driver_need = function (disasterId, num) {
        return service.patch(host + urlV1 + '/disaster/' + disasterId + '/driverNeedCnt/' + num, { '': '' })
    }

    //开启或关闭大灾
    service.start_disaster = function (url, disasterId) {
        return service.patch(host + urlV1 + "/disaster" + url + disasterId, { '': '' })
    }

    //获取省份，城市，区域列表
    service.get_province_list = function (id) {
        return service.get(host + urlV1 + '/region/parentid/' + id + '/list?is_district=0')
    }

    //新增保全场地
    service.add_disaster_address = function (data) {
        return service.post(host + urlV1 + urlDisasterAddress, data)
    }

    //查询保全场地列表
    service.get_disaster_address_list = function (disasterId, limit) {
        return service.get(host + urlV1 + urlDisasterAddress + '/page?disasterId=' + disasterId + '&$offset=0&$limit=' + limit)
    }
    //修改保全场地
    service.update_disaster_address = function (data) {
        return service.patch(host + urlV1 + urlDisasterAddress, data)
    }
    //删除保全场地
    service.delete_disaster_address = function (id) {
        return service.delete(host + urlV1 + urlDisasterAddress + '/' + id)
    }

    //查询查勘员
    service.get_disaster_inspector = function (companyNo, keyName, key) {
        return service.get(host + urlV1 + urlUser + '/list?roleId=3&$limit=3&companyNo=' + companyNo + "&" + keyName + '=' + key)
    }
    //查询大灾查勘员列表
    service.get_disaster_inspector_list = function (disasterId, limit) {
        return service.get(host + urlV1 + '/disaster-inspector/page?disasterId=' + disasterId + '&$offset=0&$limit=' + limit)
    }
    //移除大灾查勘员
    service.delete_disaster_inspector = function (id) {
        return service.delete(host + urlV1 + '/disaster-inspector/' + id)
    }
    //新增大灾查勘员
    service.add_disaster_inspector = function (data) {
        return service.post(host + urlV1 + '/disaster-inspector', data)
    }
    //修改查勘员
    service.update_disaster_inspector = function (data) {
        return service.patch(host + urlV1 + '/disaster-inspector', data)
    }

    //查询大灾司机
    service.get_disaster_driver = function (type, key, limit, status, disasterId) {
        return service.get(host + urlV1 + '/disaster-driver/list?key=' + key + '&$limit=' + limit + '&DisasterDriverStatus=' + status + '&disasterId=' + disasterId + type)
    }

    //查询大灾司机（订单统计）
    service.get_disaster_driver_order = function (key, limit, status, disasterId, grabData) {
        return service.get(host + urlV1 + '/disaster-driver/list?key=' + key + '&$limit=' + limit + '&DisasterDriverStatus=' + status + '&disasterId=' + disasterId + '&grabDate=' + grabData + '&statisOrder=true')
    }

    //查询司机的订单列表
    service.get_disaster_driver_order_list = function (disasterId, userId, status, grabDate, limit) {
        return service.get(host + urlV1 + urlOrder + '/disaster/list-driver?disasterId=' + disasterId + '&driverUserId=' + userId + '&OrderStatus2=' + status + '&grabDate=' + grabDate + '&$limit=' + limit)
    }

    //查询司机退出列表
    service.get_disaster_driver_review = function (disasterId, limit) {
        return service.get(host + urlV1 + '/disaster-driver/verify/list?disasterId=' + disasterId + '&applyStatus=APPLY&$limit=' + limit)
    }
    //审核退出司机;0不通过，1通过
    service.reviw_disaster_driver = function (driverId, type) {
        return service.patch(host + urlV1 + '/disaster-driver/verify/' + driverId + '/' + type);
    }
    //确认导入订单
    service.submit_order_list = function (id) {
        return service.post(host + urlV1 + urlOrder + '/disaster/import/confirm/' + id, { '': '' })
    }

    //获取保险公司省份
    service.get_company_province = function (companyId) {
        return service.get(host + urlV1 + '/company/' + companyId)
    }

    //获取在线司机的订单数
    service.get_driver_order_list_line = function (disasterId, userId) {
        return service.get(host + urlV1 + '/disaster-driver/' + disasterId + '/' + userId + '/order')
    }

    //获取4S店列表
    service.get_shop4S_list = function (keyword, limit) {
        return service.get(host + urlV1 + '/shop4s/page?$limit=' + limit + '&keyword=' + keyword)
    }

    //确认批量导入
    service.submit_shop4S_list = function (id) {
        return service.post(host + urlV1 + '/shop4s/import/confirm/' + id);
    }

    //添加推修厂
    service.add_shop4S = function (data) {
        return service.post(host + urlV1 + '/shop4s', data);
    }

    //修改推修厂
    service.update_shop4S = function (data) {
        return service.put(host + urlV1 + '/shop4s', data);
    }

    //删除推修厂
    service.delete_shop4S = function(data){
        return service.delete(host + urlV1 + '/shop4s?' + data)
    }

    //分页
    service.paging = function (url, limit, type, pagecount, current) {
        if (type == 'home') {
            offset = 0;
        }
        if (type == 'end') {
            offset = (pagecount - 1) * limit;
        }
        if (type == 'down') {
            offset = limit * (current - 1);
        }
        if (type == 'up') {
            offset = limit * (current - 1)
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
                sessionStorage.setItem('companyNo', res.data.companyNo);
                sessionStorage.setItem('companyId', res.data.companyId);
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
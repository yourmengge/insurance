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
    service.get_fix_address = function (keyword, limit) {
        return service.get(host + urlV1 + fav_address + '?$limit=' + limit + '&keyword=' + keyword);
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
        return service.get(host + urlV1 + urlOrder + "/" + orderNo + '/detail?bVerifyAddress=true');
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
    service.get_order_list = function (limit, startDay, endDay, status, caseno, ordertype, offset) {
        return service.get(host + urlV1 + urlThird + urlOrder + '?$limit=' + limit + '&$offset=' + offset + '&startDay=' + startDay + '&endDay=' + endDay + '&status=' + status + '&keyword=' + caseno + '&orderType=' + ordertype);
    }

    //获取三者车列表
    service.get_order_list_third = function (limit, startDay, endDay, status, caseno, ordertype, offset) {
        return service.get(host + urlV1 + urlThird + urlOrder + '?$limit=' + limit + '&$offset=' + offset + '&startDay=' + startDay + '&endDay=' + endDay + '&status=' + status + '&keyword=' + caseno + '&orderType=' + ordertype + '&insuranceType=THIRD_CAR');
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
        return service.get(host + urlV1 + '/order/disaster/list?disasterId=' + disasterId + '&OrderStatus2=' + status + '&keyword=' + caseNo + '&startDay=' + startDay + '&endDay=' + endDay + '&$limit=' + limit)
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

    //获取4S店列表（修改目的地查询）
    service.get_shop4S_list = function (keyword, limit) {
        return service.get(host + urlV1 + '/shop4s/list?$limit=' + limit + '&keyword=' + keyword)
    }
    //获取4S店列表(后台列表)
    service.get_shop4S_page = function (keyword, limit, offset) {
        return service.get(host + urlV1 + '/shop4s/page?$limit=' + limit + '&$offset=' + offset + '&keyword=' + keyword)
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
    service.delete_shop4S = function (data) {
        return service.delete(host + urlV1 + '/shop4s?' + data)
    }

    //添加抢单车队
    service.add_company_fleet = function (data) {
        return service.post(host + urlV1 + '/company-fleet', data);
    }
    //删除抢单车队
    service.delete_company_fleet = function (id) {
        return service.delete(host + urlV1 + '/company-fleet/' + id);
    }
    //查询抢单车队
    service.get_company_fleet = function (startDay, endDay) {
        return service.get(host + urlV1 + '/company-fleet?$limit=200' + '&startDay=' + startDay + '&endDay=' + endDay)
    }

    //申请更改目的地
    service.update_fixaddress = function (data) {
        return service.post(host + urlV1 + '/verifyaddress', data);
    }
    //查询目的地点列表
    service.get_fixaddress_list = function (keyword, limit) {
        return service.get(host + urlV1 + '/shop4s/list?$limit=' + limit + '&keyword=' + keyword)
    }

    //删除大灾司机
    service.delete_disaster_driver = function (data) {
        return service.post(host + urlV1 + '/disaster-driver/leaveBatch', data)
    }

    //添加大灾司机
    service.add_disaster_driver = function (disasterId, data) {
        return service.post(host + urlV1 + '/disaster-driver/' + disasterId, data)
    }

    //提醒司机
    service.warn_driver = function (phone) {
        return service.post(host + urlV1 + '/disaster-driver/notify/' + phone);
    }
    //获取某一大灾订单量统计
    service.get_all_disaster_orders = function (disasterId) {
        return service.get(host + urlV1 + '/disaster/statis/' + disasterId);
    }
    //获取查勘员列表
    service.get_inspector_list = function (limit) {
        return service.get(host + urlV1 + '/third/user?roleId=3&$limit=' + limit + '&bOrderCounts=true')
    }

    //添加查勘员
    service.add_inspector = function (data) {
        return service.post(host + urlV1 + '/import/inspector', data)
    }
    //查勘员批量导入确认
    service.submit_inspector_list = function (id) {
        return service.post(host + urlV1 + '/excel/inpsector/import/confirm/' + id, { '': '' })
    }
    //查勘员离职
    service.delete_inspector = function (id) {
        return service.patch(host + urlV1 + '/user/' + id + '/actions/resignation')
    }
    //获取公司功能权限
    service.get_company_cfg = function () {
        return service.get(host + urlV1 + '/fun')
    }
    //修改用户名
    service.update_user_name = function (id, data) {
        return service.patch(host + urlV1 + '/user/' + id, data)
    }

    //修改保险公司信息
    service.update_company = function (id, data) {
        return service.patch(host + urlV1 + '/company/' + id, data);
    }
    //权重配置
    service.weight_cfg = function (no, data) {
        return service.put(host + urlV1 + '/company-fleet/company/' + no, data)
    }

    //查询授权信息
    service.get_auth_detail = function (orderNo) {
        return service.post(host + urlV1 + '/order/authorization', { orderNo: orderNo })
    }

    //付款管理列表查询
    service.get_payment_list = function (offset, limit, name, roleId, status) {
        return service.get(host + urlV1 + '/order/payment/bill?BillStatus=' + status + '&$offset=' + offset + '&$limit=' + limit + '&createName=' + name + '&createRoleId=' + roleId)
    }

    //获取付款信息
    service.get_detail = function (orderNo) {
        return service.get(host + urlV1 + '/order/' + orderNo + '/bill/detail')
    }

    //时间统计-均值统计
    service.get_timecount_average = function (fleetName, start, end) {
        return service.get(host + urlV1 + '/time-count/average?fleetName=' + fleetName + '&startMonth=' + start + '&endMonth=' + end)
    }

    //获取数据统计列表
    service.get_data_list = function (fleetName, start, end, limit, offset) {
        return service.get(host + urlV1 + '/time-count/order?fleetName=' + fleetName + '&startMonth=' + start + '&endMonth=' + end + '&$limit=' + limit + '&$offset=' + offset)
    }

    //获取时间统计-派遣列表
    service.get_data_detail = function (orderNo) {
        return service.get(host + urlV1 + '/time-count/order/' + orderNo + '/assign')
    }

    //查询待审核报价/发票订单列表
    service.get_order_quote_list = function (verifyType, name, status, limit, offset) {
        return service.get(host + urlV1 + '/order-quote/list/third?VerifyType=' + verifyType + '&fleetName=' + name + '&verifyStatus=' + status + '&$limit=' + limit + '&$offset=' + offset)
    }
    //获取报价详情
    service.get_orderquote_detail = function (orderNo) {
        return service.get(host + urlV1 + '/order-quote/detail/' + orderNo);
    }

    //报价审核
    service.patch_order_quote = function (orderNo, data) {
        return service.patch(host + urlV1 + '/order-quote/verify/' + orderNo, data)
    }

    //获取发票详情
    service.get_order_bill = function (orderNo) {
        return service.get(host + urlV1 + '/order/' + orderNo + '/bill/detail')
    }
    //发票审核
    service.patch_order_bill = function (orderNo, data) {
        return service.patch(host + urlV1 + '/order-quote/verify/' + orderNo + '/bill', data)
    }

    // //导出订单
    // service.export = function(){
    //     return service.get(host + urlV1 + '/order/export')
    // }
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
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
    service.analysis = function (message) {
        return service.post(host + urlV1 + urlOrder + urlActions + '/parse', { 'message': message });
    }
    service.get_driver_list = function (phone) {
        return service.get(host + urlV1 + urlDriver + '/all?phone=' + phone);
    }
    service.add_driver = function (data) {
        return service.post(host + urlV1 + fav_driver, data);
    }
    service.get_fav_driver_list = function (limit) {
        return service.get(host + urlV1 + fav_driver + '/all?$limit=' + limit);
    }
    service.delete_driver = function (id) {
        return service.delete(host + urlV1 + fav_driver + '/' + id);
    }
    service.add_fix_address = function (data) {
        return service.post(host + urlV1 + fav_address, data);
    }
    service.get_fix_address = function (limit) {
        return service.get(host + urlV1 + fav_address + '/all?$limit=' + limit);
    }
    service.del_fix_address = function (id) {
        return service.delete(host + urlV1 + fav_address + '/' + id);
    }
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
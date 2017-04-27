var Road167 = angular.module('Road167', []);
Road167.factory('APIService', function ($http) {
    var service = {
        token : sessionStorage.getItem('token'),
        userId : sessionStorage.getItem('userId')
    }
    service.get = function (url) {
        return $http({
            method: 'GET',
            url: url,
            headers: {
                "Authorization": service.token,
                "user-id": service.userId
            }
        }).success(function (res) {
            if (res.http_status == 401.1) {
                goto_view('login');
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
        }).success(function (res) {
            if (res.http_status == 401.1) {
                goto_view('login');
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
        }).success(function (res) {
            if (res.http_status == 401.1) {
                goto_view('login');
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
        }).success(function (res) {
            if (res.http_status == 401.1) {
                goto_view('login');
            }
        })
    };
    service.login = function (phone, password, roleId) {
        var password = hex_md5(password);
        var data = {
            password: password,
            phone: phone,
            roleId: 7
        };

        return $http.post(host + urlLogin + urlAction + urlToken, data).then(function (res) {
            if (res.data.http_status == 200) {
                service.userId = res.userId;
                service.token = res.token;
                sessionStorage.setItem('token', res.token);
                sessionStorage.setItem('userId', res.userId);
                return res;
            }
            if (res.data.http_status == 400) {
                throw res;
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
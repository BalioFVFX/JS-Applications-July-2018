const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_HyHP4EMB7';
const APP_SECRET = 'aa377d896a924fe6839413f6f0ece26f';
const AUTH = {'Authorization':'Basic ' + btoa(APP_KEY + ':' + APP_SECRET)};
const RequestManager = (function () {

    function register(username, password) {

        return new Promise (function (resolve, reject) {
            $.ajax({
                method:'POST',
                url: BASE_URL + `user/${APP_KEY}/`,
                headers: AUTH,
                data:{username, password},
                success:function (res) {
                    $.ajax({
                        method:'POST',
                        url:BASE_URL + `appdata/${APP_KEY}/Users`,
                        headers:{'Authorization':`Kinvey ${res._kmd.authtoken}`},
                        data:{_id:res._id, username:res.username},
                        success:function (res) {
                            resolve(true);
                        },
                        error:function (err) {
                            console.log(err);
                            reject(false);
                        }

                    })
                },
                error:function (err){
                    console.log(err);
                    reject(false);
                }
            })
        });
    }

    function login(username, password) {
        return new Promise (function (resolve, reject) {
            $.ajax({
                method: 'POST',
                url: BASE_URL + `user/${APP_KEY}/login`,
                headers: AUTH,
                data: {username, password},
                success: function (res) {
                    console.log(res);
                    sessionStorage.setItem('id', res._id);
                    sessionStorage.setItem('authToken', res._kmd.authtoken);
                    resolve(true);
                },
                error: function (err) {
                    console.log(err);
                    reject(false);
                }
            })
        });


    }

    function logout() {
        return new Promise (function (resolve, reject) {
            $.ajax({
                method: 'POST',
                url: BASE_URL + `user/${APP_KEY}/_logout`,
                headers:{'Authorization':`Kinvey ${sessionStorage.getItem('authToken')}`},
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            })
        });


    }

    function getProfileDetails() {
        return new Promise (function (resolve, reject) {
            $.ajax({
                method: 'GET',
                url: BASE_URL + `appdata/${APP_KEY}/Users/${sessionStorage.getItem('id')}`,
                headers:{'Authorization':`Kinvey ${sessionStorage.getItem('authToken')}`},
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    console.log(err);
                    reject(err);
                }
            })
        });
    }

    function updateProfileDetails(firstName, lastName, phone, email) {
        $.ajax({
            method: 'PUT',
            url:BASE_URL + `appdata/${APP_KEY}/Users/${sessionStorage.getItem('id')}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data:{firstName, lastName, phone, email},
            success:function res() {
                
            },
            error:function (err) {
                console.log(err);
            }
        })
    }

    function getUsers() {
        return new Promise (function (resolve, reject) {
            $.ajax({
                method: 'GET',
                url: BASE_URL + `appdata/${APP_KEY}/Users/`,
                headers:{'Authorization':`Kinvey ${sessionStorage.getItem('authToken')}`},
                success: function (res) {
                    resolve(res);
                },
                error: function (err) {
                    reject(err);
                }
            })
        });
    }


    return {register, login, logout, getProfileDetails, updateProfileDetails, getUsers};
}());

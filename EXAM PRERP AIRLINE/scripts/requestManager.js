const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Bk5HyP_BQ';
const APP_SECRET = 'e06f293722ca418a904f0fb0e73bac22';

const RequestManager = (function () {
    function register(username, password) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: 'POST',
                url: BASE_URL + `user/${APP_KEY}/`,
                headers: {'Authorization': `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`},
                data: {username, password},
                success: function (res) {
                    Auth.save(res);
                    resolve('You have successfully registered and logged in.');
                },
                error: function (err) {
                    console.log(err);
                    reject(err);
                }
            });
        });
    }

    function login(username, password) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: 'POST',
                url: BASE_URL + `user/${APP_KEY}/login`,
                headers: {'Authorization': `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`},
                data: {username, password},
                success: function (res) {
                    Auth.save(res);
                    resolve('You have successfully logged in.');
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    function logout() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'POST',
                url: BASE_URL + `user/${APP_KEY}/_logout`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                success:function (res) {
                    Auth.clear();
                    resolve('You have successfully logged out!');
                },
                error:function (err) {
                    reject(err);
                }
            })
        })
    }
    
    function getOne(collectionName, id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'GET',
                url: BASE_URL + `appdata/${APP_KEY}/${collectionName}/${id}`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                success:function (res) {
                    resolve(res);
                },
                error:function (err) {
                    reject(err);
                }
            });
        });
    }

    function post(collectionName, data, message) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'POST',
                url: BASE_URL + `appdata/${APP_KEY}/${collectionName}`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                data:data,
                success:function (res) {
                    resolve(message);
                },
                error:function (err) {
                    reject(err);
                }
            });
        });
    }

    function put(collectionName, id, data, message) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'PUT',
                url: BASE_URL + `appdata/${APP_KEY}/${collectionName}/${id}`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                data:data,
                success:function (res) {
                    resolve(message);
                },
                error:function (err) {
                    reject(err);
                }
            });
        });
    }

    function getAll(collectionName, query) {
        if(!query){
            query = '';
        }
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'GET',
                url: BASE_URL + `appdata/${APP_KEY}/${collectionName}${query}`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                success:function (res) {
                    resolve(res);
                },
                error:function (err) {
                    reject(err);
                }
            });
        });
    }

    function deleteOne(collectionName, id) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method:'Delete',
                url: BASE_URL + `appdata/${APP_KEY}/${collectionName}/${id}`,
                headers:{'Authorization':`Kinvey ${Auth.authToken()}`},
                success:function (res) {
                    resolve('Flight deleted successfully!');
                },
                error:function (err) {
                    reject(err);
                }
            });
        });
    }

    return {register, login, logout, post, getAll, getOne, put, deleteOne};
}());

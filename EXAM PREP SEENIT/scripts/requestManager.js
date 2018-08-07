const URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_HyLiD78r7';
const APP_SECRET = '088ffed419304af9920db44b4f6c3424';

function register(username, password) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'POST',
            url: URL + `user/${APP_KEY}/`,
            headers: {'Authorization': `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`},
            data: {username, password},
            success: function (res) {
                sessionStorage.setItem('username', res.username);
                sessionStorage.setItem('id', res._id);
                sessionStorage.setItem('authToken', res._kmd.authtoken);
                resolve('You have successfully registered and logged in.');
            },
            error: function (err) {
                reject(err.responseJSON.description);
            }
        })
    });
}

function login(username, password) {
    return new Promise(function (resolve, reject) {
       $.ajax({
           method:'POST',
           url: URL + `user/${APP_KEY}/login`,
           headers: {'Authorization': `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`},
           data: {username,password},
           success:function (res) {
               sessionStorage.setItem('username', res.username);
               sessionStorage.setItem('id', res._id);
               sessionStorage.setItem('authToken', res._kmd.authtoken);
               resolve('You have successfully logged in.');
           },
           error:function (err) {
               reject(err.responseJSON.description);
           }
       });
    });
}


function logout() {
    return new Promise(function (resolve, reject) {
       $.ajax({
           method:'POST',
           url: URL + `user/${APP_KEY}/_logout`,
           headers:{'Authorization':`Kinvey ${sessionStorage.getItem('authToken')}`},
           success:function (res) {
               resolve('You have successfully logged out')
           },
           error:function (err) {
               reject(err.responseJSON.description);
           }
       })
    });
}

function getCatalog() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: URL + `appdata/${APP_KEY}/posts?query={}&sort={"_kmd.ect": -1}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err.responseJSON.description);
            }
        })
    });
}

function submitLink(url, title, imageUrl, description) {
    const author = sessionStorage.getItem('username');
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'POST',
            url: URL + `appdata/${APP_KEY}/posts`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data: {url, title, imageUrl, description, author},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                console.log(err);
                reject(err.responseJSON.description);
            }
        });
    });
}

function getLink(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: URL + `appdata/${APP_KEY}/posts/${id}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                console.log(err);
                reject(err.responseJSON.description);
            }
        });
    });
}

function editLink(url, title, imageUrl, description, id) {
    const author = sessionStorage.getItem('username');
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'PUT',
            url: URL + `appdata/${APP_KEY}/posts/${id}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data: {url, title, imageUrl, description, author},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                console.log(err);
                reject(err.responseJSON.error);
            }
        });
    });
}


function getComments(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: URL + `appdata/${APP_KEY}/comments?query={"postId":"${id}"}&sort={"_kmd.ect": -1}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                console.log(err);
                reject(err.responseJSON.description);
            }
        });
    });
}

function submitComment(content, postId) {
    const author = sessionStorage.getItem('username');
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'POST',
            url: URL + `appdata/${APP_KEY}/comments`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data: {content, author, postId},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                console.log(err);
                reject(err.responseJSON.description);
            }
        });
    });
}

function deleteComment(commentId) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'DELETE',
            url: URL + `appdata/${APP_KEY}/comments/${commentId}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err.responseJSON.description);
            }
        });
    });
}

function deletePost(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'DELETE',
            url: URL + `appdata/${APP_KEY}/posts/${id}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err.responseJSON.description);
            }
        });
    });
}
function getMyPosts() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: URL + `appdata/${APP_KEY}/posts?query={"author":"${sessionStorage.getItem('username')}"}&sort={"_kmd.ect": -1}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                resolve(res);
            },
            error: function (err) {
                reject(err.responseJSON.description);
            }
        });
});
}

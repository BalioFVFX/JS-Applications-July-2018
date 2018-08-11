const Auth = (function () {
    function isAuth() {
        if(sessionStorage.getItem('authToken')){
            return true;
        }
        return false;
    }

    function save(res) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('id', res._id);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
    }

    function clear() {
        sessionStorage.clear();
    }

    function username() {
        return sessionStorage.getItem('username');
    }

    function authToken() {
        return sessionStorage.getItem('authToken');
    }

    function id() {
        return sessionStorage.getItem('id');
    }

    return {isAuth, save, clear, username, authToken, id};
}());
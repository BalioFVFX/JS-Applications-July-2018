function startApp() {
    const BASE_URL = 'https://baas.kinvey.com/';
    const APP_KEY = 'kid_H1N5DKn4Q';
    const APP_SECRET = 'd254dd2810e649a887d0c2930fa720e0';
    showView('#viewHome');
    showMenu();
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    $('#buttonLoginUser').on('click', login);
    $('#buttonRegisterUser').on('click', register);
    $('#linkLogout').on('click', logout);

    $('#buttonCreateAd').on('click', sendAdvertisement);

    $('#linkHome').on('click', renderHome);
    $('#linkLogin').on('click', renderLogin);
    $('#linkRegister').on('click', renderRegister);
    $('#linkCreateAd').on('click', renderCreate);
    $('#linkListAds').on('click', renderList);
    $('#buttonEditAd').on('click', editAdvertisement);


    function showView(viewName) {
        $('section').hide();
        $(viewName).show();
    }

    function showMenu() {
        if (sessionStorage.getItem('authToken') === null) {
            // Show
            $('#linkHome').show();
            $('#linkLogin').show();
            $('#linkRegister').show();
            // Hide
            $('#linkCreateAd').hide();
            $('#linkListAds').hide();
            $('#linkLogout').hide();
        }
        else {
            // Show
            $('#linkHome').show();
            $('#linkCreateAd').show();
            $('#linkListAds').show();
            $('#linkLogout').show();

            // Hide

            $('#linkRegister').hide();
            $('#linkLogin').hide();
        }
    }

    function renderHome() {
        showView('#viewHome');
    }

    function renderLogin() {
        showView('#viewLogin');

    }

    function renderRegister() {
        showView('#viewRegister');
    }

    function renderCreate() {
        showView('#viewCreateAd')
    }

    function renderList() {
        showView('#viewAds');
        getAdvertisements();
    }

    function renderEdit(id, title, publisher, description, datePublished, price, image) {
        showView('#viewEditAd');

        $('#formEditAd input[name="id"]').val(id);
        $('#formEditAd input[name="title"]').val(title);
        $('#formEditAd input[name="publisher"]').val(publisher);
        $('#formEditAd textarea[name="description"]').val(description);
        $('#formEditAd input[name="datePublished"]').val(datePublished);
        $('#formEditAd input[name="price"]').val(price);
        $('#formEditAd input[name="image"]').val(image);
    }

    function renderReadMore(res) {
        showView('#viewReadMore');
        $('#formReadMore #title').text(res.title);
        $('#formReadMore #publisher').text(res.publisher)
        $('#formReadMore #description').text(res.description)
        $('#formReadMore #date').text(res.date)
        $('#formReadMore #views').text(res.views)
        $('#formReadMore #image').attr('src', res.image);
    }

    function listAdvertisements(res) {
        $('#ads').empty();
        let table = $('<table>');
        table.append('<tbody>');
        table.append('<tr><th>Title</th><th>Publisher</th><th>Description</th><th>Price</th><th>Date Published</th></tr>');
        for (let i = 0; i < res.length; i++) {
            let tr = $('<tr>');
            let readMore = $('<a href="#">[Read More]</a>');
            let td = $('<td>');
            readMore.on('click', function () {
                getInfo(res[i]._id);
            });
            tr.append(`<td>${res[i].title}</td>`);
            tr.append(`<td>${res[i].publisher}</td>`);
            tr.append(`<td>${res[i].description}</td>`);
            tr.append(`<td>${res[i].price}</td>`);
            tr.append(`<td>${res[i].date}</td>`);
            td.append(readMore);
            if (res[i]._acl.creator === sessionStorage.getItem('userId')) {
                let aDeleteButton = $('<a href="#">[Delete]</a>');
                let aEditButton = $('<a href="#">[Edit]</a>');
                aDeleteButton.on('click', function () {
                    deleteAdvertisement(res[i]._id);
                });
                aEditButton.on('click', function () {
                    renderEdit(res[i]._id, res[i].title, res[i].publisher,
                        res[i].description, res[i].date, res[i].price,
                        res[i].image, res[i]._id);
                });
                td.append(aDeleteButton);
                td.append(aEditButton);

            }
            tr.append(td);
            table.append(tr);
        }
        $('#ads').append(table);
    }


    function register() {
        let username = $('#formRegister input[name="username"]').val();
        let password = $('#formRegister input[name="passwd"]').val();

        $.ajax({
            method: 'POST',
            url: BASE_URL + `user/${APP_KEY}/`,
            headers: {'Authorization': `Basic ${btoa(APP_KEY + ':' + APP_SECRET)}`},
            data: {username, password},
            success: function (res) {
                $('#formRegister').empty();
                signIn(res);
                showInfo('You have successfully registered and logged in.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function login() {
        let username = $('#formLogin input[name="username"]').val();
        let password = $('#formLogin input[name="passwd"]').val();

        $.ajax({
            method: 'POST',
            url: BASE_URL + `user/${APP_KEY}/login`,
            headers: {'Authorization': `Basic ${btoa(`${APP_KEY}:${APP_SECRET}`)}`},
            data: {username, password},
            success: function (res) {
                console.log(res);
                signIn(res);
                showInfo('You have successfully logged in.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function signIn(res) {
        saveSession(res);
        showMenu();
        showView('#viewHome');
    }

    function logout() {
        $.ajax({
            method: 'POST',
            url: BASE_URL + `user/${APP_KEY}/_logout`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                sessionStorage.clear();
                showMenu();
                showView('#home');
                showInfo('You have successfully logged out.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function saveSession(res) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
        sessionStorage.setItem('userId', res._id);
    }


    function sendAdvertisement() {
        let title = $('#formCreateAd input[name="title"]').val();
        let description = $('#formCreateAd textarea[name="description"]').val();
        let date = $('#formCreateAd input[name="datePublished"]').val();
        let price = Number($('#formCreateAd input[name="price"]').val()).toFixed(2);
        let image = $('#formCreateAd input[name="image"]').val();
        let publisher = sessionStorage.getItem('username');
        $.ajax({
            method: 'POST',
            url: BASE_URL + `appdata/${APP_KEY}/items`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data: {
                'title': title, 'description': description, 'date': date,
                'price': price, 'publisher': publisher, 'views': 0, 'image': image
            },
            success: function (res) {
                console.log(res);
                $('#formCreateAd').trigger('reset');
                renderList();
                showInfo('Created successfully.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function getAdvertisements() {
        $.ajax({
            method: 'GET',
            url: BASE_URL + `appdata/${APP_KEY}/items`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                listAdvertisements(res);
                showInfo('Loaded successfully.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function deleteAdvertisement(id) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + `appdata/${APP_KEY}/items/${id}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                renderList();
                showInfo('Deleted successfully.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function editAdvertisement() {

        let id = $('#formEditAd input[name="id"]').val();
        let publisher = $('#formEditAd input[name="publisher"]').val();
        let title = $('#formEditAd input[name="title"]').val();
        let description = $('#formEditAd textarea[name="description"]').val();
        let date = $('#formEditAd input[name="datePublished"]').val();
        let price = Number($('#formEditAd input[name="price"]').val()).toFixed(2);
        let image = $('#formEditAd input[name="image"]').val();
        $.ajax({
            method: 'PUT',
            url: BASE_URL + `appdata/${APP_KEY}/items/${id}`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            data: {
                'title': title, 'description': description, 'date': date,
                'price': price, 'publisher': publisher, 'image': image
            },
            success: function (res) {
                $('#formEditAd').trigger('reset');
                renderList();
                showInfo('Edited successfully.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }


    function getInfo(id) {
        $.ajax({
            method: 'GET',
            url: BASE_URL + `appdata/${APP_KEY}/items/${id}/`,
            headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
            success: function (res) {
                renderReadMore(res);
                showInfo('Info loaded successfully.');
            },
            error: function (err) {
                handleAjaxError(err);
            }
        })
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response)
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error."
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description
        showError(errorMsg)
    }

    function showInfo(message) {
        let infoBox = $('#infoBox')
        infoBox.text(message)
        infoBox.show()
        setTimeout(function () {
            $('#infoBox').fadeOut()
        }, 3000)
    }

    function showError(errorMsg) {
        let errorBox = $('#errorBox')
        errorBox.text("Error: " + errorMsg)
        errorBox.show()
    }

}
const BASE_URL = 'https://baas.kinvey.com/'
const APP_KEY = 'kid_rJclP_jNQ'
const APP_SECRET = '7ee805e236954f80b24d975a30c2ec67'
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)}
const BOOKS_PER_PAGE = 10

function loginUser() {

    let username = $('#formLogin input[name="username"]').val();
    let password = $('#formLogin input[name="passwd"]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + `user/${APP_KEY}/login`,
        headers: AUTH_HEADERS,
        data: {username, password},
        success: function (res) {
            console.log(res);
            signInUser(res, 'Login successful.');
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })
}

function registerUser() {
    let username = $('#formRegister input[name="username"]').val();
    let password = $('#formRegister input[name="passwd"]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + `user/${APP_KEY}/`,
        headers: AUTH_HEADERS,
        data: {username, password},
        success: function (res) {
            console.log(res);
            signInUser(res, 'Registration successful.');
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })
}

function listBooks() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + `appdata/${APP_KEY}/books`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
        success: function (res) {
            displayPaginationAndBooks(res.reverse());
            showView('viewBooks');
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })

}


function createBook() {
    let title = $('#formCreateBook input[name="title"]').val();
    let author = $('#formCreateBook input[name="author"]').val();
    let description = $('#formCreateBook textarea[name="description"]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + `appdata/${APP_KEY}/books`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
        data: {title, author, description},
        success: function (res) {
            console.log(res);
            showInfo('Book created.')
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })

}

function deleteBook(book) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + `appdata/${APP_KEY}/books/${book._id}`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
        success: function () {
            listBooks();
            showInfo('Book deleted.')
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })
}

function loadBookForEdit(book) {
    $('#formEditBook input[name="id"]').val(book._id);
    $('#formEditBook input[name="title"]').val(book.title);
    $('#formEditBook input[name="author"]').val(book.author);
    $('#formEditBook textarea[name="description"]').val(book.description);
    showView('viewEditBook');
}

function editBook() {
    let id = $('#formEditBook input[name="id"]').val();
    let title = $('#formEditBook input[name="title"]').val();
    let author = $('#formEditBook input[name="author"]').val();
    let description = $('#formEditBook textarea[name="description"]').val();

    $.ajax({
        method: 'PUT',
        url: BASE_URL + `appdata/${APP_KEY}/books/${id}`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
        data: {title, author, description},
        success: function (res) {
            listBooks();
            showInfo('Book edited.');
        },
        error: function (err) {
            handleAjaxError(err);
        }

    })
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('userId', userInfo._id);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + `user/${APP_KEY}/_logout`,
        headers: {'Authorization': `Kinvey ${sessionStorage.getItem('authToken')}`},
        success: function (res) {
            sessionStorage.clear();
            showHideMenuLinks();
            showView('viewHome');
            showInfo('Logout successful.');
        },
        error: function (err) {
            handleAjaxError(err);
        }
    })

}

function signInUser(res, message) {
    saveAuthInSession(res);
    showHideMenuLinks();
    showView('viewHome');
    showInfo(message);
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo')
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            let bookTable = $('#books table');
            bookTable.empty();
            bookTable.append(`<tbody><tr>
								<th>Title</th>
								<th>Author</th>
								<th>Description</th>
								<th>Actions</th>
							</tr>
</tbody>`);
            let startBook = (page - 1) * BOOKS_PER_PAGE
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length)
            $(`a:contains(${page})`).addClass('active')
            for (let i = startBook; i < endBook; i++) {
                let tr = $('<tr>');
                tr.append(`<td>${books[i].title}</td><td>${books[i].author}</td><td>${books[i].description}</td>`);
                bookTable.append(tr);
                if (books[i]._acl.creator === sessionStorage.getItem('userId')) {
                    let td = $('<td>');
                    let deleteAButton = $('<a href="#   ">[Delete]</a>');
                    deleteAButton.on('click', function () {
                        deleteBook(books[i]);
                    });
                    let editAButton = $('<a href="#   ">[Edit]</a>');
                    editAButton.on('click', function () {
                        loadBookForEdit(books[i]);
                    });
                    td.append(deleteAButton);
                    td.append(editAButton);
                    tr.append(td);

                }
            }
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
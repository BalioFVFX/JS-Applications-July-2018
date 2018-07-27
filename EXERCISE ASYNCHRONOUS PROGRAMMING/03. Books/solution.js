function attachEvents() {

    const URL = 'https://baas.kinvey.com/appdata/kid_ryOVzidNm/books/';
    const USERNAME = 'TestUser';
    const PASSWORD = 'parola';
    const AUTH = btoa(USERNAME + ':' + PASSWORD);

    const TITLE = $('#bookTitle');
    const AUTHOR = $('#bookAuthor');
    const ISBN = $('#bookISBN');
    const TAGS = $('#tags');

    $('#send').on('click', createBook);
    $('#load').on('click', loadBooks);

    function createBook() {
        const data = {'title': TITLE.val(), 'author': AUTHOR.val(), 'isbn': ISBN.val(), 'tags': getTags()};
        $.ajax({
            method: 'POST',
            url: URL,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'Application/json'
            },
            data: JSON.stringify(data),
            success: function (res) {
                TITLE.val('');
                AUTHOR.val('');
                ISBN.val('');
                TAGS.val('');
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    function getTags(tags) {
        if (tags) {
            return tags.split(',');
        }
        return TAGS.val().split(',');
    }

    function loadBooks() {
        $.ajax({
            method: 'GET',
            url: URL,
            headers: {
                'Authorization': 'Basic ' + AUTH,
            },
            success: function (res) {
                $('#books').empty();
                for (let i = 0; i < res.length; i++) {
                    let book = $(`<div class="book" bookId="${res[i]._id}"></div>`);
                    book.append(`<label><span>Title: </span><input id="bookTitle" value="${res[i].title}"></label>`);
                    book.append(`<label><span>Author: </span><input id="bookAuthor" value="${res[i].author}"></label>`);
                    book.append(`<label><span>ISBN: </span> <input type="text" id="bookISBN" value="${res[i].isbn}"/></label>`);
                    book.append(`<label><span>Tags: </span> <input type="text" id="tags" value="${res[i].tags}"</label>`);

                    let updateButton = $('<button>Update</button>');
                    let deleteButton = $('<button>Delete</button>');
                    updateButton.on('click', updateBook);
                    deleteButton.on('click', deleteBook);
                    book.append(updateButton);
                    book.append(deleteButton);
                    $('#books').append(book);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    function updateBook() {
        let bookId = $(this).parent().attr('bookId');
        let bookTitle = $(this).parent().children().children('#bookTitle').val();
        let bookAuthor = $(this).parent().children().children('#bookAuthor').val();
        let bookISBN = $(this).parent().children().children('#bookISBN').val();
        let bookTags = getTags($(this).parent().children().children('#tags').val());
        let data = {title: bookTitle, author: bookAuthor, isbn: bookISBN, tags: bookTags};
        $.ajax({
            method: 'PUT',
            url: URL + bookId,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'Application/json'
            },
            data: JSON.stringify(data),
            success: function (res) {

            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    function deleteBook() {
        let bookId = $(this).parent().attr('bookId');
        let form = $(this).parent();
        $.ajax({
            method: 'DELETE',
            url: URL + bookId,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'Application/json'
            },
            success: function (res) {
                form.remove();
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
}
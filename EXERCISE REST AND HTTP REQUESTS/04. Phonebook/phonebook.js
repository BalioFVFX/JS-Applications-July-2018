function attachEvents() {
    let url = 'https://phonebook-nakov.firebaseio.com/phonebook';
    let phonebookUl = $('#phonebook');
    let person = $('#person');
    let phone = $('#phone');

    //Load the contacts

    $('#btnLoad').on('click', function () {
        $.ajax({
            method: 'GET',
            url: url + '.json',
            success: function (req) {
                phonebookUl.empty();
                for (const key in req) {
                    let li = $(`<li>${req[key].person}: ${req[key].phone} </li>`);
                    let button = $(`<button>Delete</button>`);
                    button.on('click', function () {
                        $.ajax({
                            method:'DELETE',
                            url: url + '/' + key + '.json',
                            success: function () {
                                li.remove();
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        })
                    });
                    li.append(button);
                    phonebookUl.append(li);
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    });

    // Create a contact

    $('#btnCreate').on('click', function () {
        $.ajax({
            method: 'POST',
            url: url + '.json',
            data: JSON.stringify({person: person.val(), phone: phone.val()}),
            success: function () {
                $('#btnLoad').click();
                $('#person').val('');
                $('#phone').val('');
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
}

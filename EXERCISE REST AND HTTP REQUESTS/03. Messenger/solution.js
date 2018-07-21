function attachEvents() {
    let messages = $('#messages');

    // Get the old messages

    function getMessages() {
        messages.empty();
        $.ajax({
            method: 'GET',
            url: 'https://testapp-34542.firebaseio.com/.json',
            success: function (req) {
                console.log(req);
                for (const key in req) {
                    let author = req[key].author;
                    let message = req[key].content;
                    messages.append(`${author}: ${message}` + '\n');
                }
            },
            error: function (err) {
                messages.append('Error');
            }
        });
    }

    getMessages();
    // Submit button (submit a message)

    $('#submit').on('click', function () {
        let author = $('#author').val();
        let content = $('#content').val();
        let message = {author: author, content: content, timestamp: Date.now()};
        $('#content').val('');
        $.ajax({
            method: 'POST',
            url: 'https://testapp-34542.firebaseio.com/.json',
            data: JSON.stringify(message),
            success: function () {
                messages.append(`${author}: ${content}` + '\n');
            },
            error: function () {
                message.append('Error!');
            }
        })
    })

    $('#refresh').on('click', function () {
        getMessages();
    })
}
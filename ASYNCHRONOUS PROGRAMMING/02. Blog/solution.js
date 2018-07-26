function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_BJPB1DDVX/';
    const USERNAME = 'Peter';
    const PASSWORD = 'p';
    const AUTH = btoa(USERNAME + ':' + PASSWORD);
    const SELECT_POSTS = $('#posts');
    const POST_TITLE = $('#post-title');
    const POST_BODY = $('#post-body');
    const POST_COMMENTS = $('#post-comments');
    $('#btnLoadPosts').on('click', loadPosts);
    $('#btnViewPost').on('click', viewPost);

    function viewPost() {
        $.ajax({
            method: 'GET',
            url: URL + `comments/?query={"post_id":"${SELECT_POSTS.find(':selected').attr('id')}"}`,
            headers: {'Authorization': 'Basic ' + AUTH},
            success: function (res) {
                POST_BODY.empty();
                POST_COMMENTS.empty();

                POST_TITLE.text(SELECT_POSTS.find(':selected').text());
                POST_BODY.text(SELECT_POSTS.find(':selected').attr('body'));
                for (let i = 0; i < res.length; i++) {
                    POST_COMMENTS.append(`<li>${res[i].text}</li>`);
                }
            }
            ,
            error: function (err) {
                console.log(err);
            }
        })
    }

    function loadPosts() {
        $.ajax({
            method: 'GET',
            url: URL + 'posts',
            headers: {'Authorization': 'Basic ' + AUTH},
            success: function (res) {
                for (const post of res) {
                    SELECT_POSTS.append(`<option body="${post.body}" id="${post._id}">${post.title}</option>`)
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
}

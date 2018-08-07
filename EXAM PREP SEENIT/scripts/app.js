$(document).ready(function () {

    function updateHeader() {
        if (sessionStorage.getItem('username')) {
            $('#profile').show();
            $('#profile').children('span').text(sessionStorage.getItem('username'));
        }
        else {
            $('#profile').hide();
        }
    }


    var app = Sammy('.content', function () {
        // include a plugin
        this.use('Handlebars', 'hbs');

        Handlebars.registerHelper("inc", function(value, options)
        {
            return parseInt(value) + 1;
        });

        // define a 'route'
        this.get('#/', function () {
            updateHeader();
            if (sessionStorage.getItem('authToken')) {
                this.redirect('#/catalog');
            }
            else {
                this.redirect('#/signup');
            }
        });


        this.get('#/signup', function (ctx) {
            updateHeader();
            this.partial('./templates/loginRegister.hbs');
        });


        this.get('#/catalog', function (ctx) {
            updateHeader();
            this.loadPartials({
                nav: './templates/nav.hbs'
            }).then(function (res) {
                let that = this;
                getCatalog().then(function (posts) {
                    for (let i = 0; i < posts.length; i++) {
                        posts[i].date = calcTime(posts[i]._kmd.lmt);
                        if(posts[i]._acl.creator === sessionStorage.getItem('id')){
                            posts[i].isAuthor = true;
                        }
                    }
                    ctx.posts = posts;
                    that.partial('./templates/catalog.hbs')
                }).catch(function (err) {
                    showError(err);
                })
            });
        });

        this.get('#/submit', function (ctx) {
            updateHeader();
            this.loadPartials({
                nav: './templates/nav.hbs'
            }).then(function (res) {
                this.partial('./templates/linkSubmit.hbs');
            });
        });


        this.get('#/edit/:id', function (ctx) {
            updateHeader();
            this.loadPartials({
                nav:'./templates/nav.hbs'
            }).then(function (res) {
                let that = this;
                getLink(ctx.params.id).then(function (res) {
                    ctx.url = res.url;
                    ctx.title = res.title;
                    ctx.imageUrl = res.imageUrl;
                    ctx.description = res.description;
                    ctx._id = res._id;
                    that.partial('./templates/edit.hbs');
                }).catch(function (err) {
                    showError(err);
                })

            })
        });

        this.put('#/edit:id', function (ctx) {
            const id = ctx.params.id.substring(1, ctx.params.id.length);
            const title = ctx.params.title;
            const url = ctx.params.url;
            const imageUrl = ctx.params.image;
            const description = ctx.params.description;
            console.log(id);
            if(!title){
                showError('Title is empty');
            }
            else if(!url){
                showError('Url is empty');
            }
            else{
                editLink(url, title, imageUrl, description, id).then(function (res) {
                    showInfo('Link updated successfully');
                    console.log(res);
                    ctx.redirect('#/catalog');
                }).catch(function (err) {
                    showError(err);
                })
            }
        });

        this.post('#/submit', function (ctx) {
           const url = this.params.url;
           const title = this.params.title;
           const image = this.params.image;
           const comment = this.params.comment;

           if(!url){
               showError('Url is empty');
           }else if(!title){
               showError('Title is empty');
           }
           else{
               submitLink(url, title, image, comment).then(function (res) {
                   showInfo('Link submitted successfully');
                   ctx.redirect('#/catalog');
               }).catch(function (err) {
                   showError(err);
               })
           }
        });


        this.post('#/login', function (ctx) {
            const username = this.params.username;
            const password = this.params.password;

            if (!username) {
                showError('Username is empty');
            }
            else if (!password) {
                showError('Password is empty');
            }
            else {
                login(username, password).then(function (res) {
                    showInfo(res);
                    ctx.redirect('#/');
                }).catch(function (err) {
                    showError(err);
                })
            }


        });

        this.post('#/register', function (ctx) {
            const username = this.params.username;
            const password = this.params.password;
            const repPassword = this.params.repeatPass;
            if (!username) {
                showError('Username is empty');
            }
            else if (!password) {
                showError('Password is empty');
            }
            else if (password !== repPassword) {
                showError('Passwords are different');
            }
            else {
                register(username, password).then(function (res) {
                    showInfo(res);
                    ctx.redirect('#/');
                }).catch(function (err) {
                    showError(err);
                })
            }
        });

        this.get('#/logout', function (ctx) {
            logout().then(function (res) {
                showInfo(res);
                sessionStorage.clear();
                ctx.redirect('#/');
            }).catch(function (err) {
                showError(err);
            })
        });

        this.get('#/comments/:id', function (ctx) {
            updateHeader();
            let id = this.params.id;
            console.log(id);
            this.loadPartials({
                nav:'./templates/nav.hbs'
            }).then(function () {
                let that = this;
                Promise.all([getComments(id), getLink(id)]).then(function (values) {

                    for (let i = 0; i < values[0].length; i++) {
                        values[0][i].date = calcTime(values[0][i]._kmd.lmt);
                        if(values[0][i]._acl.creator === sessionStorage.getItem('id')){
                            values[0][i].isAuthor = true;
                        }
                        else{
                            values[0][i].isAuthor = false;
                        }
                    }
                    if(values[1]._acl.creator === sessionStorage.getItem('id')){
                        ctx.islinkauthor = true;
                    }

                    ctx.isLinkCreator = values[1].isLinkCreator;
                    ctx.linkUrl = values[1].url;
                    ctx.linkTitle = values[1].title;
                    ctx.linkImgUrl = values[1].imageUrl;
                    ctx.linkDescription = values[1].description;
                    ctx.linkDate = calcTime(values[1]._kmd.lmt);
                    ctx.linkId = values[1]._id;

                    ctx.comments = values[0];

                    that.partial('./templates/comments.hbs');
                }).catch(function (err) {
                    showError(err);
                })
            })
        });

        this.get('#/myposts', function (ctx) {
            this.loadPartials({
                nav:'./templates/nav.hbs'
            }).then(function () {
                let that = this;
                getMyPosts().then(function (posts) {
                    for (let i = 0; i < posts.length; i++) {
                        posts[i].time = calcTime(posts[i]._kmd.lmt);
                        posts[i].author = sessionStorage.getItem('username');
                    }
                    ctx.posts = posts;
                    that.partial('./templates/myposts.hbs');
                }).catch(function (err) {
                    showError(err);
                })
            })
        })


        this.post('#/comments/:id', function (ctx) {
            const content = this.params.content;
            const id = this.params.id.substr(1, this.params.id.length);
            if(!content){
                showError('Empty comment');
            }
            else{
                let that = this;
                submitComment(content, id).then(function () {
                    showInfo('Comment submitted successfully');
                    window.location.reload();
                }).catch(function (err) {
                    showError(err);
                });
            }
        });

        this.get('#/deleteComment/:id', function (ctx) {
            const id = ctx.params.id.substring(1, ctx.params.id.length);
            console.log(ctx);
            deleteComment(id).then(function (res) {
                showInfo('Comment deleted successfully');
                history.back();
            }).catch(function (err) {
                showError(err);
            })
        });

        this.get('#/delete/:id', function (ctx) {
            const id = ctx.params.id;
            deletePost(id).then(function (res) {
                showInfo('Link deleted successfully');
                ctx.redirect('#/catalog');
            }).catch(function (err) {
                showError(err);
            })
        });

    });


// start the application
    app.run('#/');

});
// initialize the application

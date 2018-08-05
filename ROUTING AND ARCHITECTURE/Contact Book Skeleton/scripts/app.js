$(() => {

    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#main', function () {
            if (sessionStorage.getItem('authToken')) {
                this.redirect('#/profile');
            }
            else {
                this.redirect('#/login');
            }
        });

        this.get('#/login', function () {
            if (!sessionStorage.getItem('authToken')) {
                this.partial('templates/login.hbs');
            }
        });

        this.get('#/register', function () {
            if (!sessionStorage.getItem('authToken')) {
                this.partial('templates/register.hbs');
            }
        });

        this.get('#/contacts', function (context) {
            if(sessionStorage.getItem('authToken')){
                let hbs = this;
                    RequestManager.getUsers().then(function (res) {
                        hbs.users = res;
                        loadPartial();
                        function loadPartial(){
                                hbs.load('templates/partials/details.hbs').then(function (partial) {
                                    context.partials = {details: partial};
                                }).then(function () {
                                hbs.partial('templates/contacts.hbs').then(function () {
                                    renderDetails(context);
                                });
                            });
                        }

                        function renderDetails(ctx) {
                            $('.contact').on('click', function () {
                                let id = Number($(this).attr('data-id'));
                                ctx.firstName = res[id].firstName;
                                ctx.lastName = res[id].lastName;
                                ctx.phone = res[id].phone;
                                ctx.email = res[id].email;
                                loadPartial();
                            })
                        }

                    });
            }
            else{
                this.redirect('#/login');
            }
        });

        this.get('#/profile', function (context) {
            if (sessionStorage.getItem('authToken')) {
                let hbs = this;
                RequestManager.getProfileDetails().then(function (res) {
                    hbs.firstName = res.firstName;
                    hbs.lastName = res.lastName;
                    hbs.phone = res.phone;
                    hbs.email = res.email;
                    context.partial('templates/profile.hbs');
                }).catch(function (err) {
                    context.redirect('#/')
                });
            }
            else {
                this.redirect('#/login');
            }

        });

        this.get('#/logout', function () {
            let hbs = this;
            RequestManager.logout().then(function (res, err) {
                sessionStorage.clear();
                hbs.redirect('#/login');
            }).catch(function (err) {
                console.log(err);
            })
        });

        this.put('#/profile', function (context) {
            RequestManager.updateProfileDetails(context.params.firstName,
                context.params.lastName, context.params.phone, context.params.email);
        });


        this.post('#/register', function (context) {
            let hbs = this;
            RequestManager.register(this.params.username, this.params.password).then(function (isAuth) {
                hbs.redirect('#/profile');
            }).catch(function (err) {

            });
        });

        this.post('#/login', function (context) {
            let hbs = this;
            RequestManager.login(this.params.username, this.params.password).then(function (isAuth) {
                hbs.redirect('#/profile');
            }).catch(function (err) {
            })
        });


    });
    app.run('#main');
});
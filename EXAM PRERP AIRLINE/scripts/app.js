$(document).ready(function () {

    function convertDate(dateStr){
        let date = new Date(dateStr);
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        return date.getDay() + ' ' + months[date.getMonth()];
    }

    let app = Sammy('#container', function () {
        // include a plugin
        this.use('Handlebars', 'hbs');

        this.get('#/', function (ctx) {
            if (Auth.authToken()) {
                ctx.redirect('#/home');
            }
            else {
                ctx.redirect('#/login');
            }
        });

        this.get('#/register', function (ctx) {
            this.loadPartials({
                nav: './templates/navigation.hbs'
            }).then(function () {
                ctx.auth = Auth.isAuth();
                ctx.username = Auth.username();
                this.partial('./templates/register.hbs');
            });
        });

        this.get('#/login', function (ctx) {
            this.loadPartials({
                nav: './templates/navigation.hbs'
            }).then(function () {
                ctx.auth = Auth.isAuth();
                ctx.username = Auth.username();
                this.partial('./templates/login.hbs');
            })
        });

        this.get('#/home', function (ctx) {
            this.loadPartials({
                nav: './templates/navigation.hbs'
            }).then(function () {
                ctx.auth = Auth.isAuth();
                ctx.username = Auth.username;
                let that = this;
                RequestManager.getAll('flights', '?query={"isPublished":"true"}').then(function (flights) {
                    for (let i = 0; i < flights.length; i++) {
                        flights[i].departureDate = convertDate(flights[i].departureDate);
                    }
                    ctx.flights = flights;
                    that.partial('./templates/home.hbs');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                });
            })
        });

        this.get('#/addFlight', function (ctx) {
            this.loadPartials({
                nav: './templates/navigation.hbs'
            }).then(function () {
                ctx.auth = Auth.isAuth();
                ctx.username = Auth.username;
                this.partial('./templates/addFlight.hbs');
            })
        });

        this.get('#/flightDetails/:id', function (ctx) {

            this.loadPartials({
                nav: './templates/navigation.hbs'
           }).then(function () {
               const id = ctx.params.id;
                let that = this;
               RequestManager.getOne('flights', id).then(function (res) {
                   ctx.auth = Auth.isAuth();
                   ctx.username = Auth.username;
                   ctx.img = res.img;
                   ctx.destination = res.destination;
                   ctx.origin = res.origin;
                   ctx.departureDate = convertDate(res.departureDate);
                   ctx._id = res._id;
                   if(res._acl.creator === Auth.id()){
                       ctx.isAuthor = true;
                   }
                   ctx.seats = res.seats;
                   ctx.cost = res.cost;
                   that.partial('./templates/flightDetails.hbs');
               }).catch(function (err) {
                   Notify.handleAjaxError(err);
               })
           })
        });

        this.get('#/myFlights', function (ctx) {
           this.loadPartials({
               nav: './templates/navigation.hbs'
           }).then(function () {
               ctx.Auth = Auth.isAuth();
               ctx.username = Auth.username;
               let that = this;
               RequestManager.getAll('flights', `?query={"_acl.creator":"${Auth.id()}"}`).then(function (flights) {
                   ctx.auth = Auth.isAuth();
                   ctx.username = Auth.username();

                   for (let i = 0; i < flights.length; i++) {
                       flights[i].departureDate = convertDate(flights[i].departureDate);
                   }
                   Notify.showMessage('Flights loaded successfully!');

                   ctx.flights = flights;
                   that.partial('./templates/myFlights.hbs');
               }).catch(function (err) {
                   Notify.handleAjaxError(err);
               })

           });
        });

        this.get('#/edit/:id', function (ctx) {
           this.loadPartials({
               nav:'./templates/navigation.hbs'
           }).then(function () {
               let that = this;
               RequestManager.getOne('flights', ctx.params.id).then(function (res) {
                   ctx.destination = res.destination;
                   ctx.origin = res.origin;
                   ctx.departureDate = res.departureDate;
                   ctx.departureTime = res.departureTime;
                   ctx.seats = res.seats;
                   ctx.cost = res.cost;
                   ctx.img = res.img;
                   ctx.isPublished = res.isPublished;
                   ctx._id = res._id;
                   that.partial('./templates/editFlight.hbs');
               }).catch(function (err) {
                   Notify.handleAjaxError(err);
               })
           })
        });


        // POST/PUT

        this.put('#/edit/:id', function (ctx) {
            const cost = Number(ctx.params.cost);
            const departureDate = ctx.params.departureDate;
            const departureTime = ctx.params.departureTime;
            const destination = ctx.params.destination;
            const img = ctx.params.img;
            const origin = ctx.params.origin;
            const seats = Number(ctx.params.seats);
            let isPublished = false;
            const id = ctx.path.substring(7, ctx.path.length);
            if (ctx.params.public) {
                isPublished = true;
            }

            if (typeof cost !== 'number') {
                Notify.showError('Cost must be a number!');
            }
            else if (typeof seats !== 'number') {
                Notify.showError('Seats must be a number!');
            }
            else if (cost <= 0) {
                Notify.showError('Cost must be a positive number!');
            }
            else if (seats <= 0) {
                Notify.showError('Seats must be a positive number!');
            }
            else if (destination === '') {
                Notify.showError('Destination must be non-empty text!');
            }
            else if (origin === '') {
                Notify.showError('Origin must be non-empty text!');
            }
            else {
                RequestManager.put('flights', id, {
                    cost, departureDate, departureTime,
                    destination, img, origin, seats, isPublished
                }, 'Flight was edited successfully!').then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect(`#/flightDetails/${id}`);
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                });
            }
        });

        this.post('#/addFlight', function (ctx) {
            const cost = Number(ctx.params.cost);
            const departureDate = ctx.params.departureDate;
            const departureTime = ctx.params.departureTime;
            const destination = ctx.params.destination;
            const img = ctx.params.img;
            const origin = ctx.params.origin;
            const seats = Number(ctx.params.seats);
            let isPublished = false;
            if (ctx.params.public) {
                isPublished = true;
            }

            if (typeof cost !== 'number') {
                Notify.showError('Cost must be a number!');
            }
            else if (typeof seats !== 'number') {
                Notify.showError('Seats must be a number!');
            }
            else if (cost <= 0) {
                Notify.showError('Cost must be a positive number!');
            }
            else if (seats <= 0) {
                Notify.showError('Seats must be a positive number!');
            }
            else if (destination === '') {
                Notify.showError('Destination must be non-empty text!');
            }
            else if (origin === '') {
                Notify.showError('Origin must be non-empty text!');
            }
            else {
                RequestManager.post('flights', {
                    cost, departureDate, departureTime,
                    destination, img, origin, seats, isPublished
                }, 'Flight was added successfully').then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect('#/home');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                });
            }
        });

        this.post('#/register', function (ctx) {
            const username = ctx.params.username;
            const password = ctx.params.pass;
            const repPassword = ctx.params.checkPass;

            if (!username) {
                Notify.showError('Username cannot be empty!');
            }
            else if(username.length < 5){
                Notify.showError('Username must be at least 5 characters long!');
            }
            else if (!password) {
                Notify.showError('Password cannot be empty!')
            }
            else if (password !== repPassword) {
                Notify.showError('Passwords does not match!')
            }
            else {
                RequestManager.register(username, password).then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect('#/home');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                });
            }
        });

        this.post('#/login', function (ctx) {
            const username = ctx.params.username;
            const password = ctx.params.pass;

            if (!username) {
                Notify.showError('Username cannot be empty!');
            }
            else if (!password) {
                Notify.showError('Password cannot be empty!');
            }
            else {
                RequestManager.login(username, password).then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect('#/home');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                });
            }
        });

        this.get('#/delete/:id', function (ctx) {
            const id = ctx.params.id;
            RequestManager.deleteOne('flights', id).then(function (res) {
                Notify.showMessage(res);
                history.back();
            }).catch(function (err) {
                Notify.handleAjaxError(err);
            })
        });

        this.get('#/logout', function (ctx) {
            RequestManager.logout().then(function (res) {
                Notify.showMessage(res);
                ctx.redirect('#/login');
            }).catch(function (err) {
                Notify.handleAjaxError(err);
            })
        })

    });

    app.run('#/');

});
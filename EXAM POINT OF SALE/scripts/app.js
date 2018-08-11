$(document).ready(function () {

    var app = Sammy('#container', function() {

        this.use('Handlebars', 'hbs');

        this.get('#/', function (ctx) {
            if(Auth.isAuth()){
                ctx.redirect('#/home');
            }else{
                this.partial('./templates/loginRegister.hbs');
            }
        });

        this.get('#/home', function (ctx) {
            this.loadPartials({
                nav:'./templates/navigation.hbs'
            }).then(function () {
               let that = this;
               let receiptId;
               ctx.user = Auth.username();
               RequestManager.getAll('receipts', `?query={"_acl.creator":"${Auth.id()}","active":"true"}`).then(function (res) {
                   if(res.length === 0){
                       RequestManager.post('receipts', {active:true, productCount:0, total:0}).then(function () {
                           Notify.showMessage('Receipt created successfully!');
                           location.reload();
                       }).catch(function (err) {
                           Notify.handleAjaxError(err);
                       })
                   }
                   else{
                       receiptId = res[0]._id;
                       Notify.showMessage('Getting entries...');
                       RequestManager.getAll('entries', `?query={"receiptId":"${receiptId}"}`).then(function (entry) {
                           ctx._id = receiptId;
                           entry = resFormatter.calculateSubTotal(entry);
                           ctx.entry = entry;
                           that.partial('./templates/createRecipt.hbs').then(function () {
                               resFormatter.updateTotal();
                           });
                       }).catch(function (err) {
                           Notify.handleAjaxError(err);
                       });

                   }
               }).catch(function (err) {
                   Notify.handleAjaxError(err);
               });

            });
        });

        this.get('#/overview', function (ctx) {
            this.loadPartials({
                nav:'./templates/navigation.hbs'
            }).then(function () {
                let that = this;
                ctx.user = Auth.username();
                RequestManager.getAll('receipts', `?query={"_acl.creator":"${Auth.id()}","active":"false"}`).then(function (res) {
                    let overview = resFormatter.overviewFormat(res);
                    ctx.receipts = overview[0];
                    ctx.allTotal = overview[1];
                    that.partial('./templates/allRecipts.hbs');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                })
            });
        });

        this.get('#/details/:id', function (ctx) {
            this.loadPartials({
                nav:'./templates/navigation.hbs'
            }).then(function () {
                ctx.user = Auth.username();
                let that = this;
                const id = ctx.params.id;
                RequestManager.getAll('entries', `?query={"receiptId":"${id}"}`).then(function (res) {
                    res = resFormatter.calculateSubTotal(res);
                    ctx.entry = res;
                    console.log(res);
                    that.partial('./templates/reciptDetails.hbs');
                })
            })
        });

        this.post('#/home/:id', function (ctx) {
            const type = ctx.params.type;
            const qty = Number(ctx.params.qty);
            const price = Number(ctx.params.price);
            const receiptId = ctx.params.id;
            if(type === ''){
                Notify.showError('Product name must be non-empty text');
            }
            else if(typeof qty !== 'number'){
                Notify.showError('Quantity must be a number!');
            }
            else if(typeof price !== 'number'){
                Notify.showError('Price must be a number!')
            }
            else{
                RequestManager.post('entries', {type,qty,price,receiptId}).then(function (res) {
                    Notify.showMessage('Successfully added entry!');
                    resFormatter.updateTotal(qty * price);
                    resFormatter.updateReceiptTable(type, qty, price, res._id);
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                })
            }
        });

        this.put('#/create/:id', function (ctx) {

            if(!domFetcher.isValidReceipt()){
                Notify.showError('Receipt cannot be empty!');
            }
            else{
                const total = domFetcher.getTotal();
                const productCount = domFetcher.getTotalQuantity();
                const id = ctx.params.id;
                RequestManager.put('receipts', id, {active:false, productCount:productCount, total:total}).then(function () {
                    Notify.showMessage('Checkout successful!');
                    ctx.redirect('#/overview');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                })
            }

            console.log(domFetcher.isValidReceipt());
            console.log(ctx);
        })

        this.post('#/register', function (ctx) {
            const username = ctx.params['username-register'];
            const password = ctx.params['password-register'];
            const passwordRep = ctx.params['password-register-check'];
            if(typeof (username) !== 'string' ||  username.length < 5){
                Notify.showError('Username must be a text with at least 5 characters long!');
            }
            else if(!password){
                Notify.showError('Password must be non-empty!');
            }
            else if(password !== passwordRep){
                Notify.showError('Passwords does not match!');
            }
            else{
                RequestManager.register(username, password).then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect('#/home');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                })
            }
        });

        this.post('#/login', function (ctx) {
            const username = ctx.params['username-login'];
            const password = ctx.params['password-login'];

            if(typeof (username) !== 'string' ||  username.length < 5){
                Notify.showError('Username must be a text with at least 5 characters long!');
            }
            else if(!password){
                Notify.showError('Password must be non-empty!');
            }
            else{
                RequestManager.login(username, password).then(function (res) {
                    Notify.showMessage(res);
                    ctx.redirect('#/home');
                }).catch(function (err) {
                    Notify.handleAjaxError(err);
                })
            }
        });

        this.get('#/delete/:id', function (ctx) {
            RequestManager.deleteOne('entries', ctx.params.id).then(function () {
                Notify.showMessage('Entry deleted successfully!');
                ctx.redirect('#/home');
            }).catch(function (err) {
                Notify.handleAjaxError(err);
            })
            console.log(ctx);
        });

        this.get('#/logout',function (ctx) {
            RequestManager.logout().then(function (res) {
                Notify.showMessage(res);
                ctx.redirect('#/');
            }).catch(function (err) {
                Notify.handleAjaxError(err);
            })
        })

    });

// start the application
    app.run('#/');
});

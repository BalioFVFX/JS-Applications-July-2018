$(() => {
    $.get('data.json').then(function (res) {
        $('#list .content').append(Handlebars.templates['contacts.hbs']({contacts:res}));




        // Attach events
        $('#list > .content > .contact').on('click', function () {
            $('#list > .content').children().removeClass('contactSelected');
            $('#details :nth-child(2)').remove();
            $(this).addClass('contactSelected');

            let preCompiledNames = Handlebars.templates['namesPartial.hbs'](res[$(this).attr('data-id')]);
            let preCompiledDetails = Handlebars.templates['contactsPartial.hbs'](res[$(this).attr('data-id')]);

            Handlebars.registerPartial('names', preCompiledNames);
            Handlebars.registerPartial('contacts', preCompiledDetails);
            let details = Handlebars.templates['details.hbs']({test:0});
            $('#details').append(details);

        })

    })

});
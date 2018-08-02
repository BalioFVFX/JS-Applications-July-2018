$(() => {
    renderCatTemplate();
    console.log('test o');

    function renderCatTemplate() {
        // TODO: Render cat template and attach events
        $('.btn').on('click', function () {
            if($(this).text() === 'Show status code'){
                $(this).text('Hide status code');
                let source = $('#cat-template').html();
                let template  = Handlebars.compile(source);
                let id = $(this).parent('div').children('div').attr('id');
                let catInfo = cats.filter(cat => cat.id === id);
                let html = template(catInfo[0]);
                $(this).parent().append(html);
            }else{
                $(this).text('Show status code');
                console.log($(this).parent());
                console.log($(this).parent().children('#info').remove());
                console.log($(this).parent());
            }

        })
    }

})

const URL = 'https://testapp-34542.firebaseio.com/phonebook';

$('#btnLoad').on('click', function () {
   $.ajax({
       method:'GET',
       url: URL + '.json'
   }) .then(function (response) {
       $('#phonebook').empty();
       for (let key in response) {
           let li = $(`<li>${response[key].name}: ${response[key].phone}</li>`);
           let a = $('<a href="#"> [Delete]</a>');
           a.on('click', function () {
               $.ajax({
                   method:'DELETE',
                   url:URL + `/${key}.json`
               }).then(function () {
                   a.parent().remove();
               }).catch(function (err) {
                   console.log(err);
               })
           });
           li.append(a);
           $('#phonebook').append(li);
       }

   }).catch(function (err) {
       console.log(err);
   })
});

$('#btnCreate').on('click', function () {
    let name = $('#person').val();
    let phone = $('#phone').val();
   $.ajax({
       method:'POST',
       url: URL + '.json',
       data:JSON.stringify({name:name, phone:phone})
   }).then(function () {
       $('#person').val('');
       $('#phone').val('');
   }).catch(function (err) {
       console.log(err);
   })
});
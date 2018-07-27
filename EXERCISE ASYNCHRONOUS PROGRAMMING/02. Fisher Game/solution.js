function attachEvents() {
    const USERNAME = 'TestUser';
    const PASSWORD = 'parola';
    const AUTH = btoa(USERNAME + ':' + PASSWORD);
    const URL = 'https://baas.kinvey.com/appdata/kid_HkQWEYdNQ/biggestCatches/';
    $('.load').on('click', loadData);
    $('.add').on('click', createCatch);


    const ANGLERPOST = $('#addForm').children('.angler');
    const WEIGHTPOST = $('#addForm').children('.weight');
    const SPECIESPOST = $('#addForm').children('.species');
    const LOCATIONPOST = $('#addForm').children('.location');
    const BAITPOST = $('#addForm').children('.bait');
    const CAPTURETIMEPOST = $('#addForm').children('.captureTime');


    function loadData() {
        $.ajax({
            method: 'GET',
            url: URL,
            headers: {
                'Authorization': 'Basic ' + AUTH
            },
            success: function (res) {
                $('#catches').empty();
                for (const fish of res) {
                    let divCatch = $(`<div class="catch" data-id="${fish._id}"></div>`);
                    divCatch.append(`<label>Angler</label>`);
                    divCatch.append(`<input type="text" class="angler" value="${fish.angler}"/>`);
                    divCatch.append(`<label>Weight</label>`);
                    divCatch.append(`<input type="number" class="weight" value="${fish.weight}"/>`);
                    divCatch.append(`<label>Species</label>`);
                    divCatch.append(`<input type="text" class="species" value="${fish.species}"/>`);
                    divCatch.append(`<label>Location</label>`);
                    divCatch.append(`<input type="text" class="location" value="${fish.location}"/>`);
                    divCatch.append(`<label>Bait</label>`);
                    divCatch.append(`<input type="text" class="bait" value="${fish.bait}"/>`);
                    divCatch.append(`<label>Capture Time</label>`);
                    divCatch.append(`<input type="number" class="captureTime" value="${fish.captureTime}"/>`);

                    let updateButton = $('<button class="update">Update</button>');
                    let deleteButton = $('<button class="delete">Delete</button>');
                    updateButton.on('click', updateCatch);
                    deleteButton.on('click', deleteCatch);

                    divCatch.append(updateButton);
                    divCatch.append(deleteButton);

                    $('#catches').append(divCatch);

                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function createCatch() {
        let data = {
            "angler": ANGLERPOST.val(), "weight": Number(WEIGHTPOST.val()), "species": SPECIESPOST.val(),
            "location": LOCATIONPOST.val(), "bait": BAITPOST.val(), "captureTime": Number(CAPTURETIMEPOST.val())
        };

        $.ajax({
            method: 'POST',
            url: URL,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (res) {
                ANGLERPOST.val('');
                WEIGHTPOST.val('');
                SPECIESPOST.val('');
                LOCATIONPOST.val('');
                BAITPOST.val('');
                CAPTURETIMEPOST.val('');
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function updateCatch() {
        let id = $(this).parent().attr('data-id');
        let angler = $(this).parent().children('.angler').val();
        let weight = Number($(this).parent().children('.weight').val());
        let species = $(this).parent().children('.species').val();
        let location = $(this).parent().children('.location').val();
        let bait = $(this).parent().children('.bait').val();
        let captureTime = Number($(this).parent().children('.captureTime').val());
        let data = {
            "angler": angler, "weight": weight, "species": species,
            "location": location, "bait": bait, "captureTime": captureTime
        };

        $.ajax({
            method: 'PUT',
            url: URL + id,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (res) {

            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function deleteCatch() {
        let id = $(this).parent().attr('data-id');
        let button = $(this);
        $.ajax({
            method: 'DELETE',
            url: URL + id,
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'application/json'
            },
            success: function (res) {
                button.parent().remove();
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}
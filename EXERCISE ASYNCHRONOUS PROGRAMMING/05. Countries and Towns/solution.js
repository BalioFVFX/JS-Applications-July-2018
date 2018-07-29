const URL = 'https://baas.kinvey.com/appdata/kid_SyY2GbK4m/';
const USERNAME = 'TestUser';
const PASSWORD = 'parola';
const AUTH = btoa(USERNAME + ':' + PASSWORD);

$('#sendCountry').on('click', sendCountry);
$('#sendTown').on('click', sendTown);
$('#editCountry').on('click', editCountry);
$('#deleteCountry').on('click', deleteCountry);

const COUNTRY = $('#countryName');
const COUNTRIES = $('#countries');
const TOWN = $('#townName');
const TOWNS = $('#towns');

COUNTRIES.on('change', loadTowns);


function sendCountry() {
    $.ajax({
        method:'POST',
        url:URL + 'Country',
        headers:{
            'Authorization': 'Basic ' + AUTH,
            'Content-Type':'application/json'
        },
        data:JSON.stringify({name:COUNTRY.val()}),

        success:function (res) {
            COUNTRIES.append(`<option>${COUNTRY.val()}</option>`);
            COUNTRY.val('');
        },
        error:function (err) {
            console.log(err);
        }

    })
}

function loadData() {
    loadCountries().then(function (data) {
        for (let i = 0; i < data.length; i++) {
            COUNTRIES.append(`<option countryId="${data[i]._id}">${data[i].name}</option>`);
        }
        $('#editCountry').css('display', '');
        $('#deleteCountry').css('display', '');
        loadTowns();
    })
}

function loadCountries() {
    return new Promise((resolve, reject) => {
        $.ajax({
            method:'GET',
            url:URL + 'Country',
            headers:{
                'Authorization':'Basic ' + AUTH
            },
            success:function (res) {
                resolve(res);

            },
            error:function (err) {
                reject(err);
            }
        })
    });
}

function loadTowns() {
        $.ajax({
            method:'GET',
            url:URL + `Town/?query={"country":"${COUNTRIES.children(':selected').text()}"}`,
            headers:{
                'Authorization':'Basic ' + AUTH
            },
            success:function (res) {
                TOWNS.empty();
                for (let i = 0; i < res.length; i++) {
                    let li = $(`<li townId="${res[i]._id}">${res[i].name} </li>`);
                    let input = $('<input>');
                    input.css('display', 'none');
                    let editButton = $('<button>Edit</button>');
                    let deleteButton = $('<button>Delete</button>');
                    editButton.on('click',function () {
                       if($(this).text() === 'Edit'){
                           $(this).text('Update');
                           input.val($(this).parent().text().substr(0, $(this).parent().text().length - 13));
                           input.css('display', '');
                       }
                       else{
                           $(this).text('Edit');
                           let townId = $(this).parent().attr('townId');
                           updateTown(townId, input.val());
                           $(this).parent().contents().first().replaceWith(`${input.val()} `);
                           input.css('display', 'none');
                           input.val('');
                       }
                    });
                    deleteButton.on('click', function () {
                        let townId = $(this).parent().attr('townId');
                        deleteTown(townId);
                        $(this).parent().remove();
                    })
                    li.append(editButton);
                    li.append(deleteButton);
                    li.append(input);
                    TOWNS.append(li);
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
}

function sendTown() {
    const data = {name: TOWN.val(), country:COUNTRIES.children(':selected').val()};
    $.ajax({
        method:'POST',
        url:URL + 'Town',
        headers:{
            'Authorization':'Basic ' + AUTH,
            'Content-Type':'application/json'
        },
        data:JSON.stringify(data),
        success:function (res) {
            TOWNS.append(`<li>${TOWN.val()}</li>`);
            TOWN.val('');
        },
        error:function (err) {
            console.log(err);
        }
    })
}

function editCountry() {
    let newCountryInput = $('#newCountry');
    if($(this).text() === 'Edit'){
        $(this).text('Update');
        newCountryInput.val(COUNTRIES.children(':selected').val());
        newCountryInput.css('display', '');
    }else{
        $(this).text('Edit');
        updateCountry(COUNTRIES.children(':selected').attr('countryId'), newCountryInput.val());
        COUNTRIES.children(':selected').text(newCountryInput.val());
        loadTowns();
        newCountryInput.css('display', 'none');
        newCountryInput.val('');

    }
}

function updateCountry(countryId, newCountryName) {
    $.ajax({
        method:'PUT',
        url:URL + `Country/${countryId}`,
        headers:{
            'Authorization':'Basic ' + AUTH,
            'Content-Type':'application/json'
        },
        data:JSON.stringify({name:newCountryName}),
        success:function (res) {

        },
        error:function (err) {
            console.log(err);
        }
    })
}

function updateTown(townId, newTownName) {
    $.ajax({
        method:'PUT',
        url:URL + `Town/${townId}`,
        headers:{
            'Authorization':'Basic ' + AUTH,
            'Content-Type':'application/json'
        },
        data:JSON.stringify({name:newTownName, country:COUNTRIES.children(':selected').val()}),
        success:function (res) {

        },
        error:function (err) {
            console.log(err);
        }
    })
}

function deleteCountry() {
    $.ajax({
        method:'Delete',
        url:URL + `Country/${COUNTRIES.children(':selected').attr('countryId')}`,
        headers:{
            'Authorization':'Basic ' + AUTH,
        },
        success:function (res) {
            COUNTRIES.children().remove(':selected');
            loadTowns();
        },
        error:function (err) {
            console.log(err);
        }
    })
}

function deleteTown(townId) {
    $.ajax({
        method:'Delete',
        url:URL + `Town/${townId}`,
        headers:{
            'Authorization':'Basic ' + AUTH,
        },
        success:function (res) {

        },
        error:function (err) {
            console.log(err);
        }
    })
}
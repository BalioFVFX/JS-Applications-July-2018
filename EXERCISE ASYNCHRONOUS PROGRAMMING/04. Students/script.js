const URL =  'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students';
const USERNAME = 'guest';
const PASSWORD = 'guest';
const AUTH = btoa(USERNAME + ':' + PASSWORD);

const results = $('#results');
const ID = $('#studentID');
const FIRSTNAME = $('#studentFirstName');
const LASTNAME = $('#studentLastName');
const FACULTYNUMBER = $('#studentFacultyNumber');
const GRADE = $('#studentGrade');
$('#send').on('click', sendData);
$('#load').on('click', loadData);

function loadData() {
    $.ajax({
        method:'GET',
        url:URL,
        headers:{
            'Authorization':'Basic ' + AUTH
        },
        success:function (res) {
            res.sort(function (a, b) {
                return a.ID - b.ID;
            });
            results.empty();
            let tbody = $('<tbody>');
            let tr1 = $('<tr>');
            tr1.append('<th>ID</th><th>Fisrt Name</th><th>Last Name</th><th>Faculty Number</th><th>Grade</th>');
            tbody.append(tr1);
            results.append(tbody);
            for (let i = 0; i < res.length; i++) {
                let tr = $('<tr>');
                tr.append(`<th>${res[i].ID}</th>`);
                tr.append(`<th>${res[i].FirstName}</th>`);
                tr.append(`<th>${res[i].LastName}</th>`);
                tr.append(`<th>${res[i].FacultyNumber}</th>`);
                tr.append(`<th>${res[i].Grade}</th>`);
                results.append(tr);
            }
        },
        error:function (err) {
            console.log(err);
        }
    })
}

function sendData() {
    let data = undefined;
    if(ID.val() !== '' && FIRSTNAME.val() !== '' && LASTNAME.val() !== '' && FACULTYNUMBER !== '' && GRADE !== '' && !Number.isNaN(Number(GRADE.val())) && !Number.isNaN(Number(ID.val()))){
        data = {ID:Number(ID.val()), FirstName:FIRSTNAME.val(), LastName:LASTNAME.val(),
        FacultyNumber:FACULTYNUMBER.val(), Grade:Number(GRADE.val())};
    }
    else{
        throw new Error('Invalid data');
    }
    $.ajax({
        method:'POST',
        url:URL,
        headers:{
            'Authorization':'Basic ' + AUTH,
            'Content-Type':'application/json'
        },
        data:JSON.stringify(data),
        success:function(res){
            ID.val('');
            FIRSTNAME.val('');
            LASTNAME.val('');
            FACULTYNUMBER.val('');
            GRADE.val('');
        },
        error:function (err) {
            console.log(data);
            console.log(err);
        }
    })
}
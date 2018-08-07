$(document).on({
    ajaxStart: function () {
        $("#loadingBox").show()
    },
    ajaxStop: function () {
        $("#loadingBox").hide()
    }
});

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}

function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.children('span').text(message);
    infoBox.show();
    infoBox.on('click', function () {
        infoBox.hide();
    });
    setTimeout(function () {
        $('#infoBox').fadeOut()
    }, 3000)
}

function showError(errorMsg) {
    let errorBox = $('#errorBox');
    errorBox.children('span').text("Error: " + errorMsg);
    errorBox.show();
    errorBox.on('click', function () {
        errorBox.hide();
    })
}
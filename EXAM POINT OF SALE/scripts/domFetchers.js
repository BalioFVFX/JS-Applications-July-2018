const domFetcher = (function () {

    function getTotalQuantity() {
        let divs = $('#active-entries > div');
        let qty = 0;
        for (let i = 0; i < divs.length; i++) {
            qty += Number($(divs[i]).children(':nth-child(2)').text());
        }
        return qty;
    }

    function getTotal() {
        return Number($($('#create-receipt-form > div')[3]).text());
    }

    function isValidReceipt() {
        if($('#active-entries > div').length > 0){
            return true;
        }
        return false;
    }

    return {getTotalQuantity, getTotal, isValidReceipt}
}());

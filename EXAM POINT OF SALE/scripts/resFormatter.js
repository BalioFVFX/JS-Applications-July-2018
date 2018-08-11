const resFormatter = (function () {
    function calculateSubTotal(res) {
        for (let i = 0; i < res.length; i++) {
            res[i].subTotal = Number(res[i].price) * Number(res[i].qty);
        }
        return res;
    }

    function updateReceiptTable(type, qty, price, receiptId) {

        let div = $(`<div class="row">
                <div class="col wide">${type}</div>
                <div class="col wide">${qty}</div>
                <div class="col wide">${price}</div>
                <div class="col">${qty * price}</div>
                <div class="col right">
                    <a href="#/delete/${receiptId}">&#10006;</a>
                </div>
            </div>`);
        $('#active-entries').append(div);
        $($('#create-entry-form input')[0]).val('');
        $($('#create-entry-form input')[1]).val('');
        $($('#create-entry-form input')[2]).val('');
    }

    function updateTotal(sub) {
        if(!sub){
            let divs = $('#active-entries > div');
            let total = 0;
            for (let i = 0; i < divs.length; i++) {
                let split = $(divs[i]).text().split(' ').filter(t => t !== '');
                let subTotal = Number(split[split.length - 4]);
                total += subTotal;
            }
            $($('#create-receipt-form > div')[3]).text(total);

        }
        else{
            let sum = Number($($('#create-receipt-form > div')[3]).text());
            $($('#create-receipt-form > div')[3]).text(sum + sub);
        }
    }
    
    function overviewFormat(res) {
        let total = 0;
        for (let i = 0; i < res.length; i++) {
            total += Number(res[i].total);
            let date = new Date(res[i]._kmd.ect);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let time = date.toTimeString().substr(0,5);

            if(month < 10){
              month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }

            res[i].date = `${date.getFullYear()}-${month}-${day} ${time}`;
        }
        return [res, total];
    }


    return {calculateSubTotal, updateReceiptTable, updateTotal, overviewFormat};
}());
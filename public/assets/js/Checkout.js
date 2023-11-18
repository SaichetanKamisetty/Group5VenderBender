const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');
const parsedJSON = JSON.parse(urlParams.get('parsedJSON'));
let priceofItem = parsedJSON.StockData[key].price

let currentlySelected = "";

function ToastMessage(text) {
    let errorToastContainer = document.getElementById("errorToast");
    let errorToast = document.createElement("h3")
    errorToast.style.color = "red";
    errorToast.innerHTML = text
    errorToastContainer.append(errorToast)

    setTimeout(function(){
        errorToastContainer.removeChild(errorToast);
    }, 2000);
}

function deleteButtons(parent) {
    currentlySelected = "";
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
}

function sufficietCash(textInput) {
    if (textInput-priceofItem >= 0) {
        return true;
    } else {
        return false;
    }
}

function isValidCreditCardNumber(cardNumber) {
    const digits = cardNumber.split('').map(Number);
    if (digits.length < 2) {
      return false;
    }
    const reversedDigits = digits.slice().reverse();
    const doubledDigits = reversedDigits.map((digit, index) => {
      return index % 2 === 1 ? digit * 2 : digit;
    });
    const summedDigits = doubledDigits.map(digit => {
      return digit > 9 ? digit - 9 : digit;
    });
    const sum = summedDigits.reduce((acc, digit) => acc + digit, 0);
    return sum % 10 === 0;
}

function updateJSONData() {
    fetch('/updateStockData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJSON),
    })
        .catch(error => console.error('Error updating stock data:', error));
} 

function submit(parent) {
    let textInput = document.getElementById("paymentInput")
    if (textInput.value == "") {
        return;
    }
    if (currentlySelected == "cash") {
        if (sufficietCash(textInput.value)) {
            if (textInput.value-priceofItem > 0) {
                let total = textInput.value-priceofItem
                ToastMessage("Surplus of money, refunding $" + total + ", and dispensing.");
            } else {
                ToastMessage("Payment successful.. Dispensing..");
            }

            deleteButtons(parent);

            parsedJSON.StockData[key].itemsList.shift();
            parsedJSON.StockData[key].totalAmount -= 1;
            updateJSONData();

            setTimeout(function(){
                cancelTransaction();
            }, 2000);


        } else {
            ToastMessage("Not a sufficient amount of cash, refunding " + textInput.value);
            return;
        }
    } else { 
        if (isValidCreditCardNumber(textInput.value)) {
             ToastMessage("Payment successful.. Dispensing..");

             deleteButtons(parent);

             parsedJSON.StockData[key].itemsList.shift();
             parsedJSON.StockData[key].totalAmount -= 1;
             updateJSONData();

             setTimeout(function(){
                cancelTransaction();
            }, 2000);

        } else {
            ToastMessage("Invalid credit card number.");
            return;
        }
    }
}

function cancelTransaction() {
    window.location.href = '/'
}

function generateButtons(paymentType) {
    let paymentInsertionContainer = document.getElementById("paymentInsertion");
    if (currentlySelected != "") {
        return;
    }
    let SwitchPaymentButton = document.createElement("input");
    SwitchPaymentButton.type = "button"; SwitchPaymentButton.value = "Switch Payment"; SwitchPaymentButton.style.display = "inline-block";
    SwitchPaymentButton.style.marginTop = "20px"; SwitchPaymentButton.style.borderRadius = "10px";
    SwitchPaymentButton.addEventListener('click', function() {
        deleteButtons(paymentInsertionContainer);
    })
    paymentInsertionContainer.append(SwitchPaymentButton);
    
    let textInput = document.createElement("input");
    textInput.type = "number"; textInput.style.borderRadius = "10px"; textInput.id = "paymentInput"
    if (paymentType == "cash") {
        textInput.placeholder = "Type Cash Inserted"
    } else {
        textInput.placeholder = "Type Credit Card Number"
    }
    paymentInsertionContainer.append(textInput);

    let submitButton = document.createElement("input");
    submitButton.type = "button"; submitButton.value = "Submit Payment"; submitButton.style.display = "inline-block";
    submitButton.style.marginTop = "20px"; submitButton.style.borderRadius = "10px";
    submitButton.addEventListener('click', function() {
        submit(paymentInsertionContainer);
    })
    paymentInsertionContainer.append(submitButton);

    
    let cancelTransactionButton = document.createElement("input");
    cancelTransactionButton.type = "button"; cancelTransactionButton.value = "Cancel Transaction"; cancelTransactionButton.style.display = "inline-block";
    cancelTransactionButton.style.marginTop = "20px"; cancelTransactionButton.style.borderRadius = "10px";
    cancelTransactionButton.addEventListener('click', function() {
        cancelTransaction();
    })
    paymentInsertionContainer.append(cancelTransactionButton);

    currentlySelected = paymentType;
}

function processCash() {
    generateButtons("cash");
}

function processCredit() {
    generateButtons("credit");
}

window.onload = function() {
    let header = document.getElementById("itemHeader");
    header.innerHTML = "Chosen Item: " + parsedJSON.StockData[key].itemName + " | Item Price: $" + parsedJSON.StockData[key].price;

    let cashButton = document.getElementById("cash");
    let creditButton = document.getElementById("credit");

    cashButton.addEventListener('click', function() {
        processCash();
    })
    creditButton.addEventListener('click', function() {
        processCredit();
    })
    
};




class Transaction {
    constructor() {
        this.parsedJSON = JSON.parse(new URLSearchParams(window.location.search).get('parsedJSON'));
        this.key = new URLSearchParams(window.location.search).get('key');
        this.priceofItem = this.parsedJSON.StockData[this.key].price;
        this.currentlySelected = "";
        this.currentmachine = new URLSearchParams(window.location.search).get('vendingmachine');
        this.parsedTransactionJSON = {};
    }

    ToastMessage(text) {
        let errorToastContainer = document.getElementById("errorToast");
        let errorToast = document.createElement("h3");
        errorToast.style.color = "red";
        errorToast.innerHTML = text;
        errorToastContainer.append(errorToast);

        setTimeout(function () {
            errorToastContainer.removeChild(errorToast);
        }, 2000);
    }

    deleteButtons(parent) {
        this.currentlySelected = "";
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    sufficientCash(textInput) {
        return textInput - this.priceofItem >= 0;
    }

    isValidCreditCardNumber(cardNumber) {
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

    updateJSONData() {
        const Obj = {
            parsedJSON: this.parsedJSON,
            vendingmachine: this.currentmachine
        }

        fetch('/updateStockData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Obj),
        })
            .catch(error => console.error('Error updating stock data:', error));
    }

    fetchLogsData() {
        fetch(`/getPurchaseData/${this.currentmachine}`)
            .then(response => response.json())
            .then(jsonData => {
                this.parsedTransactionJSON = JSON.parse(jsonData);
            })
            .catch(error => console.error(error));
    }

    updateLogsData(itemName, priceofItem) {
        const currentDate = new Date().toISOString().split('T')[0];

        for (const item of this.parsedTransactionJSON[this.currentmachine].totalItems) {
            if (item.itemName === itemName) {
                item.amount += 1; 
                break; 
            }
        }
    
        this.parsedTransactionJSON[this.currentmachine].purchaselogs.push({
            "date": currentDate,
            "items": itemName,
            "price": priceofItem
        });

        const Obj = {
            parsedJSON: this.parsedTransactionJSON,
            vendingmachine: this.currentmachine
        }

        fetch('/updatepurchaselog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Obj),
        })
            .catch(error => console.error('Error updating stock data:', error));
    }

    submit(parent) {
        let textInput = document.getElementById("paymentInput");
        if (textInput.value === "") {
            return;
        }
        if (this.currentlySelected === "cash") {
            if (this.sufficientCash(textInput.value)) {
                if (textInput.value - this.priceofItem > 0) {
                    let total = textInput.value - this.priceofItem;
                    this.ToastMessage("Surplus of money, refunding $" + total + ", and dispensing.");
                } else {
                    this.ToastMessage("Payment successful.. Dispensing..");
                }

                this.deleteButtons(parent);

                this.parsedJSON.StockData[this.key].itemsList.shift();
                this.parsedJSON.StockData[this.key].totalAmount -= 1;
                this.updateLogsData(this.parsedJSON.StockData[this.key].itemName, this.priceofItem)
                this.updateJSONData();

                setTimeout(() => this.cancelTransaction(), 2000);
            } else {
                this.ToastMessage("Not a sufficient amount of cash, refunding " + textInput.value);
            }
        } else {
            if (this.isValidCreditCardNumber(textInput.value)) {
                this.ToastMessage("Payment successful.. Dispensing..");

                this.deleteButtons(parent);

                this.parsedJSON.StockData[this.key].itemsList.shift();
                this.parsedJSON.StockData[this.key].totalAmount -= 1;
                this.updateLogsData(this.parsedJSON.StockData[this.key].itemName, this.priceofItem)
                this.updateJSONData();

                setTimeout(() => this.cancelTransaction(), 2000);
            } else {
                this.ToastMessage("Invalid credit card number.");
            }
        }
    }

    cancelTransaction() {
        window.location.href = `/vendingmachine?vendingmachine=${encodeURIComponent(this.currentmachine)}`;
    }

    generateButtons(paymentType) {
        let paymentInsertionContainer = document.getElementById("paymentInsertion");
        if (this.currentlySelected !== "") {
            return;
        }

        let switchPaymentButton = document.createElement("input");
        switchPaymentButton.type = "button";
        switchPaymentButton.value = "Switch Payment";
        switchPaymentButton.style.display = "inline-block";
        switchPaymentButton.style.marginTop = "20px";
        switchPaymentButton.style.borderRadius = "10px";
        switchPaymentButton.addEventListener('click', () => this.deleteButtons(paymentInsertionContainer));
        paymentInsertionContainer.append(switchPaymentButton);

        let textInput = document.createElement("input");
        textInput.type = "number";
        textInput.style.borderRadius = "10px";
        textInput.id = "paymentInput";
        textInput.placeholder = paymentType === "cash" ? "Type Cash Inserted" : "Type Credit Card Number";
        paymentInsertionContainer.append(textInput);

        let submitButton = document.createElement("input");
        submitButton.type = "button";
        submitButton.value = "Submit Payment";
        submitButton.style.display = "inline-block";
        submitButton.style.marginTop = "20px";
        submitButton.style.borderRadius = "10px";
        submitButton.addEventListener('click', () => this.submit(paymentInsertionContainer));
        paymentInsertionContainer.append(submitButton);

        let cancelTransactionButton = document.createElement("input");
        cancelTransactionButton.type = "button";
        cancelTransactionButton.value = "Cancel Transaction";
        cancelTransactionButton.style.display = "inline-block";
        cancelTransactionButton.style.marginTop = "20px";
        cancelTransactionButton.style.borderRadius = "10px";
        cancelTransactionButton.addEventListener('click', () => this.cancelTransaction());
        paymentInsertionContainer.append(cancelTransactionButton);

        this.currentlySelected = paymentType;
    }

    processCash() {
        this.generateButtons("cash");
    }

    processCredit() {
        this.generateButtons("credit");
    }

    initialize() {
        this.fetchLogsData();
        let header = document.getElementById("itemHeader");
        header.innerHTML = "Chosen Item: " + this.parsedJSON.StockData[this.key].itemName + " | Item Price: $" + this.parsedJSON.StockData[this.key].price;

        let cashButton = document.getElementById("cash");
        let creditButton = document.getElementById("credit");

        cashButton.addEventListener('click', () => this.processCash());
        creditButton.addEventListener('click', () => this.processCredit());
    }
}

window.onload = function () {
    const transaction = new Transaction();
    transaction.initialize();
};

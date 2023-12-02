class VendingMachine {
    constructor() {
        this.vendingmachine = new URLSearchParams(window.location.search).get('vendingmachine');
        this.fetchStockData();
    }

    checkIfAvailable(key, parsedJSON) {
        return parsedJSON.StockData[key].totalAmount > 0;
    }

    showToastMessage(text) {
        const errorToastContainer = document.getElementById("errorToast");
        const errorToast = document.createElement("h3");
        errorToast.style.color = "red";
        errorToast.innerHTML = text;
        errorToastContainer.append(errorToast);

        setTimeout(function () {
            errorToastContainer.removeChild(errorToast);
        }, 2000);
    }

    itemSelect(key, parsedJSON) {
        if (this.checkIfAvailable(key, parsedJSON)) {
            window.location.href = `/checkoutpage?vendingmachine=${this.vendingmachine}&key=${encodeURIComponent(key)}&parsedJSON=${encodeURIComponent(JSON.stringify(parsedJSON))}`;
        } else {
            this.showToastMessage("This item is out of stock. Please select another item.");
        }
    }

    fetchStockData() {
        fetch(`/stockData/${this.vendingmachine}`)
            .then(response => response.json())
            .then(jsonData => {
                const parsedJSON = JSON.parse(jsonData);
                this.displayItems(parsedJSON);
            })
            .catch(error => console.error(error));
    }

    displayItems(parsedJSON) {
        const container = document.getElementById("itemTable");

        for (let key in parsedJSON.StockData) {
            if (parsedJSON.StockData.hasOwnProperty(key)) {
                const stockData = parsedJSON.StockData[key];

                const button = document.createElement("button");
                button.style.margin = "25px";
                button.style.height = "200px";
                button.style.width = "200px";
                button.style.borderRadius = "20px";
                button.innerHTML = "Name: " + stockData.itemName + "<br>" + "Price: $" + stockData.price + "<br>" + "Stock: " + stockData.totalAmount;

                button.addEventListener('click', () => {
                    this.itemSelect(key, parsedJSON);
                });

                container.appendChild(button);
            }
        }
    }
}

const vendingMachineInstance = new VendingMachine();






function checkIfAvail(key, parsedJSON) {
    if (parsedJSON.StockData[key].totalAmount > 0) {
        return true;
    } else {
        return false;
    }
}

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

function itemSelect(key, parsedJSON) {
    if (checkIfAvail(key, parsedJSON)) {
        window.location.href = `/checkoutpage?key=${encodeURIComponent(key)}&parsedJSON=${encodeURIComponent(JSON.stringify(parsedJSON))}`
    } else {
        ToastMessage("This item is out of stock. Please select another item.")
    }
}

fetch('/stockData') 
    .then(response=> response.json())
    .then(jsonData => {
        let container = document.getElementById("itemTable");
        const parsedJSON = JSON.parse(jsonData)
        for(let key in parsedJSON.StockData) {
            if (parsedJSON.StockData.hasOwnProperty(key)) {
                let stockData = parsedJSON.StockData[key];

                let button = document.createElement("button");
                button.style.margin = "25px";
                button.style.height = "200px";
                button.style.width = "200px";
                button.style.borderRadius = "20px";
                button
                button.innerHTML = "Name: " + stockData.itemName + "<br>" + "Price: $" + stockData.price + "<br>" +"Stock: " + stockData.totalAmount;

                button.addEventListener('click', function() {
                    itemSelect(key, parsedJSON);
                })

                container.appendChild(button)
            }
        }
    })
    .catch(error=>console.error(error));





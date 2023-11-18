function addItem(name, id, expiryDate, mode) {
    var container = document.getElementById('itemContainer');

    var itemDiv = document.createElement('div');
    var nameDiv = document.createElement('div');
    var idDiv = document.createElement('div');
    var expiryDateDiv = document.createElement('div');
    var restockButton = document.createElement('button');

    itemDiv.className = "item";

    nameDiv.innerHTML = '<strong>Name:</strong> ' + name;
    idDiv.innerHTML = '<strong>ID:</strong> ' + id;
    expiryDateDiv.innerHTML = '<strong>Expire Date:</strong> ' + expiryDate;

    restockButton.className = 'restock-button';
    if (mode == "remove") {
        restockButton.textContent = 'Remove';
        restockButton.style.backgroundColor = "red";
        restockButton.addEventListener('click', function() {
            itemRemove(id, expiryDate, itemDiv, container);
        })
    } else {
        restockButton.textContent = 'Restock';
        restockButton.style.backgroundColor = "green";
        restockButton.addEventListener('click', function() {
            itemAdd(name, id, expiryDate, itemDiv, container);
        })

    }

    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(idDiv);
    itemDiv.appendChild(expiryDateDiv);
    itemDiv.appendChild(restockButton);

    container.appendChild(itemDiv);
}

function itemRemove(id_, expiryDate, itemDiv, container) {
    fetch('/stockData') 
    .then(response=> response.json())
    .then(jsonData => {
        const parsedJSON = JSON.parse(jsonData)
        const itemsList = parsedJSON.StockData[id_].itemsList;

        for (let i = 0; i < parsedJSON.StockData[id_].totalAmount; i++) {
            const currentItem = itemsList[i];
            // if (currentItem != undefined) {}
            if (currentItem.expireDate === expiryDate) {
                parsedJSON.StockData[id_].itemsList.splice(i, 1);
                parsedJSON.StockData[id_].totalAmount -= 1;
                console.log(parsedJSON.StockData[id_].itemsList)
                // i--;
                container.removeChild(itemDiv);

            }
        }
        updateJSONData(parsedJSON)

    })
    .catch(error=>console.error(error));
}

function itemAdd(name, id_, expiryDate, itemDiv, container) {
    fetch('/stockData') 
    .then(response=> response.json())
    .then(jsonData => {
        const parsedJSON = JSON.parse(jsonData)
        var currentDate = new Date();

        if (parsedJSON.StockData[id_].totalAmount < 5) {
            let newObj = {"itemName": name, "timeStocked": formatDate(currentDate), "expireDate": expiryDate};
            parsedJSON.StockData[id_].itemsList.push(newObj);
            parsedJSON.StockData[id_].totalAmount += 1;
            container.removeChild(itemDiv);
        } else {
            return;
        }
        updateJSONData(parsedJSON)

    })
    .catch(error=>console.error(error));
}

function formatDate(date) {
    var year = date.getUTCFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function findExpiredItems(jsonFile) {
    var currentDate = new Date();
    var expiredItems = [];

    for (var key in jsonFile.StockData) {
        if (jsonFile.StockData.hasOwnProperty(key)) {
            var item = jsonFile.StockData[key];

            for (var i = 0; i < item.itemsList.length; i++) {
                if (item.itemsList[i] != null) {
                    var expireDate = new Date(item.itemsList[i].expireDate);
                    if (expireDate < currentDate) {
                        expiredItems.push({
                            id: key,
                            itemName: item.itemName,
                            expireDate: item.itemsList[i].expireDate
                        });
                    }
                }
            }
        }
    }
    return expiredItems;
}
function findItemsToStock(jsonFile, expiredItems) {
    var currentDate = new Date();
    var newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 5);
    var missingItems = [];

    for (var key in jsonFile.StockData) {
        if (jsonFile.StockData.hasOwnProperty(key)) {
            var item = jsonFile.StockData[key];

           if (item.totalAmount < 5) {
            for (var i = 0; i < 5 - item.totalAmount; i++) {
                missingItems.push({
                    id: key,
                    itemName: item.itemName,
                    restockDate: formatDate(currentDate),
                    expireDate: formatDate(newDate)
                });
            }
           }
        }
    }
    for (var item in expiredItems) {
        missingItems.push({
            id: expiredItems[item].id,
            itemName: expiredItems[item].itemName,
            restockDate: formatDate(currentDate),
            expireDate: formatDate(newDate)
        });
       }
    return missingItems;
}

function updateJSONData(parsedJSON) {
    fetch('/updateStockData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJSON),
    })
        .catch(error => console.error('Error updating stock data:', error));
} 

fetch('/stockData') 
    .then(response=> response.json())
    .then(jsonData => {
        const parsedJSON = JSON.parse(jsonData)
        let expiredItemsList = findExpiredItems(parsedJSON);
        console.log(expiredItemsList);
        let missingItemsList = findItemsToStock(parsedJSON, expiredItemsList);
        console.log(missingItemsList);

        for (var key in expiredItemsList) { 
            var item = expiredItemsList[key];
            addItem(item.itemName, item.id, item.expireDate, "remove")
        }

        for (var key in missingItemsList) {
            var item = missingItemsList[key];
            addItem(item.itemName, item.id, item.expireDate, "add")
        }
 
    })
    .catch(error=>console.error(error));
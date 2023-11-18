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
  .then(response => response.json())
  .then(jsonData => {
      let container = document.getElementById("itemTable");
      const parsedJSON = JSON.parse(jsonData);
      for (let key in parsedJSON.StockData) {
          if (parsedJSON.StockData.hasOwnProperty(key)) {
              let stockData = parsedJSON.StockData[key];

              // Create a new div element for the item button with the 'item-button' class
              let itemButton = document.createElement("div");
              itemButton.className = "item-button";
              itemButton.innerHTML = `
                  <div class="item-name">${stockData.itemName}</div>
                  <div class="item-price">Price: $${stockData.price}</div>
                  <div class="item-stock">Stock: ${stockData.totalAmount}</div>
              `;

              // Add an event listener to handle item selection
              itemButton.addEventListener('click', function() {
                  itemSelect(key, parsedJSON);
              });

              // Append the new item button to the container
              container.appendChild(itemButton);
          }
      }
  })
  .catch(error => console.error(error));




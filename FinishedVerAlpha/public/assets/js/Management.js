import {} from "https://cdn.anychart.com/js/8.0.1/anychart-core.min.js"
import {} from "https://cdn.anychart.com/js/8.0.1/anychart-pie.min.js"

let DATABASE_URL = "https://group5-1aa77-default-rtdb.firebaseio.com"
let ACCESS_TOKEN = "BDDZXIfgeZ3DRPlie1IaJfPKlUk5w6LARKQKI4Qg"

class ManagementSystem {
    constructor() {
      this.itemsJSON = {};
      this.savedElements = [];
    }

    RemoveChildren() {
        for (const k in this.savedElements) {
            this.savedElements[k].replaceChildren();
        }
        this.savedElements = []
    }

    loadSpecificData(vendingMachine) {
        this.RemoveChildren();
        const currentList = this.itemsJSON[vendingMachine][vendingMachine].totalItems;
        var data = currentList.map(item => ({ x: item.itemName, value: item.amount }));
        
        var chart = anychart.pie();
  
        chart.background().fill("gray");
    
        chart.data(data);
        
        
        chart.container('pie');
        chart.draw();

        this.savedElements.push(document.getElementById("pie"))

        currentList.sort((a, b) => b.amount - a.amount);
        
        this.savedElements.push(document.getElementById("popular"))
        document.getElementById("popular").innerHTML = `<h3>${currentList[0].itemName} - ${currentList[0].amount} sold </h3>`

        this.savedElements.push(document.getElementById("unpopular"))
        document.getElementById("unpopular").innerHTML = `<h3>${currentList[currentList.length - 1].itemName} - ${currentList[currentList.length - 1].amount} sold </h3>`

        var gross = 0;
        for (const k in currentList) {
            gross += (currentList[k].amount * currentList[k].price)
        }

        this.savedElements.push(document.getElementById("gross"))
        document.getElementById("gross").innerHTML = `<h3> $${gross} made </h3>`

        this.savedElements.push(document.getElementById("item-list"))

        for (const k in currentList) {
            var listelm = document.createElement("li")
            listelm.innerHTML = `${currentList[k].itemName} - ${currentList[k].amount} sold - $${currentList[k].price}`
            listelm.className = "list-group-item list-group-item-dark"
            document.getElementById("item-list").appendChild(listelm)
        }

    }

    loadAllData() {
        this.RemoveChildren();
        const mergedItems = {};

        for (const key in this.itemsJSON) {
            const currentList = this.itemsJSON[key][key].totalItems;

            for (const item of currentList) {
                const itemName = item.itemName;

                if (!mergedItems[itemName]) {
                    mergedItems[itemName] = { itemName, amount: item.amount, price: item.price};
                } else {
                    mergedItems[itemName].amount += item.amount;
                }
            }
        }

        const mergedItemsArray = Object.values(mergedItems);
        var data = mergedItemsArray.map(item => ({ x: item.itemName, value: item.amount }));

        var chart = anychart.pie();
  
        chart.background().fill("gray");
    
        chart.data(data);
        
        
        chart.container('pie');
        chart.draw();

        this.savedElements.push(document.getElementById("pie"))

        mergedItemsArray.sort((a, b) => b.amount - a.amount);
        
        this.savedElements.push(document.getElementById("popular"))
        document.getElementById("popular").innerHTML = `<h3>${mergedItemsArray[0].itemName} - ${mergedItemsArray[0].amount} sold </h3>`

        this.savedElements.push(document.getElementById("unpopular"))
        document.getElementById("unpopular").innerHTML = `<h3>${mergedItemsArray[mergedItemsArray.length - 1].itemName} - ${mergedItemsArray[mergedItemsArray.length - 1].amount} sold </h3>`

        var gross = 0;
        for (const k in mergedItemsArray) {
            gross += (mergedItemsArray[k].amount * mergedItemsArray[k].price)
        }

        this.savedElements.push(document.getElementById("gross"))
        document.getElementById("gross").innerHTML = `<h3> $${gross} made </h3>`

        this.savedElements.push(document.getElementById("item-list"))

        for (const k in mergedItemsArray) {
            var listelm = document.createElement("li")
            listelm.innerHTML = `${mergedItemsArray[k].itemName} - ${mergedItemsArray[k].amount} sold - $${mergedItemsArray[k].price}`
            listelm.className = "list-group-item list-group-item-dark"
            document.getElementById("item-list").appendChild(listelm)
        }

    }
  
    init() {
        fetch(DATABASE_URL+"/purchaselogs.json?auth="+ACCESS_TOKEN)
        .then(response=> response.json())
        .then(jsonData => {
            this.itemsJSON = jsonData;
            const dropdown = document.getElementById('dropdown')
            var dropdownitem = document.createElement('a');
            dropdownitem.className = "dropdown-item"
            dropdownitem.innerHTML = "View All"
            dropdown.appendChild(dropdownitem)
            for (const key in jsonData) {
                var dropdownitem = document.createElement('a');
                dropdownitem.className = "dropdown-item"
                dropdownitem.innerHTML = key
                dropdown.appendChild(dropdownitem)
            }
            const dropdownMenu = document.getElementById('dropdown');

            dropdownMenu.addEventListener('click', (event) => {
                if (event.target.classList.contains('dropdown-item')) {
                    const selectedOption = event.target.textContent;
                    if (selectedOption !== "View All") {
                        this.loadSpecificData(selectedOption);
                    } else {
                        this.loadAllData();
                    }
                }
            });

            this.loadAllData();
        })
        .catch(error=>console.error(error));
    }
}

  
const manager = new ManagementSystem();
manager.init();
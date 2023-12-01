// class StockManager {
//     constructor() {
//         this.container = document.getElementById('itemContainer');
//         this.restocklist = document.getElementById('restockinglist')
//         this.vendingmachine = new URLSearchParams(window.location.search).get('vendingmachine');
//         this.parsedJSON = {};
//         this.restockeditem = []
//         this.itemList = []
//     }

//     generateUUID() {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//             const r = Math.random() * 16 | 0,
//                 v = c === 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     }

//     addItem(name, id, expiryDate, uuid, mode) {
//         const itemDiv = document.createElement('div');
//         const nameDiv = document.createElement('div');
//         const idDiv = document.createElement('div');
//         const expiryDateDiv = document.createElement('div');
//         const restockButton = document.createElement('button');

//         itemDiv.className = 'item';

//         nameDiv.innerHTML = '<strong>Name:</strong> ' + name;
//         idDiv.innerHTML = '<strong>ID:</strong> ' + id;
//         expiryDateDiv.innerHTML = '<strong>Expire Date:</strong> ' + expiryDate;

//         restockButton.className = 'restock-button';
//         if (mode === 'remove') {
//             restockButton.textContent = 'Remove';
//             restockButton.style.backgroundColor = 'red';
//             restockButton.addEventListener('click', () => {
//                 this.itemRemove(id, uuid, itemDiv);
//             });
//         } else {
//             restockButton.textContent = 'Restock';
//             restockButton.style.backgroundColor = 'green';
//             restockButton.addEventListener('click', () => {
//                 this.itemAdd(name, id, expiryDate, itemDiv);
//             });
//         }

//         itemDiv.appendChild(nameDiv);
//         itemDiv.appendChild(idDiv);
//         itemDiv.appendChild(expiryDateDiv);
//         itemDiv.appendChild(restockButton);

//         this.container.appendChild(itemDiv);
//     }

//     itemRemove(id, uuid, itemDiv) {
//         fetch(`/stockData/${this.vendingmachine}`)
//             .then(response => response.json())
//             .then(jsonData => {
//                 const parsedJSON = JSON.parse(jsonData);
//                 const itemsList = parsedJSON.StockData[id].itemsList;

//                 for (let i = 0; i < parsedJSON.StockData[id].totalAmount; i++) {
//                     const currentItem = itemsList[i];
//                     console.log(currentItem.uuid + "rawr" + id)
//                     if (currentItem.uuid === uuid) {
//                         parsedJSON.StockData[id].itemsList.splice(i, 1);
//                         parsedJSON.StockData[id].totalAmount -= 1;
//                         console.log(parsedJSON.StockData[id].itemsList);
//                         this.container.removeChild(itemDiv);
//                     }
//                 }
//                 this.updateJSONData(parsedJSON);
//             })
//             .catch(error => console.error(error));
//     }

//     itemAdd(name, id, expiryDate, itemDiv) {
//         fetch(`/stockData/${this.vendingmachine}`)
//             .then(response => response.json())
//             .then(jsonData => {
//                 const parsedJSON = JSON.parse(jsonData);
//                 const currentDate = new Date();

//                 if (parsedJSON.StockData[id].totalAmount < 5) {
//                     const newObj = {
//                         itemName: name,
//                         timeStocked: this.formatDate(currentDate),
//                         expireDate: expiryDate,
//                         uuid: this.generateUUID()
//                     };
//                     parsedJSON.StockData[id].itemsList.push(newObj);
//                     parsedJSON.StockData[id].totalAmount += 1;
//                     this.container.removeChild(itemDiv);
//                     const Obj = {
//                         "name": name,
//                         "expiryDate": expiryDate
//                     }
//                     this.restockeditem.push(Obj)
//                     const amount = this.getamount(name) - 1
//                     this.updateItemCount(name, amount)
//                 } else {
//                     return;
//                 }
//                 this.updateJSONData(parsedJSON);
//             })
//             .catch(error => console.error(error));
//     }

//     formatDate(date) {
//         const year = date.getUTCFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         return year + '-' + month + '-' + day;
//     }

//     findExpiredItems(jsonFile) {
//         const currentDate = new Date();
//         const expiredItems = [];

//         for (const key in jsonFile.StockData) {
//             if (jsonFile.StockData.hasOwnProperty(key)) {
//                 const item = jsonFile.StockData[key];

//                 for (let i = 0; i < item.itemsList.length; i++) {
//                     if (item.itemsList[i] !== null) {
//                         const expireDate = new Date(item.itemsList[i].expireDate);
//                         if (expireDate < currentDate) {
//                             expiredItems.push({
//                                 id: key,
//                                 itemName: item.itemName,
//                                 expireDate: item.itemsList[i].expireDate,
//                                 uuid: item.itemsList[i].uuid
//                             });
//                         }
//                     }
//                 }
//             }
//         }
//         return expiredItems;
//     }

//     findItemsToStock(jsonFile, expiredItems) {
//         const currentDate = new Date();
//         const newDate = new Date(currentDate);
//         newDate.setDate(newDate.getDate() + 5);
//         const missingItems = [];

//         for (const key in jsonFile.StockData) {
//             if (jsonFile.StockData.hasOwnProperty(key)) {
//                 const item = jsonFile.StockData[key];

//                 if (item.totalAmount < 5) {
//                     for (let i = 0; i < 5 - item.totalAmount; i++) {
//                         missingItems.push({
//                             id: key,
//                             itemName: item.itemName,
//                             restockDate: this.formatDate(currentDate),
//                             expireDate: this.formatDate(newDate),
//                             uuid: item.uuid
//                         });
//                     }
//                 }
//             }
//         }
//         for (const item in expiredItems) {
//             missingItems.push({
//                 id: expiredItems[item].id,
//                 itemName: expiredItems[item].itemName,
//                 restockDate: this.formatDate(currentDate),
//                 expireDate: this.formatDate(newDate),
//                 uuid: item.uuid
//             });
//         }
//         return missingItems;
//     }

//     updateJSONData(parsedJSON) {

//         const Obj = {
//             parsedJSON: parsedJSON,
//             vendingmachine: this.vendingmachine
//         }

//         fetch('/updateStockData', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(Obj),
//         })
//             .catch(error => console.error('Error updating stock data:', error));
//     }

//     grabItems(missingItems) {
//         const itemNames = {};

//         for (const item of missingItems) {
//             const ItemName = item.itemName;

//             if (itemNames[ItemName]) {
//                 itemNames[ItemName].amount++;
//             } else {
//                 itemNames[ItemName] = { name: ItemName, amount: 1 };
//             }
//         }

//         return itemNames;
//     }
//     updateItemCount(itemName, count) {
//         const itemElement = document.getElementById(itemName);
//         if (itemElement) {
//             itemElement.textContent = `${itemName} ${count}x`;
//             if (count === 0) {
//                 itemElement.style.textDecoration = "line-through";
//             }
//         }

//         for (const key in this.itemList) {
//             const item = this.itemList[key];
//             if (itemName === item.name) {
//                 this.itemList[key].amount = count;
//             }
//         }

//     }

//     getamount(itemName) {
//         for (const key in this.itemList) {
//             const item = this.itemList[key];
//             if (itemName === item.name) {
//                 return item.amount
//             }
//         }
//     }

//     init() {
//         fetch(`/stockData/${this.vendingmachine}`)
//             .then(response => response.json())
//             .then(jsonData => {
//                 const parsedJSON = JSON.parse(jsonData);
//                 const expiredItemsList = this.findExpiredItems(parsedJSON);
//                 // console.log(expiredItemsList);
//                 const missingItemsList = this.findItemsToStock(parsedJSON, expiredItemsList);
//                 // console.log(missingItemsList);
//                 this.itemList = this.grabItems(missingItemsList);
//                 // console.log(itemList);

//                 for (const key in this.itemList) {
//                     const div = document.createElement('div');
//                     const item = this.itemList[key];
//                     div.id = item.name;
//                     div.innerHTML = item.name + " " + item.amount + "x";
//                     this.restocklist.appendChild(div);
//                 }


//                 for (const key in expiredItemsList) {
//                     const item = expiredItemsList[key];
//                     console.log(item.uuid)
//                     this.addItem(item.itemName, item.id, item.expireDate, item.uuid, 'remove');
//                 }

//                 for (const key in missingItemsList) {
//                     const item = missingItemsList[key];
//                     this.addItem(item.itemName, item.id, item.expireDate, item.uuid, 'add');
//                 }
//             })
//             .catch(error => console.error(error));
//     }
// }

// const stockManager = new StockManager();
// stockManager.init();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import { getDatabase, set, get, update, remove, ref, child, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"


const firebaseConfig = {
    apiKey: "AIzaSyBmVCQ6kM8r1SdqC67qQnhK58sgngap8rk",
    authDomain: "group5-1aa77.firebaseapp.com",
    databaseURL: "https://group5-1aa77-default-rtdb.firebaseio.com",
    projectId: "group5-1aa77",
    storageBucket: "group5-1aa77.appspot.com",
    messagingSenderId: "885836202874",
    appId: "1:885836202874:web:70b6e07d83e3d790358cc3",
    measurementId: "G-17TZTM9KFR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

class StockManager {
    constructor() {
        this.container = document.getElementById('itemContainer');
        this.restocklist = document.getElementById('restockinglist')
        this.vendingmachine = new URLSearchParams(window.location.search).get('vendingmachine');
        this.parsedJSON = {};
        this.restockeditem = []
        this.itemList = []
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    addItem(name, id, expiryDate, uuid, mode) {
        const itemDiv = document.createElement('div');
        const nameDiv = document.createElement('div');
        const idDiv = document.createElement('div');
        const expiryDateDiv = document.createElement('div');
        const restockButton = document.createElement('button');

        itemDiv.className = 'item';

        nameDiv.innerHTML = '<strong>Name:</strong> ' + name;
        idDiv.innerHTML = '<strong>ID:</strong> ' + id;
        expiryDateDiv.innerHTML = '<strong>Expire Date:</strong> ' + expiryDate;

        restockButton.className = 'restock-button';
        if (mode === 'remove') {
            restockButton.textContent = 'Remove';
            restockButton.style.backgroundColor = 'red';
            restockButton.addEventListener('click', () => {
                this.itemRemove(id, uuid, itemDiv);
            });
        } else {
            restockButton.textContent = 'Restock';
            restockButton.style.backgroundColor = 'green';
            restockButton.addEventListener('click', () => {
                this.itemAdd(name, id, expiryDate, itemDiv);
            });
        }

        itemDiv.appendChild(nameDiv);
        itemDiv.appendChild(idDiv);
        itemDiv.appendChild(expiryDateDiv);
        itemDiv.appendChild(restockButton);

        this.container.appendChild(itemDiv);
    }

    generateReport(items) {
        const currentDate = new Date().toISOString().split('T')[0];
        const restockRef = ref(db, `restockreports/${currentDate}/`);
      
        items.forEach((item) => {
          push(restockRef, item);
        });
    }

    itemRemove(id, uuid, itemDiv) {

        const itemsList = this.parsedJSON.StockData[id].itemsList;

        for (let i = 0; i < this.parsedJSON.StockData[id].totalAmount; i++) {
            const currentItem = itemsList[i];
            if (currentItem.uuid === uuid) {
                this.parsedJSON.StockData[id].itemsList.splice(i, 1);
                this.parsedJSON.StockData[id].totalAmount -= 1;
                this.container.removeChild(itemDiv);
            }
        }
         
    }

    itemAdd(name, id, expiryDate, itemDiv) {
        const currentDate = new Date();

        if (this.parsedJSON.StockData[id].totalAmount < 5) {
            const newObj = {
                itemName: name,
                timeStocked: this.formatDate(currentDate),
                expireDate: expiryDate,
                uuid: this.generateUUID()
            };
            this.parsedJSON.StockData[id].itemsList.push(newObj);
            this.parsedJSON.StockData[id].totalAmount += 1;
            this.container.removeChild(itemDiv);
            const Obj = {
                "name": name,
                "expiryDate": expiryDate,
                "vendingmachine": this.vendingmachine
            }
            this.restockeditem.push(Obj)
            const amount = this.getamount(name) - 1
            this.updateItemCount(name, amount)
        } else {
            return;
        }
    }

    formatDate(date) {
        const year = date.getUTCFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    findExpiredItems() {
        const currentDate = new Date();
        const expiredItems = [];

        for (const key in this.parsedJSON.StockData) {
            if (this.parsedJSON.StockData.hasOwnProperty(key)) {
                const item = this.parsedJSON.StockData[key];

                for (let i = 0; i < item.itemsList.length; i++) {
                    if (item.itemsList[i] !== null) {
                        const expireDate = new Date(item.itemsList[i].expireDate);
                        if (expireDate < currentDate) {
                            expiredItems.push({
                                id: key,
                                itemName: item.itemName,
                                expireDate: item.itemsList[i].expireDate,
                                uuid: item.itemsList[i].uuid
                            });
                        }
                    }
                }
            }
        }
        return expiredItems;
    }

    findItemsToStock(expiredItems) {
        const currentDate = new Date();
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 5);
        const missingItems = [];

        for (const key in this.parsedJSON.StockData) {
            if (this.parsedJSON.StockData.hasOwnProperty(key)) {
                const item = this.parsedJSON.StockData[key];

                if (item.totalAmount < 5) {
                    for (let i = 0; i < 5 - item.totalAmount; i++) {
                        missingItems.push({
                            id: key,
                            itemName: item.itemName,
                            restockDate: this.formatDate(currentDate),
                            expireDate: this.formatDate(newDate),
                            uuid: item.uuid
                        });
                    }
                }
            }
        }
        for (const item in expiredItems) {
            missingItems.push({
                id: expiredItems[item].id,
                itemName: expiredItems[item].itemName,
                restockDate: this.formatDate(currentDate),
                expireDate: this.formatDate(newDate),
                uuid: item.uuid
            });
        }
        return missingItems;
    }

    updateJSONData() {

        const Obj = {
            parsedJSON: this.parsedJSON,
            vendingmachine: this.vendingmachine
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

    grabItems(missingItems) {
        const itemNames = {};

        for (const item of missingItems) {
            const ItemName = item.itemName;

            if (itemNames[ItemName]) {
                itemNames[ItemName].amount++;
            } else {
                itemNames[ItemName] = { name: ItemName, amount: 1 };
            }
        }

        return itemNames;
    }
    updateItemCount(itemName, count) {
        const itemElement = document.getElementById(itemName);
        if (itemElement) {
            itemElement.textContent = `${itemName} ${count}x`;
            if (count === 0) {
                itemElement.style.textDecoration = "line-through";
            }
        }

        for (const key in this.itemList) {
            const item = this.itemList[key];
            if (itemName === item.name) {
                this.itemList[key].amount = count;
            }
        }

    }

    getamount(itemName) {
        for (const key in this.itemList) {
            const item = this.itemList[key];
            if (itemName === item.name) {
                return item.amount
            }
        }
    }

    init() {
        fetch(`/stockData/${this.vendingmachine}`)
            .then(response => response.json())
            .then(jsonData => {
                this.parsedJSON = JSON.parse(jsonData);
                const expiredItemsList = this.findExpiredItems();
                // console.log(expiredItemsList);
                const missingItemsList = this.findItemsToStock(expiredItemsList);
                // console.log(missingItemsList);
                this.itemList = this.grabItems(missingItemsList);
                // console.log(itemList);

                const button = document.getElementById('report');
                button.addEventListener('click', () => {
                    this.updateJSONData();
                    console.log(this.restockeditem)
                    this.generateReport(this.restockeditem)
                    // window.location.href = `/restockmachineslist`;
                });

                for (const key in this.itemList) {
                    const div = document.createElement('div');
                    const item = this.itemList[key];
                    div.id = item.name;
                    div.innerHTML = item.name + " " + item.amount + "x";
                    this.restocklist.appendChild(div);
                }


                for (const key in expiredItemsList) {
                    const item = expiredItemsList[key];
                    this.addItem(item.itemName, item.id, item.expireDate, item.uuid, 'remove');
                }

                for (const key in missingItemsList) {
                    const item = missingItemsList[key];
                    this.addItem(item.itemName, item.id, item.expireDate, item.uuid, 'add');
                }
            })
            .catch(error => console.error(error));
    }
}

const stockManager = new StockManager();
stockManager.init();

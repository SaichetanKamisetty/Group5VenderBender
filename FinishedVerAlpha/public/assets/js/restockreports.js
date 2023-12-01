let DATABASE_URL = "https://group5-1aa77-default-rtdb.firebaseio.com"
let ACCESS_TOKEN = "BDDZXIfgeZ3DRPlie1IaJfPKlUk5w6LARKQKI4Qg"

class RestockReports {
    constructor() {
      this.itemsJSON = {};
    }

    init() {
        fetch(DATABASE_URL+"/restockreports.json?auth="+ACCESS_TOKEN)
        .then(response=> response.json())
        .then(jsonData => {
            this.itemsJSON = jsonData;
            for (const key in this.itemsJSON) {
                const detailscontainer = document.createElement("details")
                const summary = document.createElement("summary")
                summary.innerHTML = `Restocking job | ${key}`
                detailscontainer.appendChild(summary);

                for (const k in this.itemsJSON[key]) {
                    const item = this.itemsJSON[key][k];
                    const itemdiv = document.createElement("div")
                    itemdiv.classList.add("item")

                    itemdiv.innerHTML = `
                        <div><strong>Name:</strong> ${item.name}</div>
                        <div><strong>Expiry Date:</strong> ${item.expiryDate}</div>
                        <div><strong>Vending Machine:</strong> ${item.vendingmachine}</div>
                    `;
                    detailscontainer.appendChild(itemdiv);
                }
                document.getElementById("itemContainer").appendChild(detailscontainer)
            }
        })
        .catch(error=>console.error(error));
    }

}

const restockreports = new RestockReports();
restockreports.init();
const fs = require("fs").promises;
const express = require("express");
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cron = require('node-cron');
const app = express();

var serviceAccount = require("./group5-1aa77-firebase-adminsdk-ptdf8-b51912f1a9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://group5-1aa77-default-rtdb.firebaseio.com"
});

const port = 1234;
const ip = process.env.IP || "127.0.0.1";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});

// For scalability, read the directories to get all of the available vending machines.
app.get('/getmachines', async (req, response) => {
     response.json( await fs.readdir('public/VendingMachines') );
 });

 // Get the stock data of the chosen vending machine
app.get('/stockData/:vendingmachine', async (req, response) => {
   const vendingmachine = req.params.vendingmachine;
   try {
    const vendingInfo = await fs.readFile(`public/VendingMachines/${vendingmachine}/localDB.json`, 'utf8');
    response.json(vendingInfo);
   } catch {
    console.error('Error reading vending machine directories:', error);
    response.status(500).send('Internal Server Error');
   }
});

// Vending machine links
app.get('/vendingmachine', async (req, response) => {
    response.send( await fs.readFile('public/vendingmachine.html', 'utf8') );
 });

app.get('/checkoutpage', async (req, response) => {
    response.send( await fs.readFile('public/checkout.html', 'utf8') );
});

// Used both by restocker and customer to update the local db of the vending machine.
app.post('/updateStockData', async (req, res) => {
    const { vendingmachine, parsedJSON } = req.body;

    try {
        await fs.writeFile(`public/VendingMachines/${vendingmachine}/localDB.json`, JSON.stringify(parsedJSON, null, 4));
    } catch (error) {
        console.error('Error writing to file:', error);
    }
});

app.get('/getPurchaseData/:vendingmachine', async (req, response) => {
    const vendingmachine = req.params.vendingmachine;
    try {
     const purchaseinfo = await fs.readFile(`public/VendingMachines/${vendingmachine}/transactions.json`, 'utf8');
     response.json(purchaseinfo);
    } catch {
     console.error('Error reading vending machine directories:', error);
     response.status(500).send('Internal Server Error');
    }
 });

app.post('/updatepurchaselog', async (req, res) => {
    const { vendingmachine, parsedJSON } = req.body;

    try {
        await fs.writeFile(`public/VendingMachines/${vendingmachine}/transactions.json`, JSON.stringify(parsedJSON, null, 4));
    } catch (error) {
        console.error('Error writing to file:', error);
    }
});

// Restocker links
app.get('/restockportallogin', async (req, response) => {
    response.send( await fs.readFile('public/restockerLogin.html', 'utf8') );
})

app.get('/restockmachineslist', async (req, response) => {
    response.send( await fs.readFile('public/restockermachineslist.html', 'utf8') );
})

app.post('/restockportalloginsubmit', async (req, response) => {
    let DATABASE_URL = "https://group5-1aa77-default-rtdb.firebaseio.com"
    let ACCESS_TOKEN = "BDDZXIfgeZ3DRPlie1IaJfPKlUk5w6LARKQKI4Qg"
    const { username, password } = req.body;

    fetch(DATABASE_URL+"/users.json?auth="+ACCESS_TOKEN)
    .then(response=> response.json())
    .then(jsonData => {
        const parsedJSON = JSON.parse(jsonData)
        for(let item in parsedJSON) {
            if (username==parsedJSON[item].username && password==parsedJSON[item].password) {
                response.redirect('/restockmachineslist')
                return;
            }
        }
        response.status(401).send('Authentication failed, please try again.');
    })
    .catch(error=>console.error(error));

})

app.get('/managementportallogin', async (req, response) => {
    response.send( await fs.readFile('public/managerlogin.html', 'utf8') );
})

app.post('/managerportalloginsubmit', async (req, response) => {
    let DATABASE_URL = "https://group5-1aa77-default-rtdb.firebaseio.com"
    let ACCESS_TOKEN = "BDDZXIfgeZ3DRPlie1IaJfPKlUk5w6LARKQKI4Qg"
    const { username, password } = req.body;

    fetch(DATABASE_URL+"/managementusers.json?auth="+ACCESS_TOKEN)
    .then(response=> response.json())
    .then(jsonData => {
        const parsedJSON = JSON.parse(jsonData)
        for(let item in parsedJSON) {
            if (username==parsedJSON[item].username && password==parsedJSON[item].password) {
                response.redirect('/managementportal')
                return;
            }
        }
        response.status(401).send('Authentication failed, please try again.');
    })
    .catch(error=>console.error(error));

})

app.get('/managementportal', async (req, response) => {
    response.send( await fs.readFile('public/managementportal.html', 'utf8') );
});

app.get('/restockreports', async (req, response) => {
    response.send( await fs.readFile('public/restockreports.html', 'utf8') );
});


app.get('/restockportal', async (req, response) => {
    response.send( await fs.readFile('public/restockportal.html', 'utf8') );
});


async function updateFirebaseForVendingMachine(vendingMachineId, localDB) {
    try {
      const db = admin.database();
      const vendingMachineRef = db.ref('/purchaselogs').child(vendingMachineId)
      const dataSnapshot = await vendingMachineRef.once('value');
      const firebaseData = dataSnapshot.val();
  
      if (firebaseData) {
        localDB[vendingMachineId].totalItems.forEach(item => {
          const firebaseItem = firebaseData[vendingMachineId].totalItems.find(firebaseItem => firebaseItem.id === item.id);
  
          if (firebaseItem) {
            firebaseItem.amount += item.amount;
            item.amount = 0;
          } else {
            firebaseData[vendingMachineId].totalItems.push(item)
          }
        });
        
        firebaseData[vendingMachineId].purchaselogs.push(...localDB[vendingMachineId].purchaselogs.slice(1));
        localDB[vendingMachineId].purchaselogs = [{"None":"None"}];
  
        await vendingMachineRef.set(firebaseData);
        await fs.writeFile(`public/VendingMachines/${vendingMachineId}/transactions.json`, JSON.stringify(localDB, null, 4));
      } else {
        await vendingMachineRef.set(localDB);
        localDB[vendingMachineId].totalItems.forEach(item => {
            item.amount = 0;
        });
        localDB[vendingMachineId].purchaselogs = [{"None":"None"}];
        await fs.writeFile(`public/VendingMachines/${vendingMachineId}/transactions.json`, JSON.stringify(localDB, null, 4));
      }
  
      console.log(`Firebase update for ${vendingMachineId} successful`);
    } catch (error) {
      console.error(`Error updating Firebase for ${vendingMachineId}:`, error);
    }
  }
  
  async function processVendingMachines(directoryPath) {
    try {
      const files = await fs.readdir(directoryPath);
  
      for (const file of files) {
          const vendingMachineId =  file
          const filePath = `./public/VendingMachines/${vendingMachineId}/transactions.json`
  
          try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const localDB = JSON.parse(fileContent);
  
            await updateFirebaseForVendingMachine(vendingMachineId, localDB);
          } catch (error) {
            console.error(`Error processing ${vendingMachineId}:`, error);
          }
      }
    } catch (error) {
      console.error('Error reading directories:', error);
    }
  }
// '*/30 * * * * *' for 30 seconds
// '0 */3 * * *' for 3 hrs.
cron.schedule('0 */3 * * *', () => {
    console.log('Running data update task...');
    processVendingMachines('./public/VendingMachines/');
});
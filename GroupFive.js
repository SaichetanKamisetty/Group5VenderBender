const fs = require("fs").promises;
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const port = 1234;
const ip = process.env.IP || "127.0.0.1";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, ip, () => {
  console.log(`Server running at http://${ip}:${port}/`);
});

app.get('/stockData', async (req, response) => {
   response.json( await fs.readFile('public/VendingMachines/VendingMachine1/localDB.json', 'utf8') );
});

app.get('/checkoutpage', async (req, response) => {
    response.send( await fs.readFile('public/checkout.html', 'utf8') );
});

app.post('/updateStockData', async (req, res) => {
    const updatedStockData = req.body;

    try {
        await fs.writeFile('public/VendingMachines/VendingMachine1/localDB.json', JSON.stringify(updatedStockData, null, 4));
    } catch (error) {
        console.error('Error writing to file:', error);
    }
});

app.get('/restockportallogin', async (req, response) => {
    response.send( await fs.readFile('public/restockerLogin.html', 'utf8') );
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
                response.redirect('/restockportal')
                return;
            }
        }
        response.status(401).send('Authentication failed, please try again.');
    })
    .catch(error=>console.error(error));

})

app.get('/restockportal', async (req, response) => {
    response.send( await fs.readFile('public/restockportal.html', 'utf8') );
});

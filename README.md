# Group 5 Vender Bender

### By: Sai chetan Kamisetty, Victor Nguyen, Justin Nguyen, Kenny Tran, Teyen Lee

This project is designed to streamline the management and restocking processes of vending machines. Below, you'll find information about the key components of our project, including backend and frontend technologies, along with important links.

## Backend

### Technologies Used:

- **NodeJS:**
  - Responsible for handling routing, parsing Vending Machine local directories, and managing restocker and management login authentication.

- **Express:**
  - Used in conjunction with NodeJS to handle HTTP requests from the frontend.

- **Firebase-admin:**
  - Utilized for restocker and management authentication, matching login requests from the frontend, and transferring information between local and management databases.

- **Node-cron:**
  - Manages background tasks, facilitating the transfer of data from the vending machine’s local databases to the management database using Firebase-admin.

## Frontend

### Technologies Used:

- **Bootstrap:**
  - Employs a responsive design for the Vending machine panel, checkout, and management panels, simplifying the display of data from the backend.

- **HTML & CSS:**
  - Used consistently across the project to present information to end users.

- **JavaScript:**
  - Fetches data from backend APIs and management databases, dynamically updating the DOM to reflect real-time information on the frontend.

# Important Links
  - /restockportallogin
  - /managementlogin
  - /

# Getting Started:

1. Clone the repository
```bash
git clone https://github.com/your-username/VendingMachineProject.git
```
2. Install backend dependancies.
```bash
npm install express firebase-admin node-cron body-parser
```
3. Start application
```bash
node ./GroupFive.js
```

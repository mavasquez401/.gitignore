require('dotenv').config();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const PORT = process.env.PORT;
const doxname = process.env.SECRET_USER;
console.log(doxname);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Checks to connect to server
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database as id ' + connection.threadId);
});

connection.query('DESCRIBE ' + process.env.DB_TABLE_NAME, (err, results) => {
  if (err) throw err;
  console.log(results);
});

// New user information
const newUser = {
  FirstName: 'John',
  LastName: 'Doe',
  Department: 'Engineering',
  StartDate: '2023-01-01',
  EndDate: null,  // If there's no end date, use null
  Salary: 75000.00,
  JobTitle: 'Software Engineer'
};

// Insert new user
// ? is a place holder
const query = `INSERT INTO ${process.env.DB_TABLE_NAME} (FirstName, LastName, Department, StartDate, EndDate, Salary, JobTitle) VALUES (?, ?, ?, ?, ?, ?, ?)`;
connection.query(query, [
  newUser.FirstName, 
  newUser.LastName, 
  newUser.Department, 
  newUser.StartDate, 
  newUser.EndDate, 
  newUser.Salary, 
  newUser.JobTitle], (err, results) => {
  if (err) throw err;
  console.log('New user added:', results.insertId);
});

app.get('/', (req, res) => {
  res.send('Hello Geeks!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
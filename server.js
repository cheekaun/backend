const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { query } = require('express');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port:'3307',
  database: 'test_db'
});

connection.connect(error => {
  if (error) {
    console.log('Error connecting to database: ', error);
  } else {
    console.log('Connected to database!');
  }
});

app.get('/api/data', (req, res) => {
  const sql = 'SELECT * FROM user';

  connection.query(sql, (error, results) => {
    if (error) {
      console.log('Error fetching data: ', error);
      res.status(500).json({
        error: error
      });
    } else {
      res.json({
        results
      });
    }
  });
});

app.post('/api/create', (req, res) => {
  const username = req.body.username
  const lastname = req.body.lastname
  const email = req.body.email
  const value = [username, lastname, email]
  const sql = `INSERT INTO user (username, lastname, email) VALUE ( ?, ? , ?)`;
  connection.query(sql, value, (err, result) => {
    if(err) {
      console.log('Error fetching data: ',err);
      res.status(500).json({
        error: err
      });
    }else{
      res.status(200).json({
        result: "บันทึกข้อมูลแล้ว",
        query: sql,
        data: {
          value
        }
      });
    }
  })
})

// app.get('/api/GetStationInfo', (req, res) => {
//   // const sql = "SELECT ChargeTypePicture, ChargeTypeName FROM `user_charge_info`,`user` WHERE `user_charge_info`.`userID` = `user`.`id`"
//   const userid = req.body.userid
//   const value = [userid]
//   const sql = `SELECT ChargeTypePicture, ChargeTypeName FROM user_charge_info,user WHERE user_charge_info.userID = user.id AND user_charge_info.userID = ?`;

//   connection.query(sql, value, (error, results) => {
//     if (error) {
//       console.log('Error fetching data: ', error);
//       res.status(500).json({
//         error: error
//       });
//     } else {
//       res.json({
//         results
//       });
//     }
//   });
// });

app.get('/api/GetStationInfo', (req, res) => {

  
  // const num = req.body.userid
  
  // const value = [num]
  // const sql = `SELECT user_charge_info.ChargeTypePicture, user_charge_info.ChargeTypeName FROM user_charge_info , user WHERE user_charge_info.userID = user.id AND user_charge_info.userID = ?`;
  const sql = 'SELECT * FROM user_charge_info';
  connection.query(sql,(error, results) => {
    if (error) {
      console.log('Error fetching data: ', error);
      res.status(500).json({
        error: error
      });
    } else {
      res.json({
        results
      });
    }
  });
});

// start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
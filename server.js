const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { query } = require('express');

// const app = express();
const app = express();
app.disable('x-powered-by');

// Middleware registration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port:'3307',
  database: 'test_db'

  
  // host: '000webhost.com',
  // user: 'id19597049_se_root',
  // password: '@Password1234',
  // database: 'id19597049_se_database'
  // Test Database from 000Webhost (Not work)
});

connection.connect(error => {
  if (error) {
    console.log('Error connecting to database: ', error);
  } else {
    console.log('Connected to database!');
  }
});

app.get('/api/data', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
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
  res.set('Access-Control-Allow-Origin', '*');
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

app.get('/api/GetStationInfo', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const userid = req.query.userid
  const stationID = req.query.stationID
  console.log("userid" + userid)
  console.log("stationID" + stationID)
  
  const sql = `SELECT user_charge_info.id, user_charge_info.ChargeTypePicture, user_charge_info.ChargeTypeName FROM user_charge_info  WHERE user_charge_info.userID = "${userid}" AND user_charge_info.StationID = "${stationID}"`
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

app.get('/api/GetAllStation', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userid = req.query.userid
  console.log("userid" + userid)

  const sql = `SELECT user_station.id, user_station.stationName FROM user_station WHERE user_station.userID =  "${userid}"`
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

app.get('/api/ChooseStation', (req, res) => {
  
  const userid = req.query.userid
  const stationID = req.query.stationID
  console.log("userid" + userid)
  console.log("stationID" + stationID)
  sql = ""
  
  if(stationID ===""){
    console.log("case 1")
    sql = `SELECT user_history.id, user_history.name , user_history.ChargeTP, user_history.ChargeTN , user_history.Cmodel , user_history.kWh , user_history.price , user_history.date FROM user_history WHERE user_history.userID =  ${userid}`
  }else{
    console.log("case 2")
    sql = `SELECT user_history.id, user_history.name , user_history.ChargeTP, user_history.ChargeTN , user_history.Cmodel , user_history.kWh , user_history.price , user_history.date FROM user_history WHERE user_history.userID =  ${userid} AND user_history.stationID = ${stationID}`
  }
  
  
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

app.get('/api/ChooseStationReview', (req, res) => {
  
  const userid = req.query.userid
  const stationID = req.query.stationID
  console.log("userid" + userid)
  console.log("stationID" + stationID)
  sql = ""
  
  if(stationID ===""){
    console.log("case 1")
    sql = `SELECT station_review.id, station_review.reviewer_name , station_review.score, station_review.comment , station_review.date_time FROM station_review WHERE station_review.userID =  ${userid}`
  }else{
    console.log("case 2")
    sql = `SELECT station_review.id, station_review.reviewer_name , station_review.score, station_review.comment , station_review.date_time FROM station_review WHERE station_review.userID =  ${userid} AND station_review.stationID = ${stationID}`
  }
  
  res.set('Access-Control-Allow-Origin', '*');
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


app.get('/api/CountScoreAndReview', (req, res) => {
  

  const userid = req.query.userid
  const stationID = req.query.stationID
  console.log("userid" + userid)
  console.log("stationID" + stationID)
  sql = ""
  
  if(stationID ===""){
    console.log("case 1")
    sql = `SELECT station_review.id, station_review.reviewer_name , station_review.score, station_review.comment , station_review.date_time , ROUND(AVG(station_review.score),1) as AVG_S, COUNT(station_review.id) as COUNT_R FROM station_review WHERE station_review.userID =  ${userid}`
  }else{
    console.log("case 2")
    sql = `SELECT station_review.id, station_review.reviewer_name , station_review.score, station_review.comment , station_review.date_time , ROUND(AVG(station_review.score),1) as AVG_S, COUNT(station_review.id) as COUNT_R FROM station_review WHERE station_review.userID =  ${userid} AND station_review.stationID = ${stationID}`
  }
  
  res.set('Access-Control-Allow-Origin', '*');
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


app.get('/api/GetAllYear', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userid = req.query.userid
  console.log("Allyear userid" + userid)

  //// http://localhost:5000/api/GetAllYear?userid=3
  const sql = `SELECT id ,Year FROM graph_info WHERE userID = "${userid}" GROUP BY Year ORDER BY id`
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

app.get('/api/GetAllMonth', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userid = req.query.userid
  console.log("All Month userid" + userid)
  
  //// http://localhost:5000/api/GetAllMonth?userid=3
  const sql = `SELECT id ,Month FROM graph_info WHERE userID = "${userid}" GROUP BY Month ORDER BY id`
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


app.get('/api/MakeGraph', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userid = req.query.userid
  const stationID = req.query.stationID
  const Year = req.query.Year
  const Month = req.query.Month

  console.log("userid" + userid)
  console.log("stationID" + stationID)
  sql = ""
  sql = `SELECT Year, Month , Day , ROUND(SUM(Income),2) as S_Income , SUM(Usetime) as usetime FROM graph_info WHERE userID = "${userid}"`
  // sql = `SELECT Year, Month , Day , ROUND(SUM(Income),2) as S_Income FROM graph_info_test WHERE userID = 3 AND StationID = 4 AND Year = 2000 AND Month = "${Month}" GROUP BY Day ORDER BY id`
  

  if(stationID !== ""){
    sql += ` AND StationID = ${stationID}`
  }
  
  if(Year !== ""){
    sql += ` AND Year = ${Year}`
  } 

  if(Month !== ""){
    sql += ` AND Month = "${Month}"`
  }

  if(Month !== ""){
    sql += ` GROUP BY Day ORDER BY id`
  }
  else if(Year !== ""){
    sql += ` GROUP BY Month ORDER BY id`
  } 
  else if(stationID !== ""){
    sql += ` GROUP BY Year ORDER BY id`
  }
  else{
    sql += ` GROUP BY Year ORDER BY id`
  }

  console.log(sql)
  ///// SELECT id , Income , Year , Month , Day as S_Income FROM graph_info WHERE userID = 3 AND StationID = 4 AND Year = 2000 AND Month = "มกราคม"  API สุดท้าย
  //// SELECT id , Income , Year , Month , Day , SUM(Income) as S_Income FROM `graph_info` WHERE userID = 3 AND StationID = 4 AND Year = 2000 AND Month = "มกราคม" เอา Income รวม

  // SELECT Year , ROUND(SUM(Income),2) as S_Income FROM graph_info WHERE userID = 3  GROUP BY Year ORDER BY id;  ไม่เลือกอะไรเลย
  // SELECT Year , ROUND(SUM(Income),2) as S_Income FROM graph_info WHERE userID = 3 AND StationID = 4 GROUP BY Year ORDER BY id;   เลือกแต่สถานี
  // SELECT Year, Month , ROUND(SUM(Income),2) as S_Income FROM graph_info WHERE userID = 3 AND StationID = 4 AND Year = 2000 GROUP BY Month ORDER BY id เลือกสถานี เลือกปี
  // SELECT Year, Month , Day , ROUND(SUM(Income),2) as S_Income FROM graph_info WHERE userID = 3 AND StationID = 4 AND Year = 2000 AND Month = "มกราคม" GROUP BY Day ORDER BY id เลือกสถานี เลือกปี เลือกเดือน
  
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
    // connection.end();
  });
});

app.get('/api/test_image', (req, res) => {
  sql = `SELECT id, image_name , image from test_image `

  connection.query(sql,(error, results) => {

    const image = results[4].image;
    console.log(image)
    

    if (error) {
      console.log('Error fetching data: ', error);
      res.status(500).json({
        error: error
      });
    } else {
      res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': image.length
      });
      res.end(image);
      // res.json({
      //   results
      // });
    }
  });
});

app.get('/api/SumIncomeAndUser', (req, res) => {

  // const userID = req.body.userID;
  // const StationID = req.body.StationID;
  const userID = req.query.userID;
  const StationID = req.query.StationID;
  const ChooseYear = req.query.ChooseYear;
  console.log("SumIncomeAndUser running")
  console.log(userID)
  console.log(StationID)
  console.log(ChooseYear)
  sql = `SELECT ROUND(SUM(Income),2) as Sun_Income , SUM(Usetime) as Sum_user, COUNT(id) as count_day FROM graph_info WHERE userID = "${userID}"`
  if(StationID!==""){
    sql = sql + ` AND StationID = "${StationID}"`
  }

  if(ChooseYear!==""){
    sql = sql + ` AND Year = "${ChooseYear}"`
  }
  
  
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

app.get('/api/GetUserInfo', (req, res) => {
  const userID = req.query.userID;
  sql = `SELECT * from user WHERE id = "${userID}"`
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


app.get('/api/Auth', (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  console.log(email)
  console.log(password)
  sql = `SELECT id from user WHERE email = "${email}" AND password = "${password}"`
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


///// Test Git
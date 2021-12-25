const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chord_recognizer_db'
});

connection.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Connected!');
});

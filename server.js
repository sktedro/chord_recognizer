const PORT = process.env.PORT || 5000;

/*
 *
 * Setup
 *
 */

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer = require("multer");
const nj = require("numjs");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "chord_recognizer_db"
});

db.connect((err) => {
  if(err){
    throw new Error(err);
  }
  console.log("Database connected");
});

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.use(express.json());

/* 
 *
 * Functions
 *
 */

function createNewTable(dbRecord){
  let newTable = "CREATE TABLE " + dbRecord.hash.data + " (";

  for(const prop in dbRecord){
    newTable += `${prop}` + " " + `${dbRecord[prop].type}` + ", ";
  }
  // Trim the last ', '
  newTable = newTable.substring(0, newTable.length - 2);

  newTable += ")";

  // console.log(newTable);

  db.query(newTable, (err, result) => {
    if(err){
      throw new Error(err);
    }else{
      console.log("A table " + dbRecord.hash.data + " was created");
    }
  });
}

function insertData(dbRecord){
  let insertData = "INSERT INTO " + dbRecord.hash.data + " (";

  for(const prop in dbRecord){
    insertData += `${prop}` + ", ";
  }
  // Trim the last ', '
  insertData = insertData.substring(0, insertData.length - 2);

  insertData += ") VALUES (";

  for(const prop in dbRecord){
    insertData += "'" + `${dbRecord[prop].data}` + "', ";
  }
  // Trim the last ', '
  insertData = insertData.substring(0, insertData.length - 2);

  insertData += ");";

  // console.log(insertData);

  db.query(insertData, (err, result) => {
    if(err){
      throw new Error(err);
    }
  });
}

/*
 *
 * Server responses
 *
 */

app.get("/api", (req, res) => {
  console.log("a");
  res.json({ message: "Hello from server!" });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  if(req.file.mimetype !== "audio/wav"){
    throw new Error("The file must be a WAV file");
  }else{

    // The new database record
    let dbRecord = {
      hash: {
        data: "",
        type: "VARCHAR(255)"
      },
      filename: {
        data: "",
        type: "VARCHAR(255)"
      },
    };

    dbRecord.hash.data = req.file.filename;
    dbRecord.filename.data = req.file.originalname;

    // Create a new table
    createNewTable(dbRecord);


    // Insert all the data
    insertData(dbRecord);

    res.json({ message: "File successfully uploaded", filename: req.file.filename });
  }
});


/*
 *
 * Listening
 *
 */

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

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
const fs = require("fs");
const path = require("path");
const wavefileParser = require('wavefile-parser');

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

function parseSamples(samples){
  let output = [];
  for(let i = 0; i < samples.length; i += 2){
    // b1 is the lower part since samples are in little endian
    let b1 = samples[i];
    // b2 is the upper part of the int16
    let b2 = samples[i + 1];

    let x = ((b2 & 0xFF) << 8) | (b1 & 0xFF);

    // If b2 is a negative number...
    if(b2 & (1 << 7)){
      x = 0xFFFF0000 | x;
    }
    output.push(x);
  }
  return output;
}

function makeMono(samples, channels){
  let output = [];

  for(let i = 0; i < samples.length; i += channels){
    if(channels > 1){
      // Take the average
      let avg = 0;
      for(let j = 0; j < channels; j++){
        avg += samples[i + j];
      }
      output.push(avg / channels);
    }
  }

  return output;
}

function processAudio(dbRecord){
  // Read the file
  const file = fs.readFileSync(path.join(__dirname, "./uploads/" + dbRecord.hash.data));

  // Parse the data
  const wav = new wavefileParser.WaveFileParser();
  wav.fromBuffer(file);

  // Save the data
  dbRecord.sampleRate.data = wav.fmt.sampleRate;
  dbRecord.lenSamples.data = wav.data.chunkSize;
  dbRecord.lenSeconds.data = wav.data.chunkSize / wav.fmt.sampleRate / wav.fmt.bitsPerSample * 8 / wav.fmt.numChannels;
  dbRecord.channels.data = wav.fmt.numChannels;
  dbRecord.bitsPerSample.data = wav.fmt.bitsPerSample;

  // Parse the samples
  let samples = parseSamples(wav.data.samples);
  samples = makeMono(samples, wav.fmt.numChannels);
  samples = samples.map(x => x / 32768);

  // Parse the samples so it can be passed to the fft (which needs a complex
  // num)
  fftInput = [];
  for(sample in samples){
    fftInput.push([samples[sample], 0]);
  }
  fftInput = nj.array(fftInput);

  // Get the frames
  frames = [];
  let step = 1024;
  let width = 2048;
  let i = 0;
  while(i + width < fftInput.shape[0]){
    frames.push(fftInput.slice([i, i + width]));
    i += step;
  }
  
  // FFT
  let ffts = [];
  for(frame in frames){
    ffts.push(nj.fft(frames[frame]));
  }
  // console.log(ffts[0]);
  // console.log(JSON.stringify(ffts[0]));


  // Pass the data to a NN
  

  // Return the chords
}

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
      size: {
        data: "",
        type: "INT"
      },
      sampleRate: {
        data: "",
        type: "INT"
      },
      lenSamples: {
        data: "",
        type: "INT"
      },
      lenSeconds: {
        data: "",
        type: "DOUBLE"
      },
      channels: {
        data: "",
        type: "INT"
      },
      bitsPerSample: {
        data: "",
        type: "INT"
      },
    };


    dbRecord.hash.data = req.file.filename;
    dbRecord.filename.data = req.file.originalname;
    dbRecord.size.data = req.file.size;

    // Calculate the data
    processAudio(dbRecord);

    // Create a new table and insert all the data
    createNewTable(dbRecord);
    insertData(dbRecord);

    console.log(dbRecord);

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

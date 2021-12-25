const express = require("express");
const cors = require("cors");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api", (req, res) => {
  console.log("a");
  res.json({ message: "Hello from server!" });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  if(req.file.mimetype !== "audio/wav"){
    throw new Error("The file must be a WAV file");
  }else{
    // let fileName = req.file.filename;
    res.json({ message: "File successfully uploaded", filename: req.file.filename });
  }
});

app.post("/api/process", (req, res) => {
  console.log(req.body);
  res.json({ message: "Processing the file " + req.body.filename });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

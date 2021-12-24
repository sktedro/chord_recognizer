const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || "3000";

/*
 * View
 */

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/*
 * Server
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

// Also server all files in public/
app.use(express.static(path.join(__dirname, "public")));


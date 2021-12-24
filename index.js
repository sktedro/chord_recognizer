const express = require("express");
const path = require("path");
const app = require("./app.js");

const application = express();
const port = process.env.PORT || "3000";

/*
 * View
 */

application.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/*
 * Server
 */

application.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

// Also serve all files in public/
application.use(express.static(path.join(__dirname, "public")));

/*
 * Requests
 */

application.post("/", function(req, res) {
  console.log(req.body);
  app.setup();
  res.send(200);
  // res.write("SUP");
});


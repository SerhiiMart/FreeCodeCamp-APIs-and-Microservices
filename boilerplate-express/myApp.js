var express = require('express');
var app = express();

app.get("/", (req, res) => {
  res.send('Hello Express');
});

let absolutePath = __dirname + "/views/index.html";
app.get("/", function(req, res) {
  res.sendFile(absolutePath);
});

app.use("/public",  express.static(__dirname + "/public"));

app.get("/json", (req, res) => {
  res.json({
    message: "Hello json"
  });
});

///Can't do it
let messageS = "Hello json";

app.use('/json', (req, res) => {

  if (mySecret === "uppercase") {
    return res.json({ "message": messageS.toUpperCase() })
  }
  else {
    return res.json({ "message": messageS })
  }
})





































 module.exports = app;

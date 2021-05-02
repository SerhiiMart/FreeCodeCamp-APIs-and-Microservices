var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //// from №10
//// №2
//  app.get("/", (req, res) => {
//   res.send('Hello Express');
// });


//// №3
let absolutePath = __dirname + "/views/index.html";
app.get("/", function(req, res) {
  res.sendFile(absolutePath);
});
//// №4
app.use("/public",  express.static(__dirname + "/public"));

//// №5
// app.get("/json", (req, res) => {
//   res.json({
//     message: "Hello json"
//   });
// });


//// №6
let messageS = "Hello json";

app.use('/json', (req, res) => {

  if (process.env['MESSAGE_STYLE'] === "uppercase") {
    return res.json({ "message": messageS.toUpperCase() })
  }
  else {
    return res.json({ "message": messageS })
  }
})

//// №7
app.use(function middleware(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

//// №8

app.get('/now', (req, res, next) => {
  req.time = new Date().toString();  
  next();
},
(req, res) => {
  res.send({
    time: req.time
  });
}
);


//// №9
app.get('/:word/echo', (req, res, next) => {
  const {word} = req.params;
 res.json({
    echo: word
  });
});



//// №10
app.get('/name', (req, res) => {
  let { first: firstName, last: lastName } = req.query;
 res.json({name: `${firstName} ${lastName}`});
});

//// №11
app.use(bodyParser.urlencoded({ extended: false}));


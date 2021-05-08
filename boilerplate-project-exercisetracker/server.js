const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const uri = process.env["MONGO_URI"];
const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 }, (error) => {
  if (error) console.log(error);
  console.log("Connection to the Database is successful");
});


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

////Working on exers

let DDDSchema = new mongoose.Schema({
  description: {type : String, required: true},
  duration: {type : Number, required: true},
  date: String
})

let userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  log: [DDDSchema]
})

let Log = mongoose.model("Log", DDDSchema);
let User = mongoose.model("User", userSchema);

app.post("/api/users", (req, res) => {
  const { username } = req.body;

   User.findOne({ username }, (err, found)=>{
    if(err) return res.send(err);
    if(found) res.send("Username already taken");
    else {
      const newUser = new User({ username });

       newUser.save(async (err, user) => {
        if(err) res.send(err);
        res.json({username: newUser.username, _id: newUser.id})
      });     
    }
  });
});

app.get("/api/users", (req, res) => {
  User.find().select("id username __v").exec((err, data) => {
    res.json(data)
  });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const { description, duration, date } = req.body;
  const parsedDuration = Number(duration);

  let newDate;

  if(!date){
    newDate = new Date();
  } else if(!new Date(date)) {
    return res.send("invalid date format");
  } else{
    newDate = new Date(date);
  }

  const newLog = new Log({
    description,
    duration: parsedDuration,
    date: newDate
    });

  User.findByIdAndUpdate(
    req.params["_id"],
    {$push:{log: newLog}},
    {new: true},
    (err, found) => {
    if(err) return res.json(err);
    console.log(newDate);
    res.json({
      _id: found.id,
      username: found.username,
      date: newDate.toDateString(),
      duration: parsedDuration,
      description
      });
  });
});


app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  let { from, to, limit } = req.query;

  User.findById(_id).select("-log._id").exec((err, user) => { 
    if(err) res.send(err);

    if(from || to){
      to = (to === undefined) ? to : new Date(to);
      from = (from === undefined) ? from : new Date(from);
      user.log = user.log.filter(i => to ? i.date <= to : true && from ? i.date >= from : true);
    }

    if(limit){
      user.log = user.log.slice(0,limit);
    }

    res.json({
      _id: _id,
      username: user.username,
      from: from ? from.toDateString() : from,
      to: to ? to.toDateString() : to,
      count: user.log.length,
      log: user.log.map(i => {
        return {
          description: i.description,
          duration: i.duration,
          date: i.date.toDateString()
        }
      })
    })
  });
});



////Listener

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

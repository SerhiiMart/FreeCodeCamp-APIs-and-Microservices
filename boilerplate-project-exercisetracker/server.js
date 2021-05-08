const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const uri = process.env.MONGO_URI;
const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

let exerciseTrackerSchema = new mongoose.Schema({
  description: {type : String, required: true,  unique: true,},
  duration: {type : Number, required: true},
  date: String
})

let userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [exerciseTrackerSchema]
})

let Session = mongoose.model("Session", exerciseTrackerSchema);
let User = mongoose.model("User", userSchema);

app.post('/api/users', bodyParser.urlencoded({ extended: false }), (req, res) => {
  let newUser = new User({username: req.body.username})
  newUser.save((error, savedUser) => {
    if(!error){
      let resObj = {}
      resObj['username'] = savedUser.username
      resObj['_id'] = savedUser.id
      res.json(resObj)
    }
  })
})
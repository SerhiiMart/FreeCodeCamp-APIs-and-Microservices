require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const uri = process.env.MONGO_URI;
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


////working on

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const urlSchema = new mongoose.Schema({
  original : {type: String, required: true},
  short: Number
})

let Url = mongoose.model('Url', urlSchema)

let bodyParser = require('body-parser');
let resObj = {}
app.post('/api/shorturl', bodyParser.urlencoded({ extended: false }) , (req, res) => {
  let inputUrl = req.body['url']
  
  let urlRegex = new RegExp(/^(http|https)(:\/\/)/)
  
  if(!inputUrl.match(urlRegex)){
    res.json({ error: "invalid url" })
    return
  }
    
  resObj['original_url'] = inputUrl
  
  let inputShort = 1
  
  Url.findOne({})
        .sort({short: 'desc'})
        .exec((error, result) => {
          if(!error && result != undefined){
            inputShort = result.short + 1
          }
          if(!error){
            Url.findOneAndUpdate(
              {original: inputUrl},
              {original: inputUrl, short: inputShort},
              {new: true, upsert: true },
              (error, savedUrl)=> {
                if(!error){
                  resObj['short_url'] = savedUrl.short
                  res.json(resObj)
                }
              }
            )
          }
  })
  
})

app.get('/api/shorturl/:input', (req, res) => {
  let input = req.params.input;
  
  Url.findOne({short: input}, (error, result) => {
    (!error && result != undefined) ? res.redirect(result.original) :
      res.json( ' invalid url ');
  })
})
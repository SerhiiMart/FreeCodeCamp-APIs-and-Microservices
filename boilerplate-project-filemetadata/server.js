var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
   const output = {
  'name': req.file.originalname,
  'type' : req.file.mimetype,
  'size' : req.file.size
}
  next().res.json(output)
})


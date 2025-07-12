require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getValidateUrl } = require('./middleware/get-url.js')
const { postValidateUrl } = require('./middleware/pos-url.js')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:short', getValidateUrl, function (req, res) {
  if (req.xError) {
    res.json({ error: req.xError })
  } else {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }).redirect(req.xData);
  }
});

app.get('/api/shorturl', function (req, res) {
  res.send('Not found')
});

app.post('/api/shorturl', postValidateUrl, function (req, res) {
  const error = req?.xError
  const data = req?.xData

  if (error) {
    res.json({ error })
  } else {
    res.json(data)
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

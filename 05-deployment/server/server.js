'use strict';

// Node Modules
// depencies
require('dotenv').config();
const express = require('express');

// app
const app = express();

//PORT
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'));

app.get('/hello', (request, response) => {
  response.status(200).send('hello');
})

app.use('*', (req, res) => {
  res.status(400).send('sorry that didnt work');
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');

//Load env vars;
require('dotenv').config();

const PORT = process.env.PORT || 3000; //takes from a .env file and then the terminal env

//app
const app = express();

app.use(cors());

// Routes

app.get('/location', getLocation)

app.get('/weather', getWeather)

//Handlers

function getLocation(request, response) {
  console.log(request.query.data);
  const locationData = searchToLatLong(request.query.data); // 'Lynnwood, WA'
  response.send(locationData);
}

function getWeather (req, res) {
  const weatherData = searchForWeather(req.query.data)
  res.send(weatherData);
}

// Constructors

function Daily(dailyForecast) {
  this.forecast = dailyForecast.summary;
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}
function Location(location) {
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

// Search for Resource 

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function searchForWeather(query){
  let weatherData = require('./data/darksky.json');
  let dailyArray = [];
  weatherData.daily.data.forEach(forecast => dailyArray.push(new Daily(forecast)));
  return dailyArray;
}



// Give error messages if incorrect
// you should have this in the finished app but you dont need it yet

// app.get('/*', function(req, res) {
//   res.status(404).send('you are in the wrong place');
// })

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})


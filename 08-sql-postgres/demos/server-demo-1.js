'use strict';

//Node modules
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const app = express();
app.use(cors());

//ENV vars

const PORT = process.env.PORT;

//postgres
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.get('/location', (req, res) => {
  let query = req.query.data;
  // check our db for that data
  const SQL = 'SELECT * FROM locations WHERE search_query=$1';
  const values = [query];
  return client.query(SQL, values)

    .then(data => { // then if we have it, send it back;
      if(data.rowCount){
        console.log('Location retreived from database')
        console.log(data);
        res.status(200).send(data.rows[0]);
      } else {// otherwise, get it from google

        const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`

        return superagent.get(URL)
          .then(result => {
            console.log('Location retreived from google')
            // then normalize it

            let location = new Location(result.body.results[0]);
            let SQL = `INSERT INTO locations 
            (search_query, formatted_query, latitude, longitude)
            VALUES($1, $2, $3, $4)`;
 
            // store it in our db
            return client.query(SQL, [query, location.formatted_query, location.latitude, location.longitude])
            .then(() => {
            
              // then send it back
              res.status(200).send(location);
            })

          })

      }
    })
    .catch(err => {
      console.error(err);
      res.send(err)
    })

})


function Location(location) {
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}

// Search for Resource 



app.listen(PORT, () => console.log(`I am up on port ${PORT}`))

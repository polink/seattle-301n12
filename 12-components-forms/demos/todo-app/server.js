'use strict';

const express = require('express');
const pg = require('pg');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs')

const client = new pg.Client('postgres://ncarignan:password@localhost:5432/task_app');
client.connect();
client.on('err', err => console.error(err));

const PORT = process.env.PORT || 3000;

app.get('/', home);

app.post('/task', addTask);

app.get('/addTask', showForm);

function showForm(req, res){
  res.render('pages/add-view');
}

function home( req, res ){
  client.query(`SELECT * FROM tasks`)
    .then(data => {
      res.render('index', {tasks: data.rows});

    })
}

function addTask(req, res) {
  const values = Object.values(req.body);
  const SQL = `INSERT INTO tasks
              (title, description, contact, status, category)
              values($1, $2, $3, $4, $5)`

  client.query(SQL, values)
    .then(res.redirect('/'))
}

app.listen(PORT, () => console.log(`listening on PORT : ${PORT}`))

'use strict';

const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    console.log(req.body['_method']);
    let method = req.body['_method'];
    delete req.body['_method'];
    return method; //returns PUT, PATCH, POST, GET, or DELETE
  }
}))

app.set('view engine', 'ejs')

const client = new pg.Client('postgres://ncarignan:password@localhost:5432/task_app');
client.connect();
client.on('err', err => console.error(err));

const PORT = process.env.PORT || 3000;

app.get('/', home);

app.get('/addTask', showForm);

app.get('/task/:task_id', getOneTask);

app.post('/task', addTask);

app.delete('/task/:task_id', deleteTask);

app.get('*', (req, res) => res.status(404).send('This route does not exist'));

function deleteTask (req, res) {
  console.log(`deleting the task ${req.params.task_id}`);
  client.query(`DELETE FROM tasks WHERE id=$1`, [req.params.task_id])
    .then(result => {
      console.log(result);
      res.redirect('/');
    })
}

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

function getOneTask(req, res){
  client.query('SELECT * FROM tasks WHERE id=$1', [req.params.task_id])
    .then(result =>{
      return result.rowCount ? res.render('pages/detail-view', {task: result.rows[0]}) : handleError('no task', res)
    })
    .catch(handleError)
}

function handleError(error, response) {
  response.render('pages/error-view', { error: 'Uh Oh' });
}

app.listen(PORT, () => console.log(`listening on PORT : ${PORT}`))

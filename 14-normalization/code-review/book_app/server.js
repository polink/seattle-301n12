'use strict'

// Dependencies

const express = require('express');
const superagent = require('superagent');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(methodOverride((request, response) => {
  if(request.body && typeof request.body === 'object' && '_method' in request.body) {
    console.log(request.body['_method']);
    let method = request.body['_method'];
    delete request.body['_method'];
    return method; //returns PUT, PATCH, POST, GET, or DELETE.
  }
}))

app.set('view engine', 'ejs');

app.get('/', home);
app.get('/new', newSearch);
app.get('/books/:id', visitBookDetail);
app.get('/books/edit/:id', visitBookUpdate);

app.post('/searches', search);
app.post('/selectbook', saveBook);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook)

function deleteBook(request, response) {
  console.log (`deleting the book ${request.params.id}`);
  client.query(`DELETE FROM books WHERE id=$1`, [request.params.id])
    .then(result => {
      console.log(result);
      response.redirect('/');
    })
    .catch( err => {
      console.log('delete book error')
      return handleError(err, response);
    })
}

function visitBookUpdate(request, response){
  let SQL = 'SELECT * FROM books where id=$1';
  let values = [request.params.id];
  return client.query(SQL, values)
    .then(result => {
      response.render('pages/books/update', { selected_book: result.rows[0] }
      )
    })
    .catch(err => {
      console.log('database request error')
      return handleError(err, response);
    })
}

/*
author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(500),
  description TEXT,
  bookshelf VARCHAR(255)
*/

function updateBook(request, response) {
  console.log (`updating the book ${request.params.id}`);
  const values = [request.body.title, request.body.isbn, request.body.image_url, request.body.description, request.body.bookshelf, request.body.author, request.params.id];

  client.query(`UPDATE books SET title=$1, isbn=$2, image_url=$3, description=$4, bookshelf=$5, author=$6  WHERE id=$7`, values)
    .then(result => {
      console.log('hi were here')
      console.log(result);
      response.redirect(`/books/${request.params.id}`);
    })
    .catch( err => {
      console.log('update book error')
      return handleError(err, response);
    })
}

//database
const client = new pg.Client(process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_CYAN_URL);
client.connect();
client.on('error', err => console.error(err));

function home(request, response) {
  let SQL = 'SELECT * FROM books';
  return client.query(SQL)
    .then(result => {
      if(result.rowCount === 0) {//If there is nothing there go search for books
        response.render('pages/searches/new')
      } else {
        response.render('pages/index', {books:result.rows});//get it from the database
      }
    })
    .catch( err => {
      console.log('database request error')
      return handleError(err, response);
    })
}

function search(request, response) {
  const searchStr = request.body.search[0];
  const searchType = request.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(searchType === 'title') {
    url += `+intitle:${searchStr}`;
  } else if (searchType === 'author') {
    url += `+inauthor:${searchStr}`;
  }
  return superagent.get(url)
    .then( result => {
      let books = result.body.items.map(book => new Book(book));
      response.render('pages/searches/show', {books});
    })
    .catch( err => {
      console.log('superagent error')
      return handleError(err, response);
    })
}

function newSearch (request, response){
  response.render('pages/searches/new');
}


function handleError (err, response) {
  console.error(err);
  response.render('pages/error', err);
}

function visitBookDetail(request, response) {
  let SQL = 'SELECT * FROM books where id=$1';
  let values = [request.params.id];
  return client.query(SQL, values)
    .then(result => {
      response.render('pages/books/show', {selected_book:result.rows[0]}
      )
    })
    .catch( err => {
      console.log('database request error')
      return handleError(err, response);
    })
}


function saveBook(request, response) {
  let newBook = new BookshelfBook(request.body);
  let bookArray = Object.values(newBook);
  bookArray.pop();
  let SQL = `INSERT INTO books(author, title, isbn, image_url, description, bookshelf)
  VALUES($1, $2, $3, $4, $5, $6)`

  return client.query(SQL, bookArray)
    .then( () => response.redirect('/'))
    .catch( err => {
      console.log('database input error')
      return handleError(err, response);
    })
}

function Book(book) {
  this.author = book && book.volumeInfo && book.volumeInfo.authors || 'Author Unknown';
  this.title = book && book.volumeInfo && book.volumeInfo.title || 'Title Missing';

  this.isbn = book && book.volumeInfo && book.volumeInfo.industryIdentifiers && book.volumeInfo.industryIdentifiers[0] && book.volumeInfo.industryIdentifiers[0].type + book.volumeInfo.industryIdentifiers[0].identifier || 'ISBN Missing';

  this.image_url = book && book.volumeInfo && book.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpeg';
  this.description = book && book.volumeInfo && book.volumeInfo.description || 'Description Missing';
}

function BookshelfBook(book) {
  this.author = book.author;
  this.title = book.title;
  this.isbn = book.isbn;
  this.image_url = book.image_url;
  this.description = book.description || 'description error';
  this.bookshelf = book.bookshelf || 'unassigned';
  this.id = book.id ? book.id : book.isbn;
}

app.listen( PORT, () => console.log(`APP is up on PORT:${PORT}`));

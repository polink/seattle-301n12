'use strict';

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

require('dotenv').config();

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

// const client = new pg.Client();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => console.error(err));
client.connect();

const PORT = process.env.PORT || 3000;

//Routes
app.get('/', home)
app.get('/new', newSearch)
app.post('/searches', search)
app.post('/book', addBook)

function addBook(req, res){
  console.log(req.body);
  let newBook = new LibraryBook(req.body);
  let bookArray = Object.values(newBook);
  bookArray.pop();
  let SQL = `INSERT INTO books(author, title, isbn, image_url, description, bookshelf)
    VALUES($1, $2, $3, $4, $5, $6)`
  return client.query(SQL, bookArray)
    .then(() => res.redirect('/'))
    .catch(console.error);
}



function home(request, response){
  const SQL = 'SELECT * FROM books';
  return client.query(SQL)
    .then(data =>{
      let books = data.rows.map(book => new LibraryBook(book));
      response.render('pages/index', {books});
    }).catch(err => {
      console.log(err);
      console.log('bad request from sql');
      response.render('pages/error',{err});
    });
}


function newSearch(request, response){
  console.log('newSearch;)');
  response.render('pages/searches/new')
}

function search(request, response){
  const searchStr = request.body.search[0];
  const searchType = request.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(searchType === 'title'){
    url += `+intitle:${searchStr}`;
  } else if(searchType === 'author'){
    url += `+inauthor:${searchStr}`
  }

  return superagent.get(url)
    .then(result => {
      let books = result.body.items.map(book => new Book(book));
      response.render('pages/searches/show', {books});

      let SQL = `INSERT INTO books
      (title, author, description, image_url, isbn, bookshelf)
      VALUES ($1, $2, $3, $4, $5, $6)`;
      let values = books[0];
      return client.query(SQL, [values.title, values.author, values.description, values.image_url, values.isbn, values.bookshelf]);
    }).catch(err => {
      console.log(err);
      response.render('pages/error',{err});
    });
}

//Constructors

function Book(book, bookshelf){
  // console.log(book);
  this.title = book.volumeInfo.title || 'this book does not have a title';
  this.author = book.volumeInfo.authors || 'this book was written by no one'
  this.isbn = book.volumeInfo.industryIdentifiers[0].type + ' ' + book.volumeInfo.industryIdentifiers[0].identifier
  this.image_url = book.volumeInfo.imageLinks.thumbnail
  this.description = book.volumeInfo.description || 'this book isn\'t important enough for a description'
  // this.placeholderImage = 'https://i.imgur.com/J5LVHEL.jpeg';
  this.bookshelf = bookshelf;
}

function LibraryBook(book, bookshelf){
  // console.log(book);
  this.title = book.title;
  this.author = book.author;
  this.isbn = book.isbn;
  this.image_url = book.image_url;
  this.description = book.description;
  this.bookshelf = bookshelf ? bookshelf : 'indetermined';
  this.id = book.id ? book.id : book.isbn;
}
app.listen(PORT, () => console.log(`APP is up on PORT : ${PORT}`));

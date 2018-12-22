'use strict';

const express = require('express');

const superagent = require('superagent');

const app = express();
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.get('/', home);

app.post('/searches', search)


function home(request, response){
  response.render('pages/index');
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
      response.render('pages/show', {books});
    })

}

function Book(book){
  console.log(book);
  this.title = book.volumeInfo.title || 'this book does not have a title';
  this.placeholderImage = 'https://i.imgur.com/J5LVHEL.jpeg';
}

app.listen(PORT, () => console.log(`APP is up on PORT : ${PORT}`));

'use strict';

function Dog(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.hobbies = obj.hobbies;

  allDogs.push(this);
}

const allDogs = [];

Dog.prototype.render = function() {
  $('main').append('<div class="clone"></div>');
  let $clone = $('div[class="clone"]');

  let dogTemplate = $('#template').html();

  $clone.html(dogTemplate);

  $clone.find('h1').text(this.name);
  $clone.find('p').text(this.hobbies);
  $clone.find('img').attr('src', this.image_url);

  $clone.removeClass('clone');
  $clone.attr('class', this.name);
  
}

function readJson () {
  $.get('./data.json', 'json')
    .then(data => {
      data.forEach(dogObj => {
        new Dog(dogObj);
      })
    })
    .then(function() {
      allDogs.forEach(dog =>{
        dog.render();
      })
    })
}

$(() => readJson());
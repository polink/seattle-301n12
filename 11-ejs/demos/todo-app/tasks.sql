-- WARNING: this drops todo_app_demo db so make sure that's what you want!
DROP DATABASE todo_app_demo;
CREATE DATABASE todo_app_demo;
\c todo_app_demo;
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status BOOLEAN,
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, contact, status, category, description) 
VALUES('milk cows','jb',FALSE,'farm','family is thirsty');

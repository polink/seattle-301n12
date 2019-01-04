DROP TABLE IF EXISTS books;
CREATE TABLE books (
id SERIAL PRIMARY KEY,
author VARCHAR (255),
title VARCHAR (255),
isbn VARCHAR (255),
image_url VARCHAR(255),
description VARCHAR (3000),
bookshelf VARCHAR (255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
    values('Sanderson', 'Warbreaker', 9780765320308, 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'totally real description', 1);

    INSERT INTO books (author, title, isbn, image_url, description, bookshelf)
        values ('Edgar Sanderson', 'Great Britain in Modern Africa', 39015003970707, 'http://books.google.com/books/content?id=uvIbAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'no description provided', 1);
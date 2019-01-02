# Lab 13: Updating and Deleting Resources

## Configuration

_Your repository must include the following config files:_

- `.env` - with your PORT and DATABASE_URL. Make sure this file is included in your `.gitignore`
- `README.md` - with documentation regarding your lab and it's current state of development. Check the "documentation" section below for more details on how that should look **AT MINIMUM**
- `.gitignore` - with standard NodeJS configurations
- `.eslintrc.json` - with Code 301 course standards for the linter
- `package.json` - with all dependencies and any associated details related to configuration. Note that you will be adding a new package today called `method-override`.
- Note that the `package-lock.json` file is automatically created when dependencies are installed and ensures that future installations of the project use the same versions of the dependencies.
Use the following as a guide for your directory structure.

```sh
book_app (repository)
├──public
│  └── styles
│      ├── base.css
│      ├── fonts
│      │   ├── icomoon.eot
│      │   ├── icomoon.svg
│      │   ├── icomoon.ttf
│      │   └── icomoon.woff
│      ├── icons.css
│      ├── layout.css
│      ├── modules.css
│      └── reset.css
├──views
│  ├── layout
│  │   ├── footer.ejs
│  │   ├── head.ejs
│  │   └── header.ejs
│  └── pages
│      ├── books
│      │   ├── detail.ejs
│      │   ├── edit.ejs
│      │   └── show.ejs
│      ├── searches
│      │   ├── new.ejs
│      │   └── show.ejs
│      ├── error.ejs
│      └── index.ejs
├── .env
├── .eslintrc.json
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

## User Stories and Feature Tasks

### Overview

Today's features include the ability to update or delete a book from the collection. These events can be triggered from the detail view of a single book.

### Time Estimate

For each of the features listed below, make an estimate of the time it will take you to complete the feature, and record your start and finish times for that feature:

```
Number and name of feature: ________________________________

Estimate of time needed to complete: _____

Start time: _____

Finish time: _____

Actual time needed to complete: _____
```

Add this information to your README.

### Feature 1: Update a Book

#### Why are we implementing this feature?

- As a user, I want to update the details of a book so that it displays the way I want it to, according to my personalized preferences.

#### What are we going to implement?

Given that the user on a book detail page would like to update the information stored for the book  
When the user clicks on the "Update Details" button    
Then the form containing the details should be revealed  

Given that the user updates book details in the edit form  
When the user clicks on the "Update Book" button  
Then the user-provided details for that book should be saved in the database  

#### How are we implementing it?

- In your detail view, add a button to reveal a form containing the information of that book. In the provided wireframes, this is shown as a button that says "Update Details" in the file named `13-details.png`. 
- Load the form markup from a partial called `edit.ejs`, a part of your book component.
- The form should be prepopulated with the current database information about the book.
- The form should include a `select` dropdown menu containing all of the bookshelves currently in the database. Your SQL query to retrieve the books will include `SELECT DISTINCT` as part of the command. The bookshelf on which the book currently sits should be selected by default.
- The user can update any of the details and submit the form by clicking a button. In the provided wireframes, this is shown as a button that says "Update Book" in the file named `13-update.png`. Ensure that you are using the method override syntax demonstrated in class.
- Add an endpoint for a `PUT` request to `/books/:id`. The associated callback should run a database command to update the details of the book. Then, redirect the user to the detail view for the book that was just updated.
- Keep your form DRY: Utilize the same form partial to replace the book creation form found on the search results page. Use JS logic where needed to make the one form partial work in BOTH contexts. You'll likely want to pass to the partial a value to indicate which mode the form should be in.

### Feature 2: Delete a Book

#### Why are we implementing this feature?

- As a user, I want to remove books from my collection so that it accurately represents my favorite books.

#### What are we going to implement?

Given that a user on the book detail page would like to remove a book from the collection  
When the user clicks on the "Delete Book" button  
Then the book should be removed from the collection    

#### How are we implementing it?

- In your detail view, add a button to delete the book. In the provided wireframes, this is shown as a button that says "Delete Book" in the file named `13-details.png`. Ensure that you are using the method override syntax demonstrated in class.
- Ensure that the delete button isn't showing up on the index page, nor on the search results page. CSS is your friend. 
- Add an endpoint for a `DELETE` request to `/books/:id`. The associated callback should run a database command to remove the book from the table. Then, redirect the user to the home page.
- Redeploy your application.

## Stretch Goals

*As a user, I want to use sprite sheets for my form elements so that my form is unique.*

Given that the user wants to add a book to their collection  
When the user interacts with the form  
Then the form elements should show a background image sourced from a sprite sheet  

*As a user, I want to organize my books by author so that I can view all of the books that a single author has written and view the details about their work.*

Given that the user wants to enhance their book collection  
When the books are displayed  
Then the books should be displayed by author or by title  

- Create a new form to add details about an individual author.
- Create a new table in your `books_app` database for authors. The table should include the author's name and a book id as the foreign key.
- Add the functionality to select an author and view all of the books in your collection written by that author.

## Documentation

_Your `README.md` must include:_

```md
# Project Name

**Author**: Your Name Goes Here
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for a Code Fellows 301 class. (i.e. What's your problem domain?) -->

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->

## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with GET and POST routes for the book resource.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
-->
```

## Submission Instructions

- Continue working in the same repository from the previous class.
- Continue to work on semantically-named non-master branches.
- Complete your Feature Tasks for the day (below)
- Create a Pull Request (PR) back to the `master` branch of your repository
- On Canvas, submit a link to your PR and a link to your deployed application on Heroku. **Make sure to include the following:**
  - A question within the context of today's lab assignment
  - An observation about the lab assignment, or related 'Ah-hah!' moment
  - How long you spent working on this assignment

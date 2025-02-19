const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //res.send(JSON.stringify(books,null,4));
  
  let getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(books);
    }, 6000);
  });

  getBooksPromise.then((books) => {
    res.json(books);
  })
  .catch((error) => {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //const isbn = req.params.isbn;
  //res.send(books[isbn]);

  let getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    }, 3000);
  });

  getBooksPromise.then((book) => {
    res.json(book);
  })
  .catch((error) => {
    res.status(404).json({ message: error.message });
  });


 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //const author = req.params.author;
  //let filtered_books = Object.values(books).filter((book) => book.author === author);
  // Send the filtered_books array as the response to the client
  //res.send(filtered_books);  
  
  let getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const author = req.params.author;
        let filtered_books = Object.values(books).filter((book) => book.author === author);      
        resolve(filtered_books);
    }, 3000);
  });

  getBooksPromise.then((books) => {
    res.json(books);
  })
  .catch((error) => {
    res.status(404).json({ message: error.message });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //const title = req.params.title;
  //let filtered_books = Object.values(books).filter((book) => book.title === title);
  // Send the filtered_books array as the response to the client
  //res.send(filtered_books);

  let getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const title = req.params.title;
        let filtered_books = Object.values(books).filter((book) => book.title === title);     
        resolve(filtered_books);
    }, 3000);
  });

  getBooksPromise.then((book) => {
    res.json(book);
  })
  .catch((error) => {
    res.status(404).json({ message: error.message });
  });


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

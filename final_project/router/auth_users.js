const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: "zubaer", password: "123456"}
];

const isValid = (username)=>{ 
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return false if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session?.authorization?.username;

    if(!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in to post a review." });
    }

    if(!review) {
        return res.status(400).json({ message: "Review cannot be empty!" });
    }

    if(!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    books[isbn].reviews[username] = review;

    res.json({
        message: "Review added/updated successfully!",
        reviews: books[isbn].reviews
    });
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if(!username) {
        return res.status(401).json({ message: "Unauthorized. Please log in to post a review." });
    }

    if(!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    res.json({
        message: "Review deleted successfully!",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

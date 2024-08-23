const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    try {
        const userExists = await new Promise((resolve) => {
            resolve(isValid(username));
        });

        if (userExists) {
            return res.status(409).json({ message: "Username already exists" });
        }

        users.push({ username, password });
        return res.status(200).json({ message: "User successfully registered" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const bookList = await new Promise((resolve) => {
            resolve(books);
        });
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
        const book = await new Promise((resolve) => {
            resolve(books[isbn]);
        });

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    
    try {
        const booksByAuthor = await new Promise((resolve) => {
            resolve(Object.values(books).filter(book => book.author === author));
        });

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    
    try {
        const booksByTitle = await new Promise((resolve) => {
            resolve(Object.values(books).filter(book => book.title === title));
        });

        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

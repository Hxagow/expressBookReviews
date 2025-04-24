const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Vérification des champs requis
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Vérification si l'utilisateur existe déjà
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Ajout du nouvel utilisateur
  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(JSON.stringify(books[isbn]));
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => 
    book.author.toLowerCase() === author.toLowerCase()
  );
  
  if (booksByAuthor.length > 0) {
    return res.json(JSON.stringify(booksByAuthor));
  } else {
    return res.status(404).json({message: `No books found for author ${author}`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => 
    book.title.toLowerCase() === title.toLowerCase()
  );
  
  if (booksByTitle.length > 0) {
    return res.json(JSON.stringify(booksByTitle));
  } else {
    return res.status(404).json({message: `No books found with title ${title}`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(JSON.stringify(books[isbn].reviews));
  } else {
    return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

module.exports.general = public_users;

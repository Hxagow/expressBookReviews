const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Vérification des champs requis
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Vérification de l'authentification
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid credentials"});
  }

  // Génération du token JWT
  const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
  
  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ajouter ou mettre à jour la critique
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn]
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Vérifier si le livre existe
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Vérifier si l'utilisateur a une critique pour ce livre
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "You haven't reviewed this book yet" });
  }

  // Supprimer la critique
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

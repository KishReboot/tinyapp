// User and URL objects
const bcrypt = require('bcryptjs');

const urlDatabase = {

  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "userRandomID2" },

};

const users = {
  userRandomID: {
    
    userID: "userRandomID",
    email: "123@123email.com",
    password: bcrypt.hashSync("123password123", 10),
    
  },

  userRandomID2: {

    userID: "userRandomID2",
    email: "321@321email.com",
    password: bcrypt.hashSync("321password321", 10),

  }

};

module.exports = {urlDatabase, users};
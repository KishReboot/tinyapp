// Server Configurations
const express = require('express');
const app = express();
const PORT = 8080;

const { getUserByEmail, userURLS, generateRandomString } = require('./helpers');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

app.use(cookieSession({ name: 'session', secret: 'paper-mario-sixty-four' }));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};

const users = {


};

// Routes for GETs and POSTs

// Redirects to login if not logged in
app.get('/', (req, res) => {

  const user = req.session.userID;

  if (user) {

    res.redirect('/urls');

  } else {

    res.redirect('/login');

  }

});

// Shows the index page, but will error if URLS don't belong to you
app.get('/urls', (req, res) => {

  const userID = req.session.userID;
  const userURLs = userURLS(userID, urlDatabase);
  const templateVars = { urls: userURLs, user: users[userID] };
  
  if (!userID) {
    
    res.statusCode = 401;

  }
  
  res.render('urls_index', templateVars);

});

// Adds new URL and creates a shortURL then redirects to the shortURL's info page
app.post('/urls', (req, res) => {

  if (req.session.userID) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {

      longURL: req.body.longURL,
      userID: req.session.userID,

    };
  
    res.redirect(`/urls/${shortURL}`);

  } else {

    const errorMsg = "You must be logged in to do that";
    res.status(401).render('urls_error', {user: users[req.session.userID], errorMsg});

  }

});

// Validation of the user logged in, before displaying the page
app.get('/urls/new', (req, res) => {

  if (req.session.userID) {
    
    const templateVars = { user: users[req.session.userID] };
    res.render('urls_new', templateVars);

  } else {

    res.redirect('/login');

  }

});

// Shows shortURL details if belongs to user
app.get('/urls/:id', (req, res) => {
  
  const shortURL = req.params.id;
  const userID = req.session.userID;
  const userURLS = userURLS(userID, urlDatabase);
  const templateVars = { urlDatabase, userURLS, shortURL, user: users[userID] };
  
  if (!urlDatabase[shortURL]) {

    const errorMsg = "This URL does not exist";
    res.status(404).render('urls_error', {user: users[userID], errorMsg});
    
  } else if (!userID || !userURLS[shortURL]) {
    
    const errorMsg = "This does not belong to you.";
    res.status(401).render('urls_error', {user: users[userID], errorMsg});
    
  } else {
  
    res.render('urls_show', templateVars);
  
  }
});

// Edits the original URL
app.post('/urls/:id', (req, res) => {

  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`);

});

// Deletes URL from users list
app.post('/urls/:id/delete', (req, res) => {

  delete urlDatabase[req.params.id];
  res.redirect('/urls');

});

// Redirection to original URLS webpage
app.get('/u/:id', (req, res) => {

  const longURL = urlDatabase[req.params.id].longURL;

  if (longURL) {

    res.redirect(urlDatabase[req.params.shortURL].longURL);

  } else {

    res.statusCode = 404;
    res.send('<h2>404 Not Found<br>This short URL doesn not exist.</h2>');
    
  }

});

// User login page
app.get('/login', (req, res) => {

  if (req.session.userID) {

    res.redirect('/urls');
    return;
  }

  const templateVars = {user: users[req.session.userID]};
  res.render('urls_login', templateVars);

});

// Validates user info and logs in, or errors
app.post('/login', (req, res) => {

  const user = getUserByEmail(req.body.email, users);

  if (user) {

    if (bcrypt.compareSync(req.body.password, user.password)) {

      req.session.userID = user.userID;
      res.redirect('/urls');
    
    } else {

      res.statusCode = 403;
      res.send('<h2>403 Forbidden<br> Wrong password has been entered.</h2>');
    
    }
  
  } else {

    res.statusCode = 403;
    res.send('<h2>403 Forbidden<br> This email is not registered.</h2>');

  }
});

// User logout
app.post('/logout', (req, res) => {

  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/urls');

});

// User registration page
app.get('/register', (req, res) => {

  if (req.session.userID) {

    res.redirect('/urls');
    return;
  }

  const templateVars = { user: users[req.session.userID] };
  res.render('urls_registration', templateVars);

});

// Validates user info and redirects
// Uses uses bcrypt library for helping securely encrypt user information
app.post('/register', (req, res) => {

  if (req.body.email && req.body.password) {
    
    if (!getUserByEmail(req.body.email, users)) {
      
      const userID = generateRandomString();
      
      const password = req.body.password;
      
      
      users[userID] = {

        userID,
        email: req.body.email,
        password: bcrypt.hashSync(password, 10),

      };

      req.session.userID = userID;
 
      res.redirect('/urls');

    } else {
      
      res.statusCode = 400;
      res.send('<h2>400 - Bad Request<br>This email is already registered.</h2>');

    }

  } else {

    res.statusCode = 400;
    res.send('<h2>400 - Bad Request<br>One or more fields have been left blank</h2>');

  }

});

app.listen(PORT, () => {

  console.log(`TinyApp server listening on ${PORT}!`);

});


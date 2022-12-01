const express = require('express');
const app = express();
const PORT = 8080;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const users = {



};

const urlDatabase = {

  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'

};

app.use(express.urlencoded({ extended: true }));

const getUserByEmail = (email) => {

  for (const user in users) {

    if (users[user].email === email) {

      return true;

    }

  }

  return false;
};

// Used to generate a 6 character shortURL
const generateRandomString = () => {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';

  for (let i = 0; i < 6; i++) {

    random += chars[Math.floor(Math.random() * chars.length)];

  }

  return random;

};

// Routes

app.get('/urls.json', (req, res) => {
  
  res.json(urlDatabase);

});

// Index
app.get('/urls', (req, res) => {

  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_ID']] };
  res.render('urls_index', templateVars);

});

// POST to generate a RNG for the shortURL, and adds to the urlDatabase
app.post('/urls', (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

});

// New URL page
app.get('/urls/new', (req, res) => {

  const templateVars = { user: users[req.cookies['user_ID']] };
  res.render('urls_new', templateVars);

});

// My URL page, showing the short and long urls
app.get('/urls/:id', (req, res) => {
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies['user_ID']] };
  res.render('urls_show', templateVars);

});

// Update/Edit POST
app.post('/urls/:id', (req, res) => {

  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`);

});

// Delete POST
app.post('/urls/:id/delete', (req, res) => {

  delete urlDatabase[req.params.id]; 
  res.redirect('/urls');

});

app.get('/u/:id', (req, res) => {

  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);

});

app.get('/login', (req, res) => {

  const templateVars = {user: users[req.cookies['user_ID']]};
  res.render('urls_login', templateVars);

});


app.post('/login', (req, res) => {
  
  res.cookie('username', req.body.username);
  res.redirect('/urls');

});

app.post('/logout', (req, res) => {

  res.clearCookie('user_ID');
  res.redirect('/urls');

});

app.get('/register', (req, res) => {

  const templateVars = { user: users[req.cookies['user_ID']] };
  res.render('urls_registration', templateVars);

});

app.post('/register', (req, res) => {
  
  if (req.body.email || req.body.password) {
    
    if (!getUserByEmail(req.body.email)) {
  
      const userID = generateRandomString();
      users[userID] = {

        userID,
        email: req.body.email,
        password: req.body.password,

      };

      res.cookie('user_ID', userID);
 
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

//Server start
app.listen(PORT, () => {

  console.log(`TinyApp server listening on ${PORT}!`);

});


const express = require("express");
const app = express();
const PORT = 8080;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

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

app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_index", templateVars);

});

app.post('/urls', (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);

});

app.get("/urls/new", (req, res) => {

  let templateVars = {username: req.cookies['username']};
  res.render("urls_new", templateVars);

});

app.post('/urls/:id', (req, res) => {

  const shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`);

});

app.post('/urls/:id/delete', (req, res) => {

  delete urlDatabase[req.params.id];
  res.redirect('/urls');

});

app.get("/u/:id", (req, res) => {

  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);

});

app.get("/urls/:id", (req, res) => {
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies['username'] };
  res.render("urls_show", templateVars);

});


app.get("/urls.json", (req, res) => {
  
  res.json(urlDatabase);

});

app.post('/login', (req, res) => {

  res.cookie('username', req.body.username);
  res.redirect('/urls')

});

app.post('/logout', (req, res) => {

  res.clearCookie('username');
  res.redirect('/urls');

});

app.get('/register', (req, res) => {

  let templateVars = {username: req.cookies['username']};
  res.render('urls_registration', templateVars);

});

//Server start
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


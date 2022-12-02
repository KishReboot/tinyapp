const express = require('express');
const app = express();
const PORT = 8080;

const cookieSession = require('cookie-session');
app.use(cookieSession({ name: 'session', secret: 'paper-mario-sixty-four' }));

const { getUserByEmail } = require('/helpers');

const bcrypt = require('bcryptjs');

app.set('view engine', 'ejs');

const urlDatabase = {};

const users = {};

app.use(express.urlencoded({ extended: true }));



const generateRandomString = () => {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';

  for (let i = 0; i < 6; i++) {

    random += chars[Math.floor(Math.random() * chars.length)];

  }

  return random;

};

const userURLS = (id) => {

  let userURLs = {};

  for (const shortURL in urlDatabase) {

    if (urlDatabase[shortURL].userID === id) {

      userURLs[shortURL] = urlDatabase[shortURL];

    }

  }

  return userURLs;
};

app.get('/urls.json', (req, res) => {
  
  res.json(urlDatabase);

});

app.get('/urls', (req, res) => {

  const userID = req.session.user_id;
  const userURLs = userURLS(userID);
  const templateVars = { urls: userURLs, user: users[userID] };
  res.render('urls_index', templateVars);

});

app.post('/urls', (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {

    longURL: req.body.longURL,
    userID: req.session.user_id,

  };
  
  res.redirect(`/urls/${shortURL}`);

});


app.get('/urls/new', (req, res) => {

  if (req.session.user_id) {
    
    const templateVars = { user: users[req.session.user_id] };
    res.render('urls_new', templateVars);

  } else {

    res.redirect('/login');

  }

});

app.get('/urls/:id', (req, res) => {
  
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id] };
  res.render('urls_show', templateVars);

});

app.post('/urls/:id', (req, res) => {

  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.updatedURL;
  res.redirect(`/urls/${shortURL}`);

});

app.post('/urls/:id/delete', (req, res) => {

  delete urlDatabase[req.params.id];
  res.redirect('/urls');

});

app.get('/u/:id', (req, res) => {

  const longURL = urlDatabase[req.params.id].longURL;

  if (longURL) {

    res.redirect(urlDatabase[req.params.shortURL].longURL);

  } else {

    res.statusCode = 404;
    res.send('<h2>404 Not Found<br>This short URL doesn not exist.</h2>');
    
  }

});

app.get('/login', (req, res) => {

  const templateVars = {user: users[req.session.user_id]};
  res.render('urls_login', templateVars);

});

app.post('/login', (req, res) => {

  const user = getUserByEmail(req.body.email, users);
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.userID;
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

app.post('/logout', (req, res) => {

  res.clearCookie('session');
  res.clearCookie('session.sig')
  res.redirect('/urls');

});

app.get('/register', (req, res) => {

  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_registration', templateVars);

});

app.post('/register', (req, res) => {
  
  if (req.body.email || req.body.password) {
    
    if (!getUserByEmail(req.body.email, users)) {
  
      const userID = generateRandomString();
      users[userID] = {

        userID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),

      };

      req.session.user_id = userID;
 
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


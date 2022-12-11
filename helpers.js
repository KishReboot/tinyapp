const getUserByEmail = (email, database) => {

  for (const user in database) {

    if (database[user].email === email) {

      return database[user];

    }

  }

  return undefined;

};

const userURLS = (id, database) => {

  let userURLs = {};

  for (const shortURL in database) {

    if (database[shortURL].userID === id) {

      userURLs[shortURL] = database[shortURL];

    }

  }

  return userURLs;
  
};

const generateRandomString = () => {

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let random = '';

  for (let i = 0; i < 6; i++) {

    random += chars[Math.floor(Math.random() * chars.length)];

  }

  return random;

};


module.exports = { getUserByEmail, generateRandomString, userURLS };
const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {

  "userRandomID": {
    
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"

  },

  "user2RandomID": {
    
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"

  }

};

describe('getUserByEmail', function() {
  
  it('should return a user with valid email', function() {
    
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user, testUsers.user2RandomID);

  });

  it('should return undefined when the users email is non-existant', () =>{
    
    const user = getUserByEmail('noemail@noemail.com', testUsers);
    assert.equal(user, undefined);

  });
  
});
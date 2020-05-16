process.env.NODE_ENV = 'test';

const Users = require('../models/Users');
const Freets = require('../models/Freets');

let app = require("../app.js");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

var request = require('supertest');

chai.use(chaiHttp);

const SIGN_IN_ERROR_MSG = "Please sign in first.";

describe('Users', () => {

  before(function() {
    Users.reset();
    global.user1 = { username : "Bob", password : "123"};
    global.user2 = { username : "Alice", password : "456" };
    global.newUsername1 = "Bobby";
    global.newPassword1 = "newpass";
    global.authenticatedUser = request.agent(app);
  });


  it('should return 404 when signing in with uncreated username', (done) => {
    chai.request(app)
      .post('/users/signin')
      .send( user1 )
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should successfully create an account', (done) => {
    chai.request(app)
      .post('/users')
      .send(user1)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('username').eql(`${ user1.username }`);
        res.body.should.have.property('password').eql(`${ user1.password }`);
        done();
      });
  });

  it('should return 409 when creating user and username already exists', (done) => {
    chai.request(app)
      .post('/users')
      .send(user1)
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        done();
      });
  });

  it('should return 401 when deleting without sign in', (done) => {
    authenticatedUser
      .delete(`/users`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
      done();
    });
  });

  it('should return 401 when changing username without sign in', (done) => {
    authenticatedUser
      .put(`/users/username/${ newUsername1 }`)
      .send({ username : newUsername1 , password : user1.password })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return 401 when changing password without sign in', (done) => {
    authenticatedUser
      .put(`/users/password/${ newPassword1 }`)
      .send({ password : newPassword1 })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should successfully sign in if username exists & password correct', (done) => {
    authenticatedUser
      .post('/users/signin')
      .send(user1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('uid').not.eql(undefined);
        done();
      });
  });

  it('should return 401 if username exists & password incorrect', (done) => {
    chai.request(app)
      .post('/users/signin')
      .send( { username : user1.username, password : "789" })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('error');

        done();
      });
  });

  it('should successfully update username when user signed in', (done) => {
    authenticatedUser
      .put(`/users/username/${ newUsername1 }`)
      .send({ username : newUsername1 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('username').eql(newUsername1);
        done();
      });
  });

  it('should successfully update password when user signed in', (done) => {
    authenticatedUser
      .put(`/users/password/${ newPassword1 }`)
      .send({ password : newPassword1 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('password').eql(newPassword1);
        done();
      });
  });

  it ('should successfully delete user when user signed in', (done) => {
    authenticatedUser
      .delete(`/users`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('username').eql(newUsername1);
        res.body.should.have.property('password').eql(newPassword1);
        done();
      });
  });

  it('should successfully sign out', (done) => {
    authenticatedUser
      .post('/users/signout')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });

  // TODO: assert can't do things after sign out

});

// * follow
//   - return error when user tries to follow self
//   - user can follow another user
//   - return ? when user tries to follow user already followed
//   - return error when username does not exist

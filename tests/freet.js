// TODO: test cases not complete
process.env.NODE_ENV = 'test';
const Users = require('../models/Users');
const Freets = require('../models/Freets');

let app = require("../app.js");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

var request = require('supertest');


chai.use(chaiHttp);



describe('Freets', () => {



  // spoof some users
  before(function() {
    global.user1 = { username : "Bob", password : "123"};
    global.user2 = { username : "Alice", password : "456" };

    Users.createUser(user1.username, user1.password);
    Users.createUser(user2.username, user2.password);

    global.authenticatedUser = request.agent(app);
  });

  // empty the Freet database
  afterEach((done) => {
    Freets.reset();
    Users.clearFreets();
    done();
  });



  /*
   * Test /GET
   */

  describe('/GET/freets', () => {
    it('should get all freets', (done) => {
      chai.request(app)
        .get('/freets')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
        done();
      });
    });
  });

  describe('/GET/freets/author/:author', () => {
    it ('should get all freets by author if author exists', (done) => {
      let authorUid = Users.findUid(user1.username);
      let f1 = Freets.createFreet(authorUid, "Hello from Bob.");
      let f2 = Freets.createFreet(authorUid, "Bob says.");
      // add to user's freetIds
      Users.createFreet(authorUid, f1.id);
      Users.createFreet(authorUid, f2.id);

      chai.request(app)
        .get(`/freets/author/${user1.username}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
        done();
        });
    });

    it ('should return empty list if author has no freets', (done) => {
      chai.request(app)
        .get(`/freets/author/${user1.username}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
        done();
        });
    });

    it ('should return 404 if author does NOT exist', (done) => {
      chai.request(app)
        .get('/freets/author/Eve')
        .end((err, res) => {
          res.should.have.status(404);
        done();
        });
    });
  });

  /*
   * Test /POST
   */
   describe ('/POST/freets' , () => {

     before(function(done) {
       // authenticatedUser = request.agent(app);
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     after(function(done) { // sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should successfully create Freet if user is signed in', (done) => {
       authenticatedUser.post('/freets')
       .send({ content: "Bob wants to create freet" })
       .end((err, res) => {
         res.should.have.status(201);
         res.body.should.be.a('object');
         res.body.should.have.property('content').eql('Bob wants to create freet');
         done();
       });
     });
   });

   describe ('/POST/freets' , () => {
     it ('should return 401 if user is NOT signed in', (done) => {
       request.agent(app).post('/freets')
       .send({ content: "Bob wants to create freet" })
       .end((err, res) => {
         res.should.have.status(401);
         done();
       });
     });
   });




   /**
   * Test /PUT
   */
   // describe ('/PUT/freets/:id' , () => {
   //   it ('should return 401 if user is NOT signed in', (done) => {
   //     authenticatedUser
   //      .post(`/freets/10`)
   //      .send({ content: "anon wants to edit freet" })
   //      .end((err, res) => {
   //        res.should.have.status(401);
   //        done();
   //      });
   //   });
   // });



   describe ('/PUT/freets/:id' , () => {

     before(function(done) { // sign in Bob
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     before(function(done) { // Bob create freet
       authenticatedUser.post('/freets').send({ content: "Bob wants to create freet" }).end((err, res) => {
         res.should.have.status(201);
         freetId = res.body.id;
         done();
       });
     });

     after(function(done) { // Bob sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should edit freet successfully if user is signed in & is author', (done) => {
       authenticatedUser.put(`/freets/${freetId}`)
       .send({ content: "Bob wants to edit freet" })
       .end((err, res) => {
         res.should.have.status(200);
         res.body.should.have.property('content').eql('Bob wants to edit freet');
         done();
       });
     });
   });

   describe ('/PUT/freets/:id' , () => {
     // authenticatedUser = request.agent(aspp);

     before(function(done) { // sign in
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     after(function(done) { // sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should return 404 if user is signed in and freet does NOT exist', (done) => {
       authenticatedUser.put(`/freets/0`)
       .send({ content: "Bob wants to edit freet" })
       .end((err, res) => {
         res.should.have.status(404);
         done();
       });
     });
   });


   describe ('/PUT/freets/:id' , () => {
     // var authenticatedUser
     var freetId;

     before(function(done) { // sign in as Bob
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });


     before(function() { // create Freet as Alice
       let authorUid = Users.findUid(user2.username);
       let f = Freets.createFreet(authorUid, "Hello from Alice.");
       freetId = f.id;
       Users.createFreet(authorUid, f.id);
     });

     after(function(done) { // sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should return 401 if user is NOT author', (done) => {
       authenticatedUser.put(`/freets/${freetId}`)
       .send({ content: "Bob wants to edit Alice's freet" })
       .end((err, res) => {
         res.should.have.status(401);
         done();
       });
     });
   });




   /**
   * Test /DELETE
   */
   describe ('/DELETE/freets/:id' , () => {
     it ('should return 401 if user is NOT signed in', (done) => {
       chai.request(app)
        .delete(`/freets/0`)
        .send({ id : 0 })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
     });
   });

   describe ('/PUT/freets/:id' , () => {

     before(function(done) { // sign in Bob
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     before(function(done) { // Bob create freet
       authenticatedUser.post('/freets').send({ content: "Bob wants to create freet" }).end((err, res) => {
         res.should.have.status(201);
         freetId = res.body.id;
         done();
       });
     });

     after(function(done) { // Bob sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should DELETE freet successfully if user is signed in & is author', (done) => {
       authenticatedUser.delete(`/freets/${freetId}`)
       .send( { id : freetId })
       .end((err, res) => {
         res.should.have.status(200);
         res.body.should.have.property('id').eql(freetId);
         done();
       });
     });
   });

   describe ('/PUT/freets/:id' , () => {
     before(function(done) { // sign in
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     after(function(done) { // sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should return 404 if user is signed in and freet does NOT exist', (done) => {
       authenticatedUser.delete(`/freets/0`)
       .send({ id : 0 })
       .end((err, res) => {
         res.should.have.status(404);
         done();
       });
     });
   });

   describe ('/PUT/freets/:id' , () => {
     // var authenticatedUser
     var freetId;

     before(function(done) { // sign in as Bob
       authenticatedUser.post('/users/signin').send(user1).end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });


     before(function() { // create Freet as Alice
       let authorUid = Users.findUid(user2.username);
       let f = Freets.createFreet(authorUid, "Hello from Alice.");
       freetId = f.id;
       Users.createFreet(authorUid, f.id);
     });

     after(function(done) { // sign out
       authenticatedUser.post('/users/signout').end((err, res) => {
         res.should.have.status(200);
         done();
       });
     });

     it ('should return 401 if user is NOT author', (done) => {
       authenticatedUser.delete(`/freets/${freetId}`)
       .send({ id : freetId })
       .end((err, res) => {
         res.should.have.status(401);
         done();
       });
     });
   });
});


// * upvote
//   - user can give one upvote to a post
//   - return error when user tries to give >1 upvote
//   - user can undo upvote
//   - user can upvote again after undo
//   - return error when fid does not exist

// * refreet
//    - user can refreet another author's freet
//    - return ? when user tries to refreet a freet already in user.freets
//     - own freet
//     - already refreeted freet
//   - author deletes freet -> refreets should disappear
//   - author edits freet -> refreets should reflect this
//   - return error if fid does not exist

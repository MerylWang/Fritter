const express = require('express');

const Users = require('../models/Users');
const Freets = require('../models/Freets');

const router = express.Router();

// --------------- USER BASICS -------------------- //

/**
* Create a new user
* @name POST/users
* @param {string} username - username of new user
* @param {string} password - password of new user
* @return {User} - the created user
* @throws {409} - if username if already taken
*/
router.post('/', (req, res) => {
  if (Users.findUser(req.body.username) === undefined) { // username not taken
    const user = Users.createUser(req.body.username, req.body.password);
    res.status(201).json(user).end();
  } else {
    res.status(409).json({
      error : `Username ${req.body.username} is already taken.`,
    }).end();
  }
});

/**
 * Signs in existing user
 * @name POST/users/signin
 * @param {string} username - username of existing user
 * @param {string} password - password of existing user
 * @return {json} - session started for user
 * @throws {404} - User with username does not exist
 * @throws {401} - User password is incorrect
 */
router.post('/signin', (req, res) => {
  let user = Users.findUser(req.body.username);

  if (user !== undefined) { // user created
    if (Users.checkPassword(user, req.body.password)) { // check password
      // set session to uid because username can change, but uid doesn't.
      let uid = Users.findUid(req.body.username);
      // sign in
      if (req.session.uid !== uid) {
        req.session.uid = uid;
      }
      res.status(200).json(req.session).end();

    } else {
      res.status(401).json({
        error : "Username & password did not match.",
      }).end();
    }

   } else { // user doesn't exist
     res.status(404).json({
       error : `User ${req.body.username} does not exist.`,
     }).end();
   }
});

 /**
  * Signs out signed-in user
  * @name POST/users/signout
  * @return {json} - message
  */
router.post('/signout', (req, res, next) => {

  // if not signed in, do nothing
  if (req.session !== undefined && req.session.uid !== undefined) { // if signed in
    req.session.uid = undefined; // reset session
    // req.session.destroy();
    // res.redirect('/');
  }
  res.status(200).json({
    message : `Signed out successfully.`,
  }).end();
});

 /**
  * Updates username if user is signed in.
  * @name PUT/users/username/:username
  * @param {string} username - new username. Assume nonempty, valid, unique username.
  * @return {User} - updated user
  * @throws {401} - user is not signed in
  * @throws {409} -  username is already taken.
  */
router.put('/username/:username', (req, res) => {
  // TODO: check password is correct
  
  if (req.session !== undefined && req.session.uid !== undefined) { // if signed in
    // check if new username is already taken
    if (Users.findUser(req.body.username) === undefined) {
      const user = Users.updateUsername(req.session.uid, req.params.username);
      res.status(200).json(user).end();
    } else { // if username taken
      res.status(409).json({
        error : `Username ${req.params.username} is already taken.`,
      }).end();
    }
  } else { // not signed in
    // TODO: handle this with middleware
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }
});

/**
 * Updates password if user is signed in.
 * Assume password is nonempty & valid.
 * @name PUT/users/password/:password
 * @param {string} password - new password
 * @return {object} - updated user rendering
 * @throws {401} - user is not signed in
 */
router.put('/password/:password', (req, res) => {
  if (req.session !== undefined && req.session.uid !== undefined) { // if signed in
    const user = Users.updatePassword(req.session.uid, req.params.password);
    res.status(200).json(user).end();
  } else { // not signed in
    // TODO: handle this with middleware
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }
});

 /**
  * DELETEs user if user is signed in.
  * @name DELETE/users
  * @return {User} - deleted user
  * @throws {401} - user is not logged in
  */
router.delete('/', (req, res) => {
  if (req.session !== undefined && req.session.uid !== undefined) { // if signed in
    const user = Users.deleteUser(req.session.uid);
    res.status(200).json(user).end();
  } else {
    // TODO handle this with middleware
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }
});

// --------------- END USER BASICS -------------------- //

// --------------- FOLLOWING -------------------- //
/**
 * Lets user follow another user. Requires user sign in.
 * @name POST/users/follow
 * @param {string} username - username of user to follow
 * @return {object} - this user rendering
 * @throws {409} - if this user is already following given user
 * @throws {404} - if given user does not exist
 * @throws {401} - this user is not signed in
 */
router.post('/follow', (req, res) => { // u1 -> u2. u1 follows u2.
  const username2 = req.body.username;

  const uid1 = req.session.uid;
  const uid2 = Users.findUid(username2);

  if (req.session !== undefined && uid1 !== undefined) { // u1 signed in.
    if (uid2 !== undefined) { // u2 exists

      if (!Users.isFollowing(uid1, uid2)) { // u1 is not already following u2
        const u1 = Users.followUser(uid1, uid2);
        res.status(200).json(u1).end();

      } else { // u2 already followed
        res.status(409).json({
          error : `You are already following User ${username2}`,
        }).end();
      }

    } else { // u2 does not exist
      res.status(404).json({
        error : `User ${username2} does not exist.`,
      }).end();
    }

  } else {
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }

});

/**
 * Lets user 1 unfollow user 2. Requires sign in by user 1. Requres user 1 currently following user 2.
 * @name POST/users/follow/undo
 * @param {string} username - username of user 2.
 * @return {object} - rendering user 1 after unfollowing user 2.
 * @throws {400} - user 1 is NOT following user 2.
 * @throws {404} - if user 2 does not exist.
 * @throws {401} - user 1 is not signed in
 */
router.post('/follow/undo', (req, res) => { // u1 -> u2. u1 unfollows u2.
  const username2 = req.body.username;

  const uid1 = req.session.uid;
  const uid2 = Users.findUid(username2);

  if (req.session !== undefined && uid1 !== undefined) { // u1 signed in.
    if (uid2 !== undefined) { // u2 exists

      if (Users.isFollowing(uid1, uid2)) { // u1 is following u2.
        const u1 = Users.unfollowUser(uid1, uid2);

        res.status(200).json(u1).end();
      } else { // u1 is NOT following u2
        res.status(400).json({
          error : `You are NOT following User ${username2}`,
        }).end();
      }
    } else { // u2 does not exist
      res.status(404).json({
        error : `User ${username2} does not exist.`,
      }).end();
    }
  } else {
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }
});

/**
 * View user's feed (freets by followed users). Requires user sign in.
 * @name GET/users/follow/feed
 * @return {array} - array of freets.
 * @throws {401} - this user is not signed in
 */
router.get('/follow/feed', (req, res) => { // u1 -> u2. u1 follows u2.
  const uid = req.session.uid;
  if (req.session !== undefined && uid !== undefined) { // u1 signed in.
    let feed = [];
    const userData = Users.getUserByUid(uid);

    userData.follows.forEach(function(uid2){
      Users.getFreetIds(uid2).forEach(function(fid){
        feed.push(Freets.renderFreet(fid));
      });
    });

    res.status(200).json(feed).end();
  } else {
    res.status(401).json({
      error : "Please sign in first."
    }).end();
  }
});

// --------------- END FOLLOWING -------------------- //

// --------------- REFREETING -------------------- //
/**
  * Refreets freet. Requires user sign in.
  * @name POST/freets/refreet
  * @param {int} id - freet id
  * @return {object} - freet
  * @throws {401} - if user not signed in
  * @throws {404} - if id not found
*/
router.post('/refreet', (req, res) => {
  let uid = req.session.uid;
  let fid = parseInt(req.body.id);

  if (req.session !== undefined && uid !== undefined) { // signed in
    if (Freets.getFreet(fid) !== undefined) { // if freet exists

      if (!Users.getFreetIds(uid).includes(fid)) { // freet not created or already refreeted by user
        // add fid to user.freetIds
        const u = Users.refreet(uid, fid);
        // add uid to freet.refreeters
        Freets.addRefreeter(uid, fid); // TODO
        res.status(200).json(u).end();

      } else {
        res.status(409).json({
          error : `Freet ${fid} is already in your freets.`
        });
      }
    } else { // fid does not exist
      res.status(404).json({
        error : `Freet ${fid} not found.`
      });
    }
  } else { // not signed in
    res.status(401).json({
      error : "Please sign in first.",
    }).end();
  }
});

/**
 * Gets user's own freets (authored + refreeted). Requires sign in.
 * @name GET/users/refreet
 * @return {array} - array of freets.
 * @throws {401} - not signed in
 */
 router.get('/refreet', (req, res) => {
   let uid = req.session.uid;

   if (req.session !== undefined && uid !== undefined) { // signed in

     let wall = [];

     Users.getFreetIds(uid).forEach(function(fid){
       wall.push(Freets.renderFreet(fid));
     });

     res.status(200).json(wall).end();


   } else { //  not signed in
     res.status(401).json({
       error : "Please sign in first.",
     }).end();
   }

 });
// --------------- END REFREETING -------------------- //


module.exports = router;

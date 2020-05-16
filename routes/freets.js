const express = require('express');

const Users = require('../models/Users');
const Freets = require('../models/Freets');

const router = express.Router();

// --------------- FREET BASICS -------------------- //

/**
  * View All Freets. Does not require log in.
  * @name GET/freets
  * @return {array} - list of Freets. Empty list if no freets.
*/
router.get('/', (req, res) => {
 res.status(200).json(Freets.getAll()).end();
});

/**
  * View all freets by author. Does not require sign in.
  * @name GET/freets/author/:author
  * @param {string} author - username of author of freets
  * @return {array} - list of freets by author. Empty list if no freets.
  * @throws {404} - if author with username does not exist
*/
router.get('/author/:author', (req, res) => {
  let authorUid = Users.findUid(req.params.author);

  if (authorUid !== undefined) { // author exists

    let freetIds = Users.getFreetIds(authorUid);
    let freets = freetIds.map( freetId => Freets.renderFreet(freetId));
    res.status(200).json(freets).end();

  } else {
    // TODO: handle with middleware
    res.status(404).json({
      error : `User ${req.body.username} does not exist.`,
    }).end();
  }
});

  /**
   * Create freet. Requires sign in by user.
   * @name POST/freets
   * @param {string} content - content of freet
   * @return {object} - created Freet & freetId
   * @throws {401} - if user not signed in
   */
router.post('/', (req, res) => {

  if (req.session !== undefined && req.session.uid !== undefined) { // signed in
    const freet = Freets.createFreet(req.session.uid, req.body.content); // {id : id, author: uid, content:content}
    Users.createFreet(req.session.uid, freet.id);
    res.status(201).json(freet).end();
  } else {
    res.status(401).json({
      error : "Please sign in first.",
    }).end();
  }
});

/**
  * Edits freet given id. Requires sign in by author.
  * @name PUT/freets/:id
  * @param {int} id - freet id
  * @param {string} content - new content for freet
  * @return {object} - updated Freet
  * @throws {401} - if author not signed in
  * @throws {404} - if freet with id does not exist
*/
router.put('/:id', (req, res) => {
  const freetId = parseInt(req.params.id); // string -> number
  if (req.session !== undefined && req.session.uid !== undefined) { // user is signed in

    if (Freets.getFreet(freetId) !== undefined) { // freet exists

      if (Users.getFreetIds(req.session.uid).includes(freetId)) { // user is author of freet

        const freet = Freets.editFreet(freetId, req.body.content); // {id : id, author : uid, content : content}
        res.status(200).json(freet).end();

      } else { // user is not author of freet
        res.status(401).json({
          error : "Only the author of a freet can edit it."
        });
      }

    } else { // freet does not exist
      res.status(404).json({
        error : `Freet ${freetId} not found.`
      });
    }
  } else { // user is not signed in
    res.status(401).json({
      error : "Please sign in first.",
    }).end();
  }
});

/**
 * DELETEs freet given id. Requires sign in by author.
 * @name DELETE/freets/:id
 * @param {int} id - freet id
 * @return {object} - deleted Freet
 * @throws {401} - if author not signed in
 * @throws {404} - if freet with id does not exist
 */
 router.delete('/:id', (req, res) => {
   const uid = req.session.uid;
   const fid = parseInt(req.params.id);

   if (req.session !== undefined && uid !== undefined) { // signed in
     if (Freets.getFreet(fid) !== undefined) { // if freet exists
       console.log("fid: ", fid);
       if (Users.getFreetIds(uid).includes(fid)) { // if freet is by user

         Users.deleteFreet(uid, fid); // remove freet ref from author data

         // remove freet ref from refreeters data
         const refreeterIds = Freets.getRefreeters(fid); // Set of uids
         refreeterIds.forEach(function(rid){
           Users.deleteFreet(rid, fid);
         });

         // order matters
         const freet = Freets.deleteFreet(fid); // remove freet data
         res.status(200).json(freet).end();

       } else { // freet is not by user
         res.status(401).json({
           error : "Only the author of a freet can delete it."
         });
       }
     } else { // freet does not exist
       res.status(404).json({
         error : `Freet ${freetId} not found.`
       });
     }
   } else {
     // TODO: handle with middleware
     res.status(401).json({
       error : "Please sign in first.",
     }).end();
   }
 });
 // --------------- END FREET BASICS -------------------- //


 // --------- UPVOTING ------------- //

/**
* Upvotes freet. Requires user sign in.
  * @name POST/freets/upvote
  * @param {int} id - freet id
  * @return {object} - freet
  * @throws {401} - if user not signed in
  * @throws {404} - if id not found
  * @throws {409} - if freet has already been upvoted
*/
router.post('/upvote', (req, res) => {
  let fid = parseInt(req.body.id);
  let uid = req.session.uid;

  if (req.session !== undefined && uid !== undefined) { // signed in
    if (Freets.getFreet(fid) !== undefined) { // if freet exists
      if (!Freets.hasUpvoted(uid, fid)) {
        const freet = Freets.upvoteFreet(uid, fid);
        res.status(200).json(freet).end();
      } else { // repeated upvote
        res.status(409).json({
          error : `You have already upvoted Freet ${fid}.`
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
 * Undo Upvote freet. Requires user sign in.
 * @name POST/freets/upvote/undo
 * @param {int} id - freet id
 * @return {object} - render freet
 * @throws {401} - if user not signed in
 * @throws {404} - if id not found
 */
 router.post('/upvote/undo', (req, res) => {
   let fid = parseInt(req.body.id);
   let uid = req.session.uid;

   if (req.session !== undefined && uid !== undefined) { // signed in
     if (Freets.getFreet(fid) !== undefined) { // if freet exists
       if (Freets.hasUpvoted(uid, fid)) { // has been upvoted
         const freet = Freets.undoUpvote(uid, fid);
         res.status(200).json(freet).end();
        } else { // not upvoted
         res.status(400).json({
           error : `You have not upvoted Freet ${fid}.`
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
  * Gets number of vote of a freet. Does NOT require sign in.
  * @name GET/freets/upvote/:id
  * @param {int} id - freet id
  * @return {object} - freet
  * @throws {404} - if id not found
  */
  router.get('/upvote/:id', (req, res) => {
    let fid = parseInt(req.params.id);

    if (Freets.getFreet(fid) !== undefined) { // if freet exists
      const f = Freets.countUpvotes(fid);
      res.status(200).json(f).end();
    } else { // freet does not exist
        res.status(404).json({
          error : `Freet ${fid} not found.`
        });
    }
  });

  // --------- END UPVOTING ------------- //

module.exports = router;

const Users = require('./Users'); // TODO: avoid having dependencies on other models

let freetsData = {}; // maps unique id to Freet
let fidCounter = 0; // increments at each freet creation

/**
 * @typedef Freet
 * @prop {int} author     - uid of author. (uid is more consistent than username)
 * @prop {string} content - content of freet
 * @prop {Set} votes      - set of uids of users who upvoted this freet
 * @prop {Set} refreeters - set of uids of users who refreeted this freet
 */

 /**
  * @class Freets
  * Stores all Freets
  * @prop id - does not change & is unique for each freet
  */
  class Freets {
    /**
      * Creates a freet. Assumes creator is signed in.
      * @param {int} uid - uid of creator
      * @param {string} content - content of freet
      * @return {object} - render created freet
    */
    static createFreet(uid, content) {
      const fid = fidCounter;
      fidCounter++;

      const freet = { author     : uid, // store user as uid which does not change
                      content    : content,
                      votes      : new Set(),
                      refreeters : new Set()
                    };

      freetsData[fid] = freet;
      return Freets.renderFreet(fid);
    }

    /**
     * Processes a Freet for rendering. Helper function.
     * @param {int} fid - freet id
     * @return {object} - { id : fid, author : username, content : string, votes : int, refreeters, int }
     */
    static renderFreet(fid) {
      let f = freetsData[fid];
      let result = {
        id : fid,                                  // needed by user for Freet actions
        author : Users.getUsernameByUid(f.author), // uid -> username
        content : f.content,
        votes : f.votes.size,                      // number of upvotes
        refreets : f.refreeters.size               // number of refreets
      }
      return result;
     }

    /**
     * Get all freets. For rendering.
     * @return {array} - array of Freets
     */
    static getAll() {
      console.log('freetsdata: ', freetsData);
      let all = [];
      for (let [fid, freet] of Object.entries(freetsData)) {
        all.push(Freets.renderFreet(fid));
      }
      return all;
    }

    /**
     * Get Freet if freet exists. Get Freet Data. Do NOT render.
     * @param {int} fid - id of freet.
     * @return {object | undefined} - freet if exists.
     */
    static getFreet(fid) {
      if (freetsData[fid] !== undefined) {
        return freetsData[fid];
      } else { // freet does not exist
        return undefined;
      }
    }

    /**
     * Delete a freet, given fid.
     * @param {int} fid - freet id
     * @return {object} - rendering of deleted freet.
     */
    static deleteFreet(fid) {
      let freet = Freets.renderFreet(fid);
      delete freetsData[fid];
      return freet;
    }

    /**
      * Edit a freet.
      * @param {int} fid - freet id
      * @param {string} content - new content for freet
      * @return {object} - render edited freet
      */
    static editFreet(fid, content) {
      freetsData[fid].content = content;
      return Freets.renderFreet(fid);
    }

    // --------------- UPVOTING -------------------- //

    /**
       * Upvote a freet. Assume canUpvote true.
       * @param {int} fid - freet id
       * @param {int} uid - user id
       * @return {object} - render upvoted freet.
       */
    static upvoteFreet(uid, fid) {
      freetsData[fid].votes.add(uid);
      return Freets.renderFreet(fid);
    }

    /**
       * CHeck if user already upvoted freet. Helper function.
       * @param {int} fid - freet id
       * @param {int} uid - user id
       * @return {boolean} - true if user has already upvoted freet.
       */
    static hasUpvoted(uid, fid) {
      return freetsData[fid].votes.has(uid);
    }

    /**
      * Undo upvote for a freet. Assume canUpvote false.
      * @param {int} fid - freet id
      * @param {int} uid - user id
      * @return {object} - render un-upvoted freet.
      */
    static undoUpvote(uid, fid) {
      freetsData[fid].votes.delete(uid);
      return Freets.renderFreet(fid);
    }

    /**
        * Gets number of upvotes for a freet. Assume freet exists.
        * @param {int} fid - freet id
        * @return {object} - render freet.
        */
    static countUpvotes(fid) {
      return Freets.renderFreet(fid);
    }

    // --------------- END UPVOTING -------------------- //

    // --------------- REFREETING -------------------- //
    /** Adds user to freet's refreeters. */
    static addRefreeter(uid, fid) {
      freetsData[fid].refreeters.add(uid);
    }

    /** Gets uids of users who refreeted freet of given fid. */
    static getRefreeters(fid) {
      console.log('freets data: ', freetsData);
      return freetsData[fid].refreeters;
    }
    // --------------- END REFREETING -------------------- //

    // --------------- HELPER FUNCTIONS FOR TESTING -------------------- //

     /** Resets Database */
     static reset() {
       freetsData = {};
       fidCounter = 0;
     }
  }

  module.exports = Freets;

let usersData = {}; //maps unique uid to User instance
let uidCounter = 0; // increments at each user creation

/**
 * @typedef User
 * @prop {string} username - valid in a URL path; unique for each user
 * @prop {string} password - some string
 * @prop {array}  freetIds - list of ids of freets created / refreeted by user. Use array (as opposed to Set) for order.
 * @prop {Set}    follows  - set of uids of users that this user follows. When rendered, replace with usernames.
*/

/**
 * @class Users
 * Stores all Users
 * @prop uid - does not change & is unique for each user
 */
 class Users {
   // ---------------- MAIN FUNCTIONS FOR USERS ------------- //
   /**
    * Add a User
    * @param {string} username - User username
    * @param {string} password - User password
    * @param {list}   freetIds - User freet ids
    * @return {object} - created user
    */
    static createUser(username, password) {
      const user  = { username : username,
                      password : password,
                      freetIds : [],
                      follows  : new Set()
                    };
      usersData[uidCounter] = user;
      uidCounter++;
      return user;
    }

   /**
    * Updates username.
    * @param {int} uid - uid of user.
    * @param {string} newUsername - new username. Assume nonempty & unique username.
    * @return {User} - updated user
    */
    static updateUsername(uid, newUsername) {
      usersData[uid].username = newUsername;
      return Users.renderUser(uid);
    }

   /**
    * Updates username.
    * @param {int} uid - uid of user.
    * @param {string} newPassword - new password. Assume nonempty & valid password.
    * @return {User} - updated user
    */
    static updatePassword(uid, newPassword) {
      usersData[uid].password = newPassword;
      return Users.renderUser(uid);
    }

   /**
    * Deletes user. Assume user is signed in.
    * @param {int} uid - uid of user to be removed.
    * @return {User} - deleted user instance
    */
    static deleteUser(uid) {
      let u = Users.renderUser(uid);
      delete usersData[uid];
      return u;
    }

    // ---------------- FOLLOWING ------------- //

    /**
     * Checks if user 1 is already following user 2.
     * @param {int} uid1 - user id of user 1. Assume user 1 is signed in.
     * @param {int} uid2 - user id of user 2. Assume user 2 exists.
     * @return {boolean} - true if user 1 is already following user 2. Else false.
     */
    static isFollowing(uid1, uid2) {
      return usersData[uid1].follows.has(uid2);
    }

    /**
     * Set ser 1 to be following user 2. Assumes !isFollowing(uid1, uid2).
     * @param {int} uid1 - user id of user 1. Assume user 1 is signed in.
     * @param {int} uid2 - user id of user 2. Assume user 2 exists.
     * @return {object} - render user 1 after following user 2.
     */
    static followUser(uid1, uid2) {
      usersData[uid1].follows.add(uid2);
      return Users.renderUser(uid1);
    }

    /**
     * user 1 unfollows user2.  Assumes isFollowing(uid1, uid2).
     * @param {int} uid1 - user id of user 1. Assume user 1 is signed in.
     * @param {int} uid2 - user id of user 2. Assume user 2 exists.
     * @return {object} - render user 1 after unfollowing user 2.
     */
    static unfollowUser(uid1, uid2) {
      usersData[uid1].follows.delete(uid2);
      return Users.renderUser(uid1);
    }


    // ---------------- END FOLLOWING ------------- //


   // ---------------- HELPER FUNCTIONS FOR USERS ------------- //
   /**
     * Process a User for rendering.
     * @param {int} uid - user id
     * @return {object} - { username : string, password : string, freetIds : [int], follows : Set(uid) }
     */
   static renderUser(uid) {
     let u = usersData[uid];
     let result = {
       // do not expose uid
       username : u.username,
       password : u.password,
       freetIds : u.freetIds,
       follows  : Array.from(u.follows).map( uid => Users.getUsernameByUid(uid))   // [uid] -> [username]
     }
     return result;
   }

   /**
      * Finds uid of user, if user with username exists.
      * @param {string} username - username of user
      * @return {int | undefined} -  uid
     */
   static findUid(username) {
     for (let [uid, user] of Object.entries(usersData)) {
       if (user.username === username) {
         return uid;
       }
     }
     return undefined;
   }

   /**
      * Finds a user if it exists. Return user data. NOT rendering.
      * @param {string} username - username of User to find
      * @return {object | undefined} - user data
      */
   static findUser(username) {
     let users = Object.values(usersData);
     return users.filter( user => user.username === username)[0];
   }

   /**
    * Gets user data given uid.
    */
   static getUserByUid(uid) {
     return usersData[uid];
   }

   /**
       * Gets username given uid. Helper function.
       * @param {uid} uid - user id
       * @return {string} - username
       */
   static getUsernameByUid(uid) {
     return usersData[uid].username;
   }

   /**
       * Checks password. Assume user with username exists.
       * @param {User} user - User instance
       * @return {boolean} true if password is correct. Else false.
       */
   static checkPassword(user, password) {
     if (user.password === password) {
       return true;
     } else {
       return false;
     }
   }

  // ---------------- HELPER FUNCTIONS FOR FREETS ------------- //

  /**
   * Gets freetIds of user. Assume user exists.
   * Helper function for get_freets_from_author
   * @param {int} uid - uid of user
   * @return {list} - list of freetIds
   */
   static getFreetIds(uid) {
     return usersData[uid].freetIds;
   }

  /**
    * Adds created freet to user.
    * @param {int} uid - uid of creator
    * @param {int} freetId - id of created freet
    */
   static createFreet(uid, freetId) {
     usersData[uid].freetIds.push(freetId);
   }

  /**
    * Deletes freet from user.
    * @param {int} uid - uid of creator
    * @param {int} freetId - id of removed freet
    */
   static deleteFreet(uid, freetId) {
     // remove freet from author
     let freetIds = usersData[uid].freetIds;
     usersData[uid].freetIds = freetIds.filter( id => id !== freetId);
   }

  // ---------------- REFREETING ------------- //
  /**
   * Refreets a freet by another user.
   * @param {int} uid - user id
   * @param {int} fid - freet id of refreeted freet
   * @return {object} - render user
   */
  static refreet(uid, fid) {
    usersData[uid].freetIds.push(fid);
    return Users.renderUser(uid);
  }
  // ---------------- END REFREETING ------------- //

  // ------------- HELPER FUNCTIONS FOR TESTING ------------- //

  /** Clears freets for each user   */
   static clearFreets() {
     for (let [id, user] of Object.entries(usersData)) {
       if (user.freetIds.length > 0) {
         user.freetIds = [];
       }
     }
     return;
   }

   /**  Resets Database  */
   static reset() {
    usersData = {};
    uidCounter = 0;
    return;
  }
}
module.exports = Users;

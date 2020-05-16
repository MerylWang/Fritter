**Author**: Meryl Wang

**installations**:  
npm install express  
npm install express-session
npm install mustache-express

installed nodemon & edited package.json

#### Design choices
* require that usernames be unique ; use username for lookup (so I chose not to implement an user id since username is already unique)

* separation of user creation & user sign in : creating a user simply adds it to the "database" of users; it does not automatically start a session or log in the user. This is to keep the two functions modular.

* At sign-in, set session to uid because username can change, but uid doesn't.

* For methods that require sign-in (change_username, change_password, delete_user, ...), especially those that alter the user information / state, I chose to not put user information in the params of the request url. For example, I almost made the request url for delete_user() to be `/api/users?uid=${uid}`, but that raises a security & design concern: e.g. What should the site do if user 1 requests a url with uid of user2? So I want to avoid exposing the uid to any user. Instead, for these methods, I obtain the uid from `req.session`. So the user never inputs the `uid`. Although they can see their own  `uid` if I choose to put it in any response.

* For view_freet_by_author, I debated  whether `author` should be the username or id of the user who is author. While lookup by username is more intuitive (like in DNS), the username of the author may change. I ended up deciding on username for two reasions : 1) I traded off consistency for intuitiveness and 2) as mentioned above, I had hoped to avoid exposing uids of an user to other users.

* Separation of layers of abstraction: I let routes handle the logic of actions (checking user is signed in, etc) and let the models handle what abstract data types do (create, delete, edit, etc).

* Both Users and Freets have `id` attribute. As mentioned, for `user`, I tried hiding the `uid` from the user, especially from each other. However, for `freet`, I included freet `id` in the response for every action because freet `id` is needed for `edit` and `delete` freets, so the information should be easily accessed.

* One idea was to only display `freet id` only when the user `view freets by author` where `author` is current user. This way, each user can only see ids of their own freets. This would eliminate cases where user 1 tries to `delete` or `edit` a freet created by user 2, since user 1 wouldn't know user 2's freet ids. However, I did not go with this idea but that would seem too much like a hidden function. So the current design is to display all freet ids to all users in `view freets`, `view freets by author`, and in response whenever user `create`, `edit`, `delete` a freet. The user could try to modify another's freet but would receive a 401 unauthorized error.

#### API Design  
API routes & Expected behavior  
(written in psuedocode form for simplicity)

**User**

For activities that require sign in, given that the user CANNOT sign in without an account existing, the logic will be:


    if !user.signed_in:
      error : Please sign in first.
    
    For sign in:
      if !user.exist
        error : User ${username} does not exist


Originally, my logic was  

    if !user.signed_in  
     error : Please sign in first.
    else if !user.exists
      error : User ${username} does not exist.

but I realized that with this design, anyone could discover whether another username, which is not sensitive information but I wanted to avoid exposing user information anyways.

* createUser( fields = { username : username, password : password })  


	request url = '/users'  
	method: POST  
	
	if user.exists  
	    Status Code = 409  
	    res = { error : Username ${username} is already taken }  
	else,  create user  
	    Status Code = 201  
	    res = { username: ${username}, password: ${password} }

* sign_in( fields = { username: username, password : password })  


    request url = /users/signin  
    method: POST
    
    if !user.exists  
        Status Code = 404  
    	res = {error : "User ${username} does not exist.}
    else  
    	if password is correct
          Status Code = 200
          res = { req.session }   
          // contains cookie information
          // set session to uid because username can change, but uid doesn't.
    
         else
         	res = {error : could not sign in}



* sign_out()


    request url = "/users/signout
    method : POST
    
    if !user.signed_in
    	Status Code = 200
        res = { message : "Signed out successfully."}  
    else
    	Status Code = 200
        res = { message : "Signed out successfully." }



* delete_user( fields = {} )  


    request url = /users // not putting uid in path because what if you put someone else's uid? instead, get uid from session.
    method: DELETE
    
    if !user.signed_in
        401  
        res = {Please sign in first.}  
    else, delete user  
        200  
        res = { username : ${username}, password : ${password} }   

* change_username( fields = { username : new_username })  


    request url = /users/username/${username}
    method: PUT
    
    if !user.signed_in
        401
        res = {Please sign in first.}  
    else, update username
        200
        res = { username : new_username, password : password }

* change_password( fields = { password : new_password } )


    request url = "/users/password/${password}
    method : PUT
    
    if !user.signed_in
    	401
        res = {Please sign in first.}  
    else, update password
    	200
        res = {username : username, password : new_password }

**Freet**
* view_all_freets()  

      request_url = "/freets"
      method: GET
      res = [{id : id, content : content, author : author }, {...}]
      // [] if no freets exist


* view_all_freets_by_author({ author: author })  


    request_url = "/freets/author/:author"
    method: GET
    
    if !author.exists
    	404
        { error : "Author ${author} does not exist. }
    else
    	200
        res = [{...}]
        // [] if no freets by author


* create_freet({ content : content })


    request_url = "/freets"
    method : POST
    
    if !user.signed_in4
    	401
    else
    	res = {id : id, content : content, author: author}
      201


* edit_freet({ id : id, content:content })

	    ```
  request_url = "/freets/:id"
  	  method : PUT
     
      if !user.signed_in || !user.is_author
          401
      else if !freet.exist
          404
      else
          200
       ```
     
* delete_freet({ id: id })


    request_url = "/freets/:id"
    method : DELETE
    if !user.signed_in  || !user.is_author
    	401
    else if !freet.exist
    	404
    else
    	200

#### Manual Testing  

User  

- [ x ] create user succesfully
- [ x ] sign in user succesfully
- [ x ] sign out user successfullu
- [ x ] delete user succesfully when signed in
- [ x ] cannot delete user when NOT signed in
- [ x ] change username / password when signed in
- [ x ] cannot change username / password when NOT signed in

Freet   

- [ x ] Successfully View all freets when signed out / signed in
- [ x ] Successfully View all freets from author when signed out / signed in
- [ x ] Successfully create freet when signed in
- [ x ] Successfully edit & delete free when author signed in
- [ x ] Return appropriate error if !signed in or !author


#### Data Types Implementation Design
**Users**  
Users class has fields:  
* usersData: A map of all created user instances. Maps unique uid to each user.
* uidCounter: an int counter that increments at creation of each user to ensure each uid is unique (assuming int is not overflowed).


User data type has fields:
* username: as given by user
* password: as given by user
* freet_ids: list of ids of freets that user has authored. This is to connect the Freet and User instances, and helps the get all freets for the implementation of view_all_freets_by_author(author).  

**Freets**  
Freets class has fields:  
* freetsData: A map that stores all created freets. Maps unique freet_id to each freet.
* freet_id_counter : an integer counter that increments at creation of each freet (assuming few enough freets for no integer overflow).

Freet data type has fields:
* freet_id: unique id for each freet
* content: freet content
* author_id: uid of author of freet

For delete_freet(freet_id), remove freet from both freetsData and from author's freet_ids.

#### Safety
* For sessions, I added some params for cookie to increase session security  
(reference: http://scottksmith.com/blog/2014/09/04/simple-steps-to-secure-your-express-node-application/)
	* session expires after set time (1 hour)
	* httpOnly = true: tells browsers to not allow client side script access to the cookie
	* // secure = true:  tells web browsers to only send this cookie in requests going to HTTPS endpoints. (This intercepts with localhost testing).


* One security concern in my models is that I directly return parts of the "database" in functions (e.g. return `usersData[uid]`). If the user can get their hands on this database, they can access other user's data. One way to avoid this is to never return any part of `usersData` directly, but instead a copy of the part needed (e.g. copy of  `usersData[uid])`. I left my design as is because I thought that the layers of routing & abstraction between the site & the model is enough to prevent an user from accessing the model itself. However this can also be further considered for future reference.


* On the same note, since I return `user` instance directly in my `Users` methods instead of a copy (the safer alternative), `routes/users.js` can access & modify user data directly. This is dangerous because now  `user` data could modified from multiple sources, which would make it hard to track down bugs, as well as enable unintentional modifications through aliasing. So I chose to only modify `user` instances  using `Users` methods ( `getters` and `setters`). For example, in `routes/users.js`, instead of modifying `user` data using  `Users.findUser(username).freet_ids.push(freet_id)`, which is unsafe, I would do `Users.addFreet(username, freetId)`.

#### Concurrency (Multiple Users)  
Sessions will allow the site to handle multiple users. Since each user is assigned a session at login, the site will be able to distinguish active users using session.

Additionally, User data are separated by structure of User data type, where each user is an instance of User. Users will not be able to access each other's information (unless they hack the site).

Other than that, no actualy protection against concurrency issues is taken for this site (data races, etc). Since each user is accessing their own "version" of the site, I think concurrency would rarely cause an issue. However concurrency can certainly be taken into consideration for the future.


#### Social / Ethical Implications
Fritter encourages social activities across all users. The function `View All Freets` is an indicator: Uers are not able to choose who can view their Freets. By default, everyone can view everyone's freets. This may lead to an issue of privacy for the author.  

Similarly, the reader may also wish to filter what they want to read (e.g. Trigger warnings), a functionality that is not provided by Fritter. Albeit the reader is able to filter by author, they may also wish to filter by content & other fields.

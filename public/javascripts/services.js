// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => preParent.classList.remove('flashing'), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  showObject(abridgedResponse);
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE

// EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

/**
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

// Hint: do not assume a 1:1 mapping between forms and routes

// ----------- Fritter Part 1------------------
// ------------ USER BASICS --------------- //
function createUser(fields) { // {username, password}
  axios.post('/users', fields)
    .then(showResponse)
    .catch(showResponse)
}

function changeUsername(fields) { // {username, password}
  axios.put(`/users/username/${fields.username}`, fields)
    .then(showResponse)
    .catch(showResponse)
}

function changePassword(fields) { // {password}
  axios.put(`/users/password/${fields.password}`, fields)
    .then(showResponse)
    .cathc(showResponse)
}

function deleteUser(fields) { // {}
  axios.delete('/users')
    .then(showResponse)
    .catch(showResponse)
}

function signIn(fields) { // {username, password}
  axios.post('/users/signin', fields)
    .then(showResponse)
    .catch(showResponse)
}

function signOut(fields) { // {}
  axios.post('/users/signout')
    .then(showResponse)
    .catch(showResponse)
}

// ------------ FREET BASICS --------------- //

function viewAllFreets(fields) { // {}
  axios.get('/freets')
    .then(showResponse)
    .catch(showResponse)
}

function viewFreetsByAuthor(fields) { // {author}
  axios.get(`/freets/author/${fields.author}`)
    .then(showResponse)
    .catch(showResponse)
}

function createFreet(fields) { // {content}
  axios.post('/freets', fields)
    .then(showResponse)
    .catch(showResponse)
}

function editFreet(fields) { // {id, content}
  axios.put(`/freets/${fields.id}`, fields)
    .then(showResponse)
    .catch(showResponse)
}

function deleteFreet(fields) { // {id}
  axios.delete(`/freets/${fields.id}`)
  .then(showResponse)
  .catch(showResponse)
}
// ----------- END Fritter Part 1------------------

// ----------- Fritter Part 2------------------
// ------------ UPVOTING --------------- //
function upvoteFreet(fields) { // id
  axios.post('/freets/upvote', fields)
    .then(showResponse)
    .catch(showResponse)
}

function undoUpvote(fields) { // id
  axios.post('/freets/upvote/undo', fields)
    .then(showResponse)
    .catch(showResponse)
}

function countUpvote(fields) { // id
  axios.get(`/freets/upvote/${fields.id}`)
    .then(showResponse)
    .catch(showResponse)
}

// ------------ FOLLOWING --------------- //
function followUser(fields) { // username
  axios.post('/users/follow', fields)
    .then(showResponse)
    .catch(showResponse)
}

function unfollowUser(fields) { // username
  axios.post('/users/follow/undo', fields)
    .then(showResponse)
    .catch(showResponse)
}

function viewFeed(fields) {
  axios.get('/users/follow/feed', fields)
    .then(showResponse)
    .catch(showResponse)
}

// ------------ REFREETING --------------- //
function refreet(fields) { // id
  axios.post('/users/refreet', fields)
    .then(showResponse)
    .catch(showResponse)
}

function viewMyWall(fields) {
  axios.get('/users/refreet', fields)
    .then(showResponse)
    .catch(showResponse)
}
// ----------- END Fritter Part 2------------------

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'upvote-freet' : upvoteFreet,
  'undo-upvote' : undoUpvote,
  'count-upvote' : countUpvote,
  'follow-user' : followUser,
  'unfollow-user' : unfollowUser,
  'view-my-feed' : viewFeed,
  'refreet' : refreet,
  'view-my-wall' : viewMyWall
};

// attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {};
      (new FormData(form)).forEach((value, key) => {
        data[key] = value;
      });
      handler(data);
      return false; // don't reload page
    };
  });
}

window.onload = init; // attach handlers once DOM is ready

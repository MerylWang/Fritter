<template>
    <div>

    <!-- LOGIN / SIGN UP modal -->
      <b-modal v-model="loginPopup" id="login-modal" title="Log in / Sign up" hide-footer>
        <b-form @cancel="onCancel" @signin="onSignin" @create="onCreateAccount">
          <b-form-group
            id="input-group-username"
            label="Username:"
            label-for="input-username"
          >
            <b-form-input
              id="input-username"
              v-model="loginForm.username"
              required
              placeholder="Enter username"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-password"
            label="Password:"
            label-for="input-password"
          >
            <b-form-input
              id="input-password"
              v-model="loginForm.password"
              required
              placeholder="Enter password"
            ></b-form-input>
          </b-form-group>
        </b-form>
        <!-- buttons -->
        <b-button variant="outline-secondary" @click="onCancel">Cancel</b-button>
        <b-button variant="outline-info" @click="onSignin">Log In</b-button>
        <b-button variant="info" @click="onCreateAccount">Create Account</b-button>
      </b-modal>

    <!-- Change Username Modal  -->
    <b-modal v-model="changeUsernamePopup" id="change-username-modal" title="Change Username" hide-footer>
      <b-form>
        <b-form-group
            id="input-new-username"
            label="New Username:"
            label-for="new-username"
          >
          <b-form-input
            id="input-new-username"
            v-model="newUsername.username"
            required
            placeholder="Enter new username"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="password"
          label="Current Password:"
          label-for="password"
        >
        <b-form-input
          id="password"
          v-model="newUsername.password"
          required
          placeholder="current password"
        ></b-form-input>
      </b-form-group>
      </b-form>
      <b-button variant="outline-secondary" @click="onCancelChangeUsername">Cancel</b-button>
      <b-button variant="outline-info" @click="onChangeUsername">Change Username</b-button>
    </b-modal>


    <!-- Change Password Modal  -->
    <b-modal v-model="changePasswordPopup" id="change-password-modal" title="Change Password" hide-footer>
      <b-form>
        <b-form-group
          id="new-password"
          label="New Password:"
          label-for="new-password"
        >
          <b-form-input
            id="new-password"
            v-model="newPassword.password"
            required
            placeholder="new password"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <b-button variant="outline-secondary" @click="onCancelChangePassword">Cancel</b-button>
      <b-button variant="outline-info" @click="onChangePassword">Change Password</b-button>
    </b-modal>


    <!-- NAV BAR -->
    <b-navbar class="navbar" toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>
        <router-link :to="{name:'Home'}" 
                      v-bind:isSignedIn="isSignedIn"
                      v-bind:user="user">
        Fritter
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link :to="{name:'ViewAllFreetsPage'}" 
                                    v-bind:isSignedIn="isSignedIn"
                                    v-bind:user="user">
            View All Freets
            </router-link>
          </b-nav-item>

          <!-- search bar -->
          <b-nav-form class="search">
            <b-form-input v-model="author.username" 
                          size="sm" 
                          class="mr-sm-2" 
                          placeholder="Author name">
            </b-form-input>
            
            <b-button @click="onSearchAuthor" size="sm" class="my-2 my-sm-0" variant="info" type="submit">
              <router-link :to="{ name: 'OtherUser', 
                                  params: { author: author, user: user, isSignedIn: isSignedIn } }">
              Search Author</router-link>

            </b-button>

          </b-nav-form>
        </b-navbar-nav>

        <!-- right-aligned -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item v-if="isSignedIn">
            <router-link :to="{name:'Profile'}" 
                              v-bind:isSignedIn="isSignedIn"
                              v-bind:user="user">
            {{ user.username }}
            </router-link>
          </b-nav-item>

          <b-dropdown v-if="isSignedIn" variant="info" id="user-settings" text="User Settings" class="m-md-2">
            <b-dropdown-item @click="onSignOut">Sign out</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="handleChangeUsername" v-b-modal.change-username-modal>Change Username</b-dropdown-item>
            <b-dropdown-item @click="handleChangePassword" v-b-modal.change-password-modal>Change Password</b-dropdown-item>
          </b-dropdown>
          <b-button v-else variant="info" @click="handleSignIn" v-b-modal.login-modal>Sign In</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  import axios from "axios";
  import { eventBus } from "../main";

  export default {
    name: "NavComponents",

    components: {
      // TODO: import components
    },

    props : {
      isSignedIn : Boolean, 
      user : Object, 
    },

    data() {
      return {
        loginPopup : false, 
        changeUsernamePopup : false,
        changePasswordPopup : false, 
        loginForm: {
          username: '',
          password: '',
        },
        newUsername : { 
          username : '',
          password : ''
        },
        newPassword : {
          password : ''
        },
        errors : [], 
        author : {
          username : '',
        },
      };
    },

    created: function() {

    },

    methods: {
      onSearchAuthor() {
        console.log('author: ', this.author.username);
      },

      handleSignIn () {
        this.loginPopup = true;
      },

      handleChangeUsername () {
        this.changeUsernamePopup = true;
      },

      handleChangePassword () {
        this.changePasswordPopup = true;
      },

      onCreateAccount(evt) {
        evt.preventDefault();
        const bodyContent = { username: this.loginForm.username, password: this.loginForm.password };

        axios.post("/users", bodyContent)
          .then(() => {
            // handle success
            // this.loginPopup = false;
          })
          .catch(err => {
            // handle error
            this.errors.push(err);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
      },

      onSignin(evt) {
        evt.preventDefault();
        const bodyContent = { username: this.loginForm.username, password: this.loginForm.password };
        
        axios.post("/users/signin", bodyContent, { withCredentials: true })
          .then((res) => {
            // handle success
            this.user.username = this.loginForm.username;
            this.user.uid = res.data.uid;

            this.isSignedIn = true;
            this.loginPopup = false;
            this.$session.start();

            eventBus.$emit('signin-success', true);
            eventBus.$emit('current-user', this.user);
          })
          .catch(err => {
            // handle error
            this.errors.push(err);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
      },

      onSignOut(evt) {
        // console.log('signout');
        evt.preventDefault();
        const bodyContent = {};
        
        axios.post("/users/signout", bodyContent)
          .then((res) => {
            // handle success
            eventBus.$emit('signout-success', true);
            this.isSignedIn = false;
            this.user.username = "";
            this.$session.destroy();
          })
          .catch(err => {
            // handle error
            this.errors.push(err);
          })
          .then(() => {
            // always executed
            this.resetForm();
            this.clearMessages();
          });
      },

      onCancel(evt) {
        this.resetForm();
        this.loginPopup = false;
      },

      onCancelChangeUsername(evt) {
        this.newUsername.username = '';
        this.changeUsernamePopup = false;
      },

      onChangeUsername(evt) {
        evt.preventDefault();
        const bodyContent = { username: this.newUsername.username, password : this.newUsername.password };
        
        axios.put(`/users/username/${bodyContent.username}`, bodyContent)
          .then((res) => {
            // handle success
            this.changeUsernamePopup = false;
            this.user.username = bodyContent.username;
          })
          .catch(err => {
            // handle error
            this.errors.push(err);
          })
          .then(() => {
            // always executed
            this.newUsername.username = '';
            this.clearMessages();
          });
      },      

      onCancelChangePassword(evt) {
        this.newPassword.password = '';
        this.changePasswordPopup = false;
      },

      onChangePassword(evt) {
        console.log("change password");
        evt.preventDefault();
        const bodyContent = { password : this.newPassword.password };
        
        axios.put(`/users/password/${bodyContent.password}`, bodyContent)
          .then((res) => {
            // handle success
            this.changePasswordPopup = false;
          })
          .catch(err => {
            // handle error
            this.errors.push(err);
          })
          .then(() => {
            // always executed
            this.newPassword.password = '';
            this.clearMessages();
          });
      },

      resetForm() {
        this.loginForm.username = '';
        this.loginForm.password = '';
      },

      clearMessages: function() {
        setInterval(() => {
          this.errors = [];
        }, 5000);
      },
    }

  };
</script>

<style>
  /* .navbar{
    display:flex;
    justify-content: space-around;
  } */

  .search{
    padding-left: 30px;
  }
</style>

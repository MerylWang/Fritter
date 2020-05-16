<template>
  <div id="app">
    <NavComponents v-bind:user="user" v-bind:isSignedIn="isSignedIn"/>
    <router-view 
      v-bind:user="user"
      v-bind:isSignedIn="isSignedIn"/>
  </div>
</template>

<script>
import NavComponents from "./components/NavComponents.vue";
import ViewAllFreets from "./components/ViewAllFreets.vue";

import { eventBus } from "./main";

export default {
  name: "app",
  components: {
    NavComponents,
    ViewAllFreets
  },
  data () {
    return {
      isSignedIn : false,
      user : {
        username : '', 
        uid : -1 }, 
    }
  }, 

  created: function () {
    eventBus.$on("signin-success", () => {
      this.isSignedIn = true;
    });

    eventBus.$on("current-user", (user) => {
      this.user = user;
      // console.log('current user: ', this.user);
    });

    eventBus.$on("signout-success", () => {
      this.isSignedIn = false;
      this.user = {}; 
    });

  },
};
</script>

<!-- global styles -->
<style>

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>

<style scoped>
</style>

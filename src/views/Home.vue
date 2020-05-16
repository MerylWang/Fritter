<template>
  <div>
    <h2 class="heading"> Home </h2>
    <div v-if="!isSignedIn">
      <ViewAllFreets v-bind:user="user" v-bind:isSignedIn="isSignedIn"/>
    </div>
    <div v-else>
      <CreateFreet/>
      <Feed :user="user" :isSignedIn="isSignedIn"/>
    </div>

</div>
</template>


<script>
import ViewAllFreets from "../components/ViewAllFreets.vue";
import CreateFreet from "../components/CreateFreet.vue";
import Feed from "../components/Feed.vue";

import { eventBus } from "../main";

export default {
  name: "home",
  
  components: {
    ViewAllFreets, 
    CreateFreet, 
    Feed,
  },

  props : {
    user : Object, 
    isSignedIn : Boolean,
  }, 

  data() {
    return {
      
    }
  },
  
  computed : {
  }
};
</script>

<style scoped>
.heading {
  display:flex;
  justify-content: center;
}

</style>
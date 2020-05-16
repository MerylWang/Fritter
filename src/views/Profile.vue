<template>
    <div>
      <h3 class="heading">Profile</h3>
      <!-- TODO: User Information -->
      <Wall :user="user" :isSignedIn="isSignedIn" />

    </div>

</template>

<script>
  import Wall from "../components/Wall.vue"

  export default {
    name: "profile",

    props : {
      user : Object, 
      isSignedIn : Boolean,
    }, 

    components: {
      Wall,
    },

    data() {
      return {
        // TODO
      }
    },

  



  };
</script>

<style scoped>

  .heading{
    display:flex;
    justify-content:center;
  }

</style>
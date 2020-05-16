<template>
  <div>
    <h3 class="heading">My Freets</h3>
    
    <div class="wall">
      <div v-if="wall.length" width="50%">
        <Freet
          v-for="freet in wall"
          v-bind:key="freet.id"
          v-bind:freet="freet"
          v-bind:user="user"
          v-bind:isSignedIn="isSignedIn"
        />
      </div>
      <div v-else>
        <p>You have not written or refreeted any freets yet. Go to View All Freets to refreet other's freets or Home to create a freet. </p>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import Freet from "./Freet";
    import { eventBus } from "../main";

    export default {
        name : "wall", 

        props : {
            user : Object, 
            isSignedIn : Boolean,
        }, 

        components: {
            Freet,
        },

        data() {
            return {
                error : "",
                success: "",
                wall : [],
            };
        },

        mounted: function() {
            this.loadWall();
        },

        methods: {
            loadWall : function() {
                axios.get('/users/refreet').then(response => {
                this.wall = response.data;
                 });
            },
        }, 
    };
</script>

<style>
    .wall {
        display:flex;
        justify-content: center;
    }
    .heading {
        display:flex;
        justify-content:center;
    }
</style>
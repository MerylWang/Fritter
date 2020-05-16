<template>
  <div>
    <h3 class="heading">View Freets by Author</h3>
    <div class="freets-by-author">
      <div v-if="freets.length" width="50%">
        <Freet
          v-for="freet in freets"
          v-bind:key="freet.id"
          v-bind:freet="freet"
          v-bind:user="user"
          v-bind:isSignedIn="isSignedIn"
        />
      </div>
      <div v-else>
        <p>This author has not posted any freets yet. Follow this user to see their freets in your feed.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Freet from "./Freet";
import { eventBus } from "../main";

export default {
    name : "ViewFreetsByAuthor",

    components: {
        Freet,
    }, 

    props: {
        user : Object,
        isSignedIn:Boolean,
        author : Object, 
    },

    data() {
      return {
        error : "",
        success: "",
        freets : [],
      };
    },

    mounted: function() {
      this.loadFreets();
    },

    methods: {
        loadFreets : function() {
            console.log('author: ', this.author.username);
            axios.get(`/freets/author/${this.author.username}`).then(response => {
                this.freets = response.data;
            });
    },
},

    
};
</script>

<style scoped>
  .freets-by-author{
    display:flex;
    justify-content: center;
  }
  .heading{
    display:flex;
    justify-content:center;
  }
</style>

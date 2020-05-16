<template>
  <div>
    <h3 class="heading">View All Freets</h3>
    <div class="all-freets">
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
        <p>There are no freets yet. Sign up / log in to create the first freet!</p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import Freet from "./Freet";
  import { eventBus } from "../main";

  export default {
    name: "ViewAllFreets",

    components: {
      Freet,
    },

    props: {
      user : Object,
      isSignedIn:Boolean,
    },

    data() {
      return {
        error : "",
        success: "",
        freets : [], // TODO : uncomment
        // freets : [ // TODO: for testing only
        //   {id : 0, author: 'bob', content : 'hi', votes : 1, refreets : 1},
        //   {id : 1, author: 'alice', content : 'hi from alice', votes : 1, refreets : 1}
        //   ] 
      };
    },


    created: function() {
      // TODO
    },

    mounted: function() {
      this.loadFreets(); // TODO: uncomment this
    },

    methods: {
      loadFreets : function() {
        axios.get("/freets").then(response => {
          this.freets = response.data;
        });
      },
    },
  };
</script>

<style>
  .all-freets{
    display:flex;
    justify-content: center;
  }
  .heading{
    display:flex;
    justify-content:center;
  }
</style>

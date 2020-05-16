<template>
  <div>
    <h3 class="heading">Feed</h3>
    <div class="feed">
      <div v-if="feed.length" width="50%">
        <Freet
            v-for="freet in feed"
            v-bind:key="freet.id"
            v-bind:freet="freet"
            v-bind:user="user"
            v-bind:isSignedIn="isSignedIn"
        />
      </div>
      <div v-else>
        <p>Your feed is empty. Follow some users to see their freets on your feed!</p>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import Freet from "./Freet";
    import { eventBus } from "../main";

    export default {
        name : "feed",

        components: {
            Freet,
        }, 

        props : {
            user : Object,
            isSignedIn:Boolean,
        }, 

        data() {
            return {
                error : "",
                success: "",
                feed : [],
            };
        },

        mounted: function() {
            this.loadFeed();
         },

        methods: {
            loadFeed : function() {
                axios.get('/users/follow/feed').then(response => {
                    this.feed = response.data;
                });
            },
        },

    };
</script>

<style>
    .heading{
        display:flex;
        justify-content:center;
    }

    .feed{
        display:flex;
        justify-content:center;
    }

</style>
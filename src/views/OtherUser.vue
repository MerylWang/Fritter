<template>
    <div>
        <h3 class="heading">{{author.username}}'s Profile</h3>
    
        <div v-if="isSignedIn" class="card">
            <b-card 
                title="Follow This Author"
                style="max-width: 40rem;"
                class="mb-2"
                border-variant="info">
                <b-card-text>Follow {{author.username}} to see their freets on your feed.</b-card-text>

                <b-button v-if="!isFollowed" 
                        v-on:click="onFollow"
                        variant="info">
                Follow {{author.username}}
                </b-button>

                <b-button v-else-if="isFollowed"
                        v-on:click="onUnfollow"
                        variant="info">
                Unfollow {{author.username}}
                </b-button>

            </b-card>
        </div>

        <ViewFreetsByAuthor 
            :user="user"
            :isSignedIn="isSignedIn"
            :author="author" />
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import ViewFreetsByAuthor from "../components/ViewFreetsByAuthor.vue";


export default {

    name : "OtherUserProfile",

    props : {
        user : Object,
        isSignedIn : Boolean,
        author : Object,
    },

    components : {
        ViewFreetsByAuthor,
    }, 


    mounted: function() {
      console.log('otheruser: ', this.author)
    },

    data() {
        return {
            isFollowed : false,
        }
    },

    methods : {
        onFollow: function(evt) {
            console.log('follow ', this.author.username)
            evt.preventDefault();
            const bodyContent = { username : this.author.username };

            axios.post('/users/follow', bodyContent)
            .then(() => {
                this.isFollowed = true;
            })
            .catch(err => {
                eventBus.$emit("follow-error", err);
            }).then(() => {
            });
        }, 

        onUnfollow: function(evt) {
            console.log('unfollow')
            evt.preventDefault();
            const bodyContent = { username : this.author.username };

            axios.post('/users/follow/undo', bodyContent)
            .then(() => {
                this.isFollowed = false;
            })
            .catch(err => {
                eventBus.$emit("unfollow-error", err);
            }).then(() => {
            });
        },
    },
};
</script>

<style scoped>

    .heading{
        display:flex;
        justify-content:center;
    }
  
    .card {
        display:flex;
        justify-content:center;
        align-items: center;
    }
</style>
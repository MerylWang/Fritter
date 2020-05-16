<template>

  <div>

    <!-- Edit Freet Popup  -->
    <b-modal v-model="editFreetPopup" id="edit-freet-modal" title="Edit Freet" hide-footer>
      <b-form>
        <b-form-group
            id="edit-freet-content"
            label="New content:"
            label-for="edit-freet-content"
          >
          <b-form-input
            id="input-new-content"
            v-model="editFreetForm.content"
            required
            placeholder="Enter new content"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <b-button variant="outline-secondary" @click="onCancelEditFreet">Cancel</b-button>
      <b-button variant="outline-info" @click="onEditFreet">Edit Freet</b-button>
    </b-modal>

    <!-- Freet Card  -->
    <b-card
      v-if="freetCurrent.author"
      style="width: 40rem;"
      class="mb-2"
      border-variant="info"
    >
      <router-link :to="{ name: 'OtherUser', 
                    params: { author: author, user: user, isSignedIn: isSignedIn } }">
      {{author.username}}
      </router-link>

      <b-dropdown v-if="isAuthor" id="freet-dropdown" text="Freet Settings" class="m-md-2" variant="outline-info" style="float:right">
        <b-dropdown-item @click="handleEditFreet" v-b-modal.edit-freet-modal>Edit Freet</b-dropdown-item>
        <b-dropdown-item @click="onDeleteFreet">Delete Freet</b-dropdown-item>
      </b-dropdown>

      <b-card-text>
        <!-- {{freet.content}} -->
        {{freetContent}}
      </b-card-text>

      <b-button v-if="!isUpvoted&&isSignedIn" 
                v-on:click="onUpvote"
                variant="info">Upvote</b-button>

      <b-button v-else-if="isUpvoted" 
                v-on:click="onUndoUpvote"
                variant="info">Undo Upvote</b-button>

      <!-- TODO: check that votes in reactive. Else try countUpvote() -->
      # upvotes : {{voteCounts}}

      <b-button v-if="isSignedIn&&user.username!=freet.author" 
                v-on:click="onRefreet"
                variant="info" 
                style="float: right">Refreet</b-button>
    </b-card>
  </div>
  
</template>

<script>
  import axios from "axios";
  import { eventBus } from "../main";

  export default {
    name: "freet",
    components: {
      // TODO
    },
    props: {
      freet: Object,
      user : Object,
      isSignedIn:Boolean,
    },
    data () {
      return {
        isUpvoted : false,
        // isRefreeted : false, 
        editFreetPopup: false, 
        editFreetForm : {
          content : '',
        },
        voteCounts : this.freet.votes,
        freetContent : this.freet.content,
        freetCurrent : this.freet,
        author : {
          username : this.freet.author,
        },
      }
    },
    computed : {
      isAuthor () {
        return this.user.username == this.freet.author;
      },

    },
    methods : {
      countVotes() {
        const bodyContent = { id : this.freet.id };

        axios.get(`/freets/upvote/${bodyContent.id}`, bodyContent)
          .then((response) => {
            console.log('current votes: ', response.data.votes);
            this.voteCounts = response.data.votes;
          }).catch(err => {
            eventBus.$emit("count-votes-error", err);
          }).then(() => {
          });
      },


      handleEditFreet: function() {
        this.editFreetPopup = true;
      },

      onCancelEditFreet: function() {
        console.log('cancel edit freet')
        this.editFreetPopup = false;
        this.editFreetForm.content = '';
      },

      onUpvote: function(evt) {
        console.log('upvote');
        evt.preventDefault();
        const bodyContent = { id : this.freet.id };

        axios.post("/freets/upvote", bodyContent)
          .then((response) => {
            this.isUpvoted = true;
            this.voteCounts = response.data.votes;
            // this.countVotes();
          })
          .catch(err => {
            eventBus.$emit("upvote-error", err);
          }).then(() => {
          });
      },

      onUndoUpvote: function(evt) {
        console.log('undo upvote');
        evt.preventDefault();
        const bodyContent = { id : this.freet.id };

        axios.post("/freets/upvote/undo", bodyContent)
          .then((response) => {
            this.isUpvoted = false;
            this.voteCounts = response.data.votes;

            // this.countVotes();
          })
          .catch(err => {
            eventBus.$emit("upvote-error", err);
          }).then(() => {
          });
      }, 

      onRefreet: function(evt) {
        // TODO: display button iff freet not in user.freets
        console.log("refreet");
        evt.preventDefault();
        const bodyContent = { id : this.freet.id };

        axios.post('/users/refreet', bodyContent)
          .then(() => {
          })
          .catch(err => {
            eventBus.$emit("refreet-error", err);
          }).then(() => {
          });
      },

      onEditFreet(evt) {
        console.log("edit freet");
        evt.preventDefault();
        const bodyContent = { id : this.freet.id, content : this.editFreetForm.content };

        axios.put(`/freets/${bodyContent.id}`, bodyContent)
          .then((response) => {
            console.log('edit-freet-success')
            this.freetContent = response.data.content;
          })
          .catch(err => {
            eventBus.$emit("edit-freet-error", err);
          }).then(() => {
            this.editFreetForm.content = '';
            this.editFreetPopup = false;
            console.log("new content:", this.freet.content);
          });
      }, 

      onDeleteFreet(evt) {
        // TODO: confirmation popup
        evt.preventDefault();
        const bodyContent = { id : this.freet.id};

        axios.delete(`/freets/${bodyContent.id}`, bodyContent)
          .then(() => {
            console.log('delete-freet-success')
            this.freetCurrent = {}
          })
          .catch(err => {
            eventBus.$emit("delete-freet-error", err);
          }).then(() => {
          });
      },
    },

  };
</script>

<style scoped>

</style>
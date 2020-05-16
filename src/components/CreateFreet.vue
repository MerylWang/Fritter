<template>
    <div class="create-freet">
    <b-card 
    title="Create Freet"
    style="max-width: 50rem;"
    class="mb-2"
    >

        <b-form class="form">
            <b-form-input
                id="input-content"
                v-model="newFreet.content"
                type="content"
                required
                placeholder="Enter Freet Content"
            ></b-form-input>
        </b-form>

        <b-button class="button" variant="outline-secondary" @click="onCancelCreate">Clear</b-button>
        <b-button class="button" variant="outline-info" @click="onCreate">Create Freet</b-button>
    
    </b-card>
    </div>
    
</template>

<script>
    import axios from "axios";
    import { eventBus } from "../main";

    export default {
        name:"createFreet",

        components : {
            // TODO
        },

        data() {
            return {
                newFreet: {
                    content : '',
                },
            }
        },

        methods : {
            onCancelCreate () {
                this.newFreet.content = '';
            }, 

            onCreate(evt) {
                // TODO: only submit if content nonempty
                evt.preventDefault();
                const bodyContent = { content : this.newFreet.content };
                axios.post('/freets', bodyContent)
                    .then(() => {
                    })
                    .catch(err => {
                        eventBus.$emit("create-freet-error", err);
                    }).then(() => {
                        this.newFreet.content = ''; 
                    });
                
            },

            
        }
        

        
    }
</script>

<style scoped>
    .create-freet {
        display : flex; 
        justify-content: center;
        /* align-items:center; */
    }
</style>
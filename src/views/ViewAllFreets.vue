<template>
    <ViewAllFreets 
        v-bind:isSignedIn="isSignedIn" 
        v-bind:user="user" />
</template>

<script>
import ViewAllFreets from "../components/ViewAllFreets.vue";

export default {
    name:"ViewAllFreetsPage",
    components : {
        ViewAllFreets,
    }, 
    props : {
        isSignedIn: Boolean, 
        user : Object,
    }   
};
</script>
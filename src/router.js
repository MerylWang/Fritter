import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: "Home",
      path: '/',
      component: () => import('./views/Home.vue'),
      props : true,
      // props : { user : Object, isSignedIn: Boolean },
    },

    {
      name : "ViewAllFreetsPage",
      path : "/viewAll",
      component: () => import("./views/ViewAllFreets.vue"),
      props : true,
    }, 

    {
      name : "Profile",
      path : "/profile", // TODO: replace with username
      component : () => import('./views/Profile.vue'),
      props : true,
    },

    {
      name : "OtherUser", 
      path : "/otherUser",  // TODO: make route dynamic (/username)
      component : () => import('./views/OtherUser.vue'),
      props : true,
      // props : {user : Object, isSignedIn : Boolean, author:Object }
    }


  ]
})

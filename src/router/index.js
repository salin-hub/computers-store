import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import laptop from '../components/laptop.vue'
import desktop from '../components/desktop.vue'
import gaming from '../components/gaming.vue'
import monitor from '../components/monitor.vue'
import register from '../components/validation/register.vue'
import login from '../components/validation/loginpage.vue'
import profile from '../components/validation/profile.vue'
import shipping from '../components/shipping.vue'
import favorite from '../components/favorite.vue'
import invoice from '../components/invoice.vue'
import viewpoduct from '../components/Viewproduct.vue'
import history from '../components/history.vue'
import search from '../views/searching.vue'
import footer from '../views/footer_page.vue'
import showdataModel from '@/views/showdataModel.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path:'/laptop',
      name:'laptop',
      component:laptop
    },
    {
      path:'/desktop',
      name:'desktop',
      component:desktop,
    },
    {
      path:'/gaming',
      name:'gaming',
      component:gaming
    },
    {
      path:'/monitor',
      name:'monitor',
      component:monitor
    },
    {
      path:'/account/register',
      name:'register',
      component:register
    },
    {
      path:'/account/login',
      name:'login',
      component:login
    },
    {
      path:'/profile',
      name:'profile',
      component:profile
    },
    {
      path:'/shipping',
      name:'shipping',
      component:shipping
    },
    {
      path:'/favorite',
      name:'favorite',
      component:favorite
    },
    {
      path:'/invioce',
      name:'invoice',
      component:invoice
    },
    {
      path:'/products/:productId',
      name:'viewproduct',
      component:viewpoduct
    },
    {
      path:'/order-history',
      name:'history',
      component:history
    },{
      path:'/searching',
      name:'search',
      component:search
    }
    ,{
      path:'/view/model',
      name:'showmodel',
      component:showdataModel
    },{
      path:'/footer',
      component:footer
    }
  ],
})

export default router

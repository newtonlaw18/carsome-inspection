import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/findappointment',
    name: 'FindAppointment',
    component: () => import('../views/FindAppointment.vue')
  },
  {
    path: '/rescheduleappointment/:id',
    name: 'RescheduleAppointment',
    component: () => import('../views/RescheduleAppointment.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Head from '@/components/Head'
import Home from '@/components/page/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'head',
    component: Head,
    children: [
      // 首页
      {
        path: '/',
        name: 'home',
        component: Home
      }
    ]
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }]
})

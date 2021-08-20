import Vue from "vue";
import Router from "vue-router";
import Register from "./views/register";
import Login from './views/login'

import Layout from './components/Layout.vue'
import Home from './views/home';
import Teacher from './views/teacher';
import Student from './views/student';
Vue.use(Router);

export default new Router({
  mode: "history",

  routes: [

    {
      // 基础布局
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home,
          meta: { title: '首页' }
        }
      ]
    },
    {
      path: '/teacher',
      component: Layout,
      children: [
        {
          path: '/',
          component: Teacher,
          meta: { title: '教师管理' }
        }
      ]
    },
    {
      path: '/student',
      component: Layout,
      children: [
        {
          path: '/',
          component: Student,
          meta: { title: '学员管理' }
        }
      ]
    }
    , {
      path: "/login",
      name: "login",
      component: Login
    }, {
      path: "/register",
      name: "register",
      component: Register
    }

  ]
});

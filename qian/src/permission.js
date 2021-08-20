import router from './router'
import {getUserInfo} from './api/login.js'
router.beforeEach((to, from, next) => {
const token = localStorage.getItem("sms-token")
//token不存在
    if (!token) {
        if (to.path ==="/login") {
            next()
        } else if (to.path === "/register") {
            next()
        } else {
            next({path:"/login"})
        }
    }else {
        // 有 token
        if(to.path === "/login"){
            next();
        }else if(to.path === "/register"){
            next();
        }else {
            const userInfo = localStorage.getItem("sms-user")
            if (userInfo) {
                next()
            } else {
                getUserInfo(token).then((response) => {
                    const resp = response.data
                    if (resp.flag) {
                        localStorage.setItem("sms-user", JSON.stringify(resp.data))
                        next()
                    } else {
                        next({ path: '/login' })
                    }
                })
            }
        }
    }
})
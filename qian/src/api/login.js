import request from '../utils/request'
//注册
export function register(username, nickname, password) {
    return request({
        url: "/user/register",
        method: 'post',
        data: {
            username,
            nickname,
            password

        }
    })
};
//登录
export function login(username, password) {
    return request({
        url: '/user/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
};
//获取用户信息
export function getUserInfo(token) {
    return request({
        url: `/user/info?token=${token}`,
        method: 'get'
    })
};
//退出
export function logout(token) {
    return request({
        url: '/user/logout',
        method: 'post',
        data: {
            token
        }
    })
};
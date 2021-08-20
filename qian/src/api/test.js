import request from "../utils/request.js"

// 测试1 调用get方式发送get请求
// request.get( "/db.json").then(response => {
//     console.log("get1", response.data);
// }).catch(error => {
//     console.log(error);
// });

// request({
//     url:'db.json',
//     method:'get'
// }).then(response=>{
//     console.log("get2",response.data);
// })

export default{
    getList(){
        return request({
            url:'/db.json',
        method:'get'
        })
        
    }
}
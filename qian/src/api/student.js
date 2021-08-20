import request from "../utils/request.js"
export default {
    search(page,size,searchMap){
        console.log(searchMap);
        return request({
            url:'/students/list',
            method:'post',
           
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    add(pojo){
        return request({
            url:'/students',
            method:'post',
            data:pojo
        })
    },
    // 根据id查询学员
    getById(id){
        return request({
            url:`/students?id=${id}`,
            method:'get'
        })
    },
    // 修改学员信息
    update(pojo){
        return request({
            url:`/students`,
            method:'put',
            data:pojo
        })
    },
    deleteById(id) {
        return request({
        url: `/students`,
        method: 'delete', 
        data:{
            id
        }
        })
    },
}
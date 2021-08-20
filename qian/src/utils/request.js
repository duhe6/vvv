import axios from "axios"
//import { Loading, Message } from 'element-ui'
const request =axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:5000
});

export default request
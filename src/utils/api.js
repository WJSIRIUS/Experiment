import axios from "axios";

const reqAxios = axios.create(
    {
        baseURL: "localhost:5000",
        timeout: 10000,
        withCredentials: false
    }
)
// 拦截
reqAxios.interceptors.request.use(
    (config) => {

        // no token
        // no Authorization

        if (!config.headers["content-type"]) { // 如果没有设置请求头
            config.headers["content-type"] = "application/json"
        }
    }, (err) => {
        Promise.reject(err)
    }
)

reqAxios.interceptors.response.use(
    (res) => {
        // no token
        let data = res.data
        if (typeof data === 'object') {
            return data
        } else if (typeof data === 'string') {
            return JSON.parse(data)
        }
    },
    (err) => {
        console.log(err.response.data)
        Promise.reject()
    }
)

reqAxios
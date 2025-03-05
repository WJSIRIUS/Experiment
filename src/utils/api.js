import axios from "axios";

const reqAxios = axios.create(
    {
        baseURL: "/api",
        // baseURL: "http://localhost:5000/",
        timeout: 10000,
        withCredentials: false,
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
        return config
    }, (err) => {
        Promise.reject(err)
    }
)

reqAxios.interceptors.response.use(
    (res) => {
        // no token
        let data = res.data
        // console.log(res)
        if (typeof data === 'object') {
            return data
        } else if (typeof data === 'string') {
            return JSON.parse(data)
        }
    },
    // (err) => {
    //     console.log(err.response)
    //     Promise.reject()
    // }
)


// group id
const getGroupId = async () => {
    try {
        // let res = await reqAxios({
        //     url: '/userinfo',
        //     method: 'get',
        //     responseType: 'json',
        //     data: data
        // })
        let res = await reqAxios.get('/userinfo', {
            responseType: 'json',
        })
        // console.log('getgroupid',res)
        return res
    } catch (err) {
        console.log(err)
    }
}

// survey
const getSurvey = async () => {
    try {
        let res = await reqAxios({
            url: '/survey',
            method: 'get',
            responseType: 'json',
        })
        return res
    } catch (err) {
        console.log(err)
    }
}

// round rank
const getRoundRank = async (data) => {
    try {
        let res = await reqAxios({
            url: '/rank',
            method: 'get',
            responseType: 'json',
            data: data
        })
        return res
    } catch (err) {
        console.log(err)
    }
}

// submit
const postSubmitResult = async (data) => {
    try {
        let res = await reqAxios({
            url: '/submit',
            method: 'post',
            responseType: 'json',
            data: data
        })
        return res
    } catch (err) {
        console.log(err)
    }
}

export { getGroupId, getSurvey, getRoundRank, postSubmitResult }
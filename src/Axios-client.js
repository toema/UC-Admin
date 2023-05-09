import axios from "axios";
// const https = require('https')

const axiosClient=axios.create({
    baseURL:`${import.meta.env.VITE_API_BASE_URL}`,
//     headers:{
//         "Accept": "application/json, text/plain, */*",
//         "Access-Control-Allow-Origin":"*",
//         "Access-Control-Allow-Headers": "*",
// 'Access-Control-Allow-Methods': '*',
// 'Access-Control-Allow-Origin': '*'
//     },
    // httpsAgent: new https.Agent({  
    //     rejectUnauthorized: false
    //   })
    
})

export default axiosClient
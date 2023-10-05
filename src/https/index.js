import axios from "axios";
import { API_URL } from "../utils/config";
import Cookies from 'js-cookie'
const $host = axios.create({
    baseURL:API_URL + '/api',
    withCredentials:true
   
    
})

const $authHost = axios.create({
    baseURL:API_URL + '/api',
    withCredentials:true
})

$authHost.interceptors.request.use((request)=>{
    request.headers.Authorization = `Bearer ${Cookies.get('refreshToken')}`
    return request
})



$authHost.interceptors.response.use((response)=>{
    return response
},async (error)=>{
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await  $host.post(`user/refresh`)
            localStorage.setItem('auth','true')
            return $authHost.request(originalRequest)
        } catch (error) {
            console.log('Не авторизован');
        }
    }
})

export {
    $host,
    $authHost
}
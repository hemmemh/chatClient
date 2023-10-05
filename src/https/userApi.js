import axios from "axios"
import { $authHost, $host } from "."
import { API_URL } from "../utils/config"

export const registration= async(info)=>{
    try {
        const {data} = await $host.post('user/registration',info)
        return data
    } catch (error) {
        
    }

}

export const login= async(info)=>{

try {
    const {data} = await $host.post('user/login',info,{withCredentials:true})
    return data
} catch (error) {
    
}
     
 
   
}

export const getAllUsers= async(info)=>{
    const {data} = await $host.get('user/getAll',{withCredentials:true})
    return data
}

export const logout= async()=>{
    const {data} = await $authHost.post('user/logout',{withCredentials:true})
    return data
}


export const refresh= async()=>{
    try {
        const {data} = await $host.post(`user/refresh`,{withCredentials:true})
        return data
    } catch (error) {
        
    }
  
}

export const getUser= async(info)=>{
    const {data} = await $host.post(`user/getOne`,info)
    return data
}

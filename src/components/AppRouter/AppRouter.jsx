import React, { useContext, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Login } from '../../pages/Login'
import Room from '../../pages/Room'
import jwtDecode from 'jwt-decode'
import { Context } from '../..'
import { refresh } from '../../https/userApi'


export const AppRouter = () => {
  const {user} = useContext(Context)
  const [loader, setloader] = useState(false)
  const navigate =  useNavigate()
  useEffect(() => {
    refresh().then(e=>{
      if (e) {
        console.log(e);
        console.log('5566');
        console.log(jwtDecode(e.refreshToken),'OOPPPO');
        user.setuser(jwtDecode(e.refreshToken))
        navigate('room')
      }else{
        navigate('/')
      }
    
  
  }).finally(()=>{
    setloader(true)
  
    
   })
  }, [])

  return (
    <>
      {loader && 
    <Routes>
    <Route path={'/'} element={<Login/>}/>
    <Route path={'room'} element={<Room/>}/>
</Routes>
}
</>

   
  )
    
}

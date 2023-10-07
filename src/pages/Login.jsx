import React, { useContext, useRef } from 'react'
import Button from '../components/button/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, registration } from '../https/userApi'
import { Context } from '..'
import jwtDecode from 'jwt-decode'
import CircularProgress from '@mui/material/CircularProgress';
export const Login = () => {
  const [successfullReg, setsuccessfullReg] = useState(false)
  const [loading, setloading] = useState(false)
  const [name, setname] = useState('')
  const [mail, setmail] = useState('')
  const [islogin, setislogin] = useState(true)
  const [password, setpassword] = useState('')
  const {user} = useContext(Context)
  const [file, setfile] = useState(null)
  const [fileImage, setfileImage] = useState(null)
  const navigate = useNavigate()
  const [textAlert, settextAlert] = useState('успешная регистрация')
  const inputFileRef = useRef()
  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/iu
  const [validations, setvalidations] = useState({mail:true,password:true})
  const onRegistration = ()=>{
    const formaData = new FormData()
    formaData.append('mail',mail)
    formaData.append('password',password)
    formaData.append('name',name)
    formaData.append('image',file)
    console.log(file);
  
    if (!name || !password || !mail || !file) {
      settextAlert('недостаточно информации')
      setsuccessfullReg(true)
      setTimeout(() => {
          setsuccessfullReg(false)
      }, 3000);
      return
        
      
    }
    if(!validations.password && !validations.mail){
      settextAlert('ошибка при валидации')
      setsuccessfullReg(true)
      setTimeout(() => {
          setsuccessfullReg(false)
      }, 3000);
      return
        
    }
    setloading(true)

    registration(formaData).then(data=>{

      if (data) {
        setloading(false)
        console.log(data);
        settextAlert('успешная регистрация')
        setsuccessfullReg(true)
        setislogin(true)
        setTimeout(() => {
            setsuccessfullReg(false)
        }, 3000);
      }else{
        settextAlert('имейл уже существует')
        setsuccessfullReg(true)
        setislogin(true)
        setTimeout(() => {
            setsuccessfullReg(false)
        }, 3000);
      }
     
    }).finally(()=>{
      setloading(false)
    })
  }


  const setFileFunction = (e)=>{
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    setfile(e.target.files[0])
    reader.onloadend = ()=>{
        setfileImage(reader.result)
     
           
    }
}
  const onLogin = ()=>{
    if (!password || !mail) {
      settextAlert('недостаточно информации')
      setsuccessfullReg(true)
      setTimeout(() => {
          setsuccessfullReg(false)
      }, 3000);
      return
        
      
    }
    if(!validations.password && !validations.mail){
      settextAlert('ошибка при валидации')
      setsuccessfullReg(true)
      setTimeout(() => {
          setsuccessfullReg(false)
      }, 3000);
      return
        
    }
    setloading(true)
    login({mail,password}).then(data=>{
      if(data){
        user.setuser(jwtDecode(data.refreshToken))
        navigate('room')
      }else{
        setloading(false)
        setsuccessfullReg(true)
        settextAlert('неверен логин или пароль')
        setislogin(true)
        setTimeout(() => {
            setsuccessfullReg(false)
        }, 3000);
      }
     
    }).finally(()=>{
      setloading(false)
    })
  }


  const onPassword = (e)=>{
    setpassword(e)
    if(!PASSWORD_REGEX.test(e) && e !== ''){
      setvalidations({...validations,password:false})
    }else{
      setvalidations({...validations,password:true})
    }
  }

   const onMail = (e)=>{
    setmail(e)
    if(!EMAIL_REGEXP.test(e) && e !== ''){
      setvalidations({...validations,mail:false})
    }else{
      setvalidations({...validations,mail:true})
    }
  }
  return (
    <div className="Login">
      {successfullReg &&   <div className="Login__successfullReg">{textAlert}</div>}
   
      
      {loading ? <div className="Login__loading">
        <CircularProgress/>
      </div>
      :
      <div className="Login__body">
      {!islogin &&  <input type="text" value={name} onChange={(e)=>setname(e.target.value)} className='Login__input' placeholder='Имя'/>}
        <input type="text" value={mail} onChange={(e)=>onMail(e.target.value)} className={!validations.mail ? 'Login__input active' : 'Login__input'} placeholder='mail'/>
        <input type="text" value={password} onChange={(e)=>onPassword(e.target.value)} className={!validations.password ? 'Login__input active' : 'Login__input'} placeholder='пароль'/>
        <div className="Login__buttons">
        {!islogin &&
          <>
            <input ref={inputFileRef}   onChange={setFileFunction} type="file" id='file2' className="Login__file" />
   
            <Button onClick={()=>inputFileRef.current.click()}  className='product-1 product-1'>выбрать аватар</Button>
          </>
           
          }
       
       {fileImage !== null  && !islogin &&
               <div className="Login__imageContainer">
               <div className="Login__image">
                 <img src={fileImage} alt=""/>
               </div>
               
              </div>}
          {islogin ?    
          <Button onClick={onLogin} className='product-1 product-1'>Войти</Button>:
            <Button onClick={onRegistration } na className='product-1 product-1'>Регистрация</Button>
          }

        </div>
        <div onClick={()=>islogin ? setislogin(false) :setislogin(true)} className="Login__text">{islogin ? "регистрация" : "логин"}</div>
        
      
  </div>
      }
     
    </div>
    
  )
}

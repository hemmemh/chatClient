import React, { useContext } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import io from 'socket.io-client'
import Button from '../components/button/Button'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Context } from '..'
import { getAllUsers, logout } from '../https/userApi'
import { observer } from "mobx-react-lite"
import { API_URL } from '../utils/config'
import CircularProgress from '@mui/material/CircularProgress';
import EmojiPicker from 'emoji-picker-react';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Chat from '../components/chat.jsx/Chat'
import imageCompression from 'browser-image-compression'
import * as dayjs from 'dayjs'
const Room =  () => {
  const [roomLoader, setroomLoader] = useState(false)
  const [userLoader, setuserLoader] = useState(false)
    const socket = useRef()
    const [connected, setconnected] = useState(false)
    const [text, settext] = useState('')
    const [messages, setmessages] = useState([])
    const {user} = useContext(Context)
    const [searchParams, setSearchParams] = useSearchParams();
    const [params, setparams] = useState({name:searchParams.get('name'),room:searchParams.get('room')})
    const [users, setusers] = useState([])
    const [file, setfile] = useState(null)
    const [fileImage, setfileImage] = useState(null)
    const [room, setroom] = useState('')
    const [activeUser, setactiveUser] = useState()
    const date= new Date()
    const [menu, setmenu] = useState(false)
    const inputRef = useRef()
    const [chat, setchat] = useState('room')
    const navigate =  useNavigate()
    const [emojiActive, setemojiActive] = useState(false)
    const navRef = useRef()

    const menuIconRef = useRef()
    const emojiRef = useRef()
    const emojiIconRef = useRef()
    const [smooth, setsmooth] = useState(false)
    useEffect(() => {
 
      if (!user.user.name) {
       navigate('/') 
      }

      setuserLoader(true)
      getAllUsers().then(data=>{
      
        setusers(data.filter(e=>e.name !==user.user.name))
      }).finally(()=>  setuserLoader(false))
     
      socket.current = io.connect(API_URL)


      socket.current.on('adminMessage',({data})=>{
        setroomLoader(false)
        setmessages(prev=>[...data.room.messages])
        setroom(data.room)
              })


      socket.current.on('userMessageFromServer',(data)=>{
       
        console.log(data);
        setmessages(prev=>[...prev,{name:data.name,text:data.text,date:data.date,image:data.image}])
    
      })
      document.addEventListener('click',(e)=>{
        if (!navRef.current?.contains(e.target) && e.target !== menuIconRef.current) {
          setmenu(false)
         
      }
      if (!emojiRef.current?.contains(e.target) && e.target !== emojiIconRef.current && e.target && e.target !== document.querySelector('.epr-btn')) {
        setemojiActive(false)
       
    }
      })
  

  
    }, [])




  
    
    
    const setFileFunction = async (e)=>{
     
        let reader = new FileReader();
        const imageResize =await imageCompression(e.target.files[0],{maxSizeMB:0.1})
        reader.readAsDataURL(imageResize);
        setfile(imageResize)
        reader.onloadend = ()=>{
            setfileImage(reader.result)   
        }
        e.target.value = ""
  
      
     
  }

  const removeFileFunction = ()=>{
   
    

    setfile(null)
    setfileImage(null)   
  
 
}
   const connectToRooom = (userOne,userTwo,name)=>{
    setmenu(false)
    setsmooth(false)
    setroomLoader(true)
    setactiveUser(userTwo)
    socket.current.emit('join',{data:{userOne,userTwo,name,data:date.getHours() + ':' + date.getMinutes()}})
   }


  const emojiClick = (e)=>{
   settext(prev=>`${prev}${e.emoji}`)
   setemojiActive(false)
  }


   const messageFromUser = ()=>{
    console.log(file,fileImage);
    setsmooth(true)

   
  if(text && room){ 

    setfile(null)
    setfileImage(null)   
    settext('')
    inputRef.current.style.height = '35px'
    if (room) (document.querySelector('.Room__chatOverflow').scrollTop  = document.querySelector('.Room__chatOverflow').scrollHeight)
    socket.current.emit('userMessage',{data:{name:user.user.name,text,image:file,roomId:room._id,date:dayjs(Date.now()).format('hh:mm:A')}},{})
  }
    
   }

  const keyUpTextArea = ()=>{


    inputRef.current.style.height = '35px'
    inputRef.current.style.height=`${inputRef.current.scrollHeight}px` 
    if (room) (document.querySelector('.Room__chatOverflow').scrollTop  = document.querySelector('.Room__chatOverflow').scrollHeight)
  
  }
   const onLogOut = ()=>{

    logout().then(data=>{
      user.setuser({})
      navigate('/')
    })
  }
   const enterInFocus = (e)=>{
    inputRef.current.style.height = '35px'
    inputRef.current.style.height=`${inputRef.current.scrollHeight}px` 
    if (room) (document.querySelector('.Room__chatOverflow').scrollTop  = document.querySelector('.Room__chatOverflow').scrollHeight)
    if(e.keyCode == 13 && text !== ''){
      e.preventDefault();
      setsmooth(true)
      setfile(null)
    setfileImage(null)   
    settext('')
    socket.current.emit('userMessage',{data:{name:user.user.name,text,image:file,roomId:room._id,date:dayjs(Date.now()).format('hh:mm:A')}})
    }
   }


    return (
      <div className="Room">
               <div className={menu ? "Room__before active" : "Room__before "}></div>
        <div ref={navRef} className={menu ?"Room__nav nav-room active" : "Room__nav nav-room" }>
  
          
        <div ref={menuIconRef} onClick={()=>setmenu(prev=>!prev)} className="Room__menu menu">
                    <button  type="button" className={menu ?"menu__icon icon-menu active" :"menu__icon icon-menu"}><span></span></button>
            </div>
          <div className="nav-room__title">
            <div className="nav-room__avatar">
                      <img src={`${API_URL}/users/${user.user.image}`} alt=""/>
            </div>
            <div className="nav-room__name"> {user.user.name}</div>      
            <div className="nav-room__logout">
            <Button onClick={onLogOut} className='product-1 product-1'>Выйти</Button>
            </div>
             
          </div>
          {userLoader ? <div className="Room__userLoader">
            <CircularProgress/>
            </div>
            :
          <div className="nav-room__users">
            
            
             {users.map(e=>
            <div onClick={()=>connectToRooom(user.user.id,e._id,user.user.name)} className={activeUser === e._id ? "nav-room__user active" : "nav-room__user"}>
                      <div className="nav-room__avatar">
                      <img src={`${API_URL}/users/${e.image}`} alt=""/>
                      </div>
                      <div className="nav-room__name">{e.name}</div>
              </div>
              )}

              
             </div>
}
        </div>
        <div className="Room__body">
          {!room && !roomLoader &&  
           <div className="Room__loader">
             <PersonIcon className='personIcon'/>
             Выберите пользователя
          </div>}

          {
       
           roomLoader &&
           <div className="Room__loader">
             <CircularProgress/>
        
         </div>
}
          {room && !roomLoader &&
          <Chat smooth={smooth} messages={messages}/>
          }
     
          <div class="Room__inputBody">
            <div className="Room__write">{}</div>
            
            {fileImage &&
                <div className="Room__imagePost">
                  <div className="Room__imagePostRemove" onClick={removeFileFunction}>
                  </div>
                  
       
                <img src={fileImage} alt=""/>
              </div>
              }
        
            
            <textarea   onKeyUp={keyUpTextArea}   onKeyDown={enterInFocus} ref={inputRef} value={text} onChange={(e)=>settext(e.target.value)}  className='Room__input' placeholder='Введите текст'></textarea>
            <label htmlFor='file' className="Room__image">
        
<ImageIcon className='actionIcon'/>
            </label>
            <input    onChange={setFileFunction} type="file" id='file' className="Login__file" />
            <div ref={emojiRef} className={emojiActive ? "emojiPiecker active" : "emojiPiecker "}>
            <EmojiPicker  onEmojiClick={emojiClick}/>
            </div>
            
      
             <div onClick={()=>setemojiActive(prev=>!prev)} className="emojiIcon">
    <InsertEmoticonIcon ref={emojiIconRef}  className='actionIcon'/>
             </div>
             
      
            <Button onClick={messageFromUser} className='product-1 product-1'><SendIcon className='sendIcon'/><span className='senD'>отправить</span> </Button>
          </div></div>
        
        
      </div>
    );
}

export default observer(Room)
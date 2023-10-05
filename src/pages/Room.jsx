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
    const chatOverflowRef = useRef()
    const menuIconRef = useRef()
   
    useEffect(() => {
      if (!user.user.name) {
       navigate('/') 
      }
      setuserLoader(true)
      getAllUsers().then(data=>{
      
        setusers(data.filter(e=>e.name !==user.user.name))
      }).finally(()=>  setuserLoader(false))
     
      socket.current = io.connect('http://localhost:5000')
      socket.current.on('adminMessage',({data})=>{
        setroomLoader(false)
        setmessages(prev=>[...data.room.messages,data])
        setroom(data.room)
    
              })
      socket.current.on('userMessageFromServer',(data)=>{
        console.log(data);
        setmessages(prev=>[...prev,{name:data.name,text:data.text,date:data.date,image:data.image}])
        //setroom(data.room)
      })
      document.addEventListener('click',(e)=>{
        if (!navRef.current?.contains(e.target) && e.target !== menuIconRef.current) {
          setmenu(false)
         
      }
      })
  

  
    }, [])


    useEffect(() => {
     if (room && !roomLoader) {

      setTimeout(() => {
        document.querySelector('.Room__chatOverflow').scrollTop = document.querySelector('.Room__chatOverflow').scrollHeight
      }, 100);
   
    
    
     }
    }, [room,roomLoader,messages])

  
    
    
    const setFileFunction = (e)=>{
     
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        setfile(e.target.files[0])
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
    setroomLoader(true)
    setactiveUser(userTwo)
    socket.current.emit('join',{data:{userOne,userTwo,name,data:date.getHours() + ':' + date.getMinutes()}})
   }
  const emojiClick = (e)=>{
   settext(prev=>`${prev}${e.emoji}`)
  }
   const messageFromUser = ()=>{
  if(text && room){ 
    setfile(null)
    setfileImage(null)   
    settext('')
    socket.current.emit('userMessage',{data:{name:user.user.name,text,image:file,roomId:room._id,date:date.getHours() + ':' + date.getMinutes()}})
  }
    
   }
   const onLogOut = ()=>{

    logout().then(data=>{
      user.setuser({})
      navigate('/')
    })
  }
   const enterInFocus = (e)=>{
    if(e.keyCode == 13 && text !== ''){
      setfile(null)
    setfileImage(null)   
    settext('')
    socket.current.emit('userMessage',{data:{name:user.user.name,text,image:file,roomId:room._id,date:date.getHours() + ':' + date.getMinutes()}})
    }
  
    ///socket.current.emit('userMessage',{data:{name:user.user.name,text,roomId:room,date:date.getHours() + ':' + date.getMinutes()}})
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
             <PersonIcon />
             Выберите пользовотеля
          </div>}

          {
       
           roomLoader &&
           <div className="Room__loader">
             <CircularProgress/>
        
         </div>
}
          {room && !roomLoader &&
          <div class="Room__chat">
          <div ref={chatOverflowRef} className="Room__chatOverflow">
          {messages.map(e=>  
          <div  class={e.name === user.user.name ? "Room__message message-app you" : "Room__message message-app"}>
            <div className="message-app__main">
            <div className="message-app__left">
            <div class="message-app__name">{e.name}</div>
            <div class="message-app__text">{e.text}</div>
          </div>
          <div className="message-app__right">
            <div className="message-app__data">{e.date} AM</div>
            
          </div>
            </div>
            
       
          {e.image !== '' &&
             <div className="message-app__image">
             <img src={`${API_URL}/messages/${e.image}`} alt=""/>
             </div>
             }
        
          </div>)}
          </div>
          
       
      
        </div>
          }
     
          <div class="Room__inputBody">
            {fileImage &&
                <div className="Room__imagePost">
                  <div className="Room__imagePostRemove" onClick={removeFileFunction}>
                  </div>
                  
       
                <img src={fileImage} alt=""/>
              </div>
              }
        
            
            <input  onKeyDown={enterInFocus} ref={inputRef} value={text} onChange={(e)=>settext(e.target.value)} type="text"  className='Room__input' placeholder='Введите текст'/>
            <label htmlFor='file' className="Room__image">
        
<ImageIcon/>
            </label>
            <input    onChange={setFileFunction} type="file" id='file' className="Login__file" />
            <div className={emojiActive ? "emojiPiecker active" : "emojiPiecker "}>
            <EmojiPicker onEmojiClick={emojiClick}/>
            </div>
            
      
             <div onClick={()=>setemojiActive(prev=>!prev)} className="emojiIcon">
    <InsertEmoticonIcon/>
             </div>
             
      
            <Button onClick={messageFromUser} className='product-1 product-1'><SendIcon/><span className='senD'>отправить</span> </Button>
          </div></div>
        
        
      </div>
    );
}

export default observer(Room)
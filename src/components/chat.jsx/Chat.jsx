import React, { useContext, useEffect, useRef, useState } from 'react'
import { API_URL } from '../../utils/config'
import { Context } from '../..'

const Chat = ({smooth,messages}) => {
  const {user} = useContext(Context)
  const loadMessages = useRef(0)
  const componentLoaded = useRef(false)
  const [loaded, setloaded] = useState(false)
  const chatOverflowRef = useRef()
  useEffect(() => {
   setTimeout(() => {
    chatOverflowRef.current.scrollTop = chatOverflowRef.current.scrollHeight
   }, 400);
   
  }, [])
  
  useEffect(() => {
   
    setTimeout(() => {
      chatOverflowRef.current.scrollTop = chatOverflowRef.current.scrollHeight
     }, 100);
   }, [messages])

  return <div class="Room__chat">
  <div ref={chatOverflowRef} className={ smooth ? "Room__chatOverflow active" : "Room__chatOverflow"}>
  {messages.map(e=>{
   if (!componentLoaded.current) loadMessages.current+=1
    return(
      <div key={e.id}  class={e.name === user.user.name ? "Room__message message-app you" : "Room__message message-app"}>
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
  
    )
  }

</div>
</div>
    
  
}

export default Chat
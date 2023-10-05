import React, { FC, useRef, useState } from 'react'
import { forEachChild } from 'typescript'


const Button = ({onClick=()=>{},children,className='origin icon',ripple=true ,rippleClass='origin'}) => {
const buttonRef = useRef()
  const rippleEffect=(e)=>{
    if (ripple) {
      e.stopPropagation()
      const circle = document.createElement("span");
      e.target.addEventListener("mouseup",()=>{
        circle.style.opacity='0'
        circle.addEventListener("transitionend",()=>{
          circle.remove()
        })
      })
      e.target.addEventListener("mouseout",()=>{
        circle.style.opacity='0'
        circle.addEventListener("transitionend",()=>{
          circle.remove()
        })
      })
     console.log(e.clientX,e.clientY,'yyyyyj');
     
      e.target.appendChild(circle);
      const diameter = Math.max(e.target.clientWidth, e.target.clientHeight);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - radius - buttonRef.current.getBoundingClientRect().left}px`;
      circle.style.top = `${e.clientY - radius- buttonRef.current.getBoundingClientRect().top }px`;
      circle.classList.add(`ripple`); 
      circle.classList.add(rippleClass); 
    }
      

  }



  return (
    <button ref={buttonRef} onClick={onClick} onMouseDown={e=>rippleEffect(e)} className={`Button ${className.split(' ').slice(0,-1).join(' ')}`}>
        <div className="Button__cover">
            <div className={`Button__absolute ${className.split(' ').splice(-1)}`}>{children}</div>
            
        </div>
        
    </button>
  )
}

export default Button
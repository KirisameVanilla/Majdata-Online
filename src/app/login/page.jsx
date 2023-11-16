'use client'
import React from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import md5 from 'js-md5'
import { useRouter } from 'next/navigation'
import { apiroot3 } from '../apiroot';

export default function Page() {
  return (
    <>
      <div className='seprate'></div>
      <h1><img className="xxlb"src="./salt.webp" onClick={()=>alert("不要点我 操你妈")}></img>MajOnline.Beta</h1>
      <div className='links'>
      <div className='linkContent'><a href='../'>返回</a></div>
      <div className='linkContent'><a href='./login'>登录</a></div>
      <div className='linkContent'><a href='./register'>注册</a></div>
      </div>
      <Login/>
    </>
  )
}

function Login(){
  const router = useRouter()
  async function onSubmit(event) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    formData.set('password',md5(formData.get('password')))
    const response = await fetch(apiroot3+'/User/Login', {
      method: 'POST',
      body: formData,
    })
    if (response.status !=200){
      alert(await response.text())
      return
    }
    document.cookie = 'token='+await response.text()
    router.push('./user')
  }
  return (
    <div className='theList'>
      <form className='formbox' onSubmit={onSubmit}>
        <div className='inputHint'>用户名</div>
        <input className='userinput' type="text" name="username" />
        <div className='inputHint'>密码</div>
        <input className='userinput' type="password" name="password" />
        <button className='linkContent' type="submit">确定</button>
      </form>
    </div>
  )
}

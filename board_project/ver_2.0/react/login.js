import '../Login.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router';


function Login() {

  // state 변수 선언
    const [login, setLogin] = useState(
      {
        user_id : '',
        password : '',
        res : ''
      }
    )

    const navigate = useNavigate();

    // useEffect(() => {
    //   localStorage.setItem('user', JSON.stringify(login))
    // },[login])

    const clickLogin = () => {
      axios.post ('http://localhost:15000/pj02_01', {
        user_id : login.user_id,
        password : login.password 
      }).then((response) => {
        console.log(response) //서버에서 요청한 결과값 찍어오기!
        //로그인 한 회원정보 가져오기(데이터가 data에 저장되있어 그 데이터만 localstorage에 저장)
        localStorage.setItem('code', JSON.stringify(response.data.code))//JSON.stringify(response.data)
        localStorage.setItem('message', JSON.stringify(response.data.message))
        
        if (response.data.code === 'SUC_001'){
          localStorage.setItem('userid', JSON.stringify(response.data.result.USER_ID)) 
          localStorage.setItem('nickname', JSON.stringify(response.data.result.NICKNAME))
          alert('로그인 성공:)')
          navigate("/main")
        } else {
          alert('ID, PW를 다시 입력해주세요.')
          navigate("/")
        }
      }).catch((error) => {
        console.log(error)
      })
    }
 
  return (
      <div className='Login'>
        <h1 className='log-tit'>LOGIN</h1>
        <div className='control'>
          <div className='id-box'> I&nbsp; &nbsp;D
          <input type= 'text' onChange={e => setLogin({...login, user_id : e.target.value})} value={login.user_id} />
          </div>
          <div className='pw-box'> P W
            <input type= 'PASSWORD' onChange={e => setLogin({...login, password : e.target.value})} value={login.password} />
          </div>
        </div>
        <button className='login-btn'
          onClick={clickLogin}>
          LOGIN
        </button>
      </div>
    )
  }
  
  export default Login;
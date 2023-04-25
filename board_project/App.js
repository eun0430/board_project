//import logo from './logo.svg';react-hooks\rules-of-hooks
import React from "react";
import axios from "axios";
import { useState } from "react";
import './App.css';

function App() {
  const [indata, setIndata] = useState({
    userid : '', 
    password : '', 
    username : ''
  })

  const { userid, password, username } = indata;
  
  const insertD = (e) => {
    setIndata({ ...indata,
      userid : e.target.value, 
      password : e.target.value, 
      username : e.target.value });
  }

  // insert 이용하는 어쩌구 저쩌구
  const insert = () => {
    // const userid = document.getElementById('userid01').value
    // const password = document.getElementById('password01').value
    // const username = document.getElementById('username').value  
  
    axios.post('http://127.0.0.1:15000/pj01_01', {
        userid : userid,
        password : password,
        username : username
    }).then((response) => {
      console.log(response.data)
      let re1 = JSON.stringify(response.data)
      setIndata(re1)
    }).catch((error)=> {
        console.log(error)
    })
  }
    
  // select 이용하는 어쩌구 저쩌구
  const select = () => {
    const con = document.getElementById('conn').value
    console.log(con)
    axios.get('http://127.0.0.1:15000/pj01_02', {
      params : {
        conn : con
      }
    }).then((response) => {
      console.log(response)
      let re2 = response.data; 
      console.log(re2)
      document.getElementById('sel').innerText = JSON.stringify(re2);
  
    }).catch((error)=> {
        console.log(error)
    })
  }
  
  // update 이용하는 어쩌구 저쩌구
  const update = () => {
    const userid = document.getElementById('userid02').value
    const password = document.getElementById('password02').value
    const new_pw = document.getElementById('new_pw').value
  
    axios.post('http://127.0.0.1:15000/pj01_03', {
      userid : userid, 
      password : password,
      new_pw : new_pw
    })
    .then((response) => {
      console.log(response)
      let re3 = response.data; 
      console.log(re3)
      document.getElementById('upd').innerText = JSON.stringify(re3);
  
    }).catch((error)=> {
        console.log(error)
    })
  }
  
  // delete 이용하는 어쩌구 저쩌구
  const del = () => {
    const userid = document.getElementById('userid03').value
    const password = document.getElementById('password03').value
  
    axios.post('http://127.0.0.1:15000/pj01_04', {
      userid : userid, 
      password : password,
    })
    .then((response) => {
    console.log(response)
    let re4 = response.data; 
    console.log(re4)
    document.getElementById('dele').innerText = JSON.stringify(re4);
  
    }).catch((error)=> {
        console.log(error)
    })
  }

  return (
    <div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        아 이 디 <input id={"userid01"} onChange= {insertD} style ={{marginLeft:"26px"}}></input></div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        비 밀 번 호 <input id={"password01"} onChange= {insertD} type = 'password' style ={{marginLeft:"26px"}}></input></div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        사용자 이름 <input id={"username"} onChange= {insertD} style ={{marginLeft:"26px"}}></input></div>

      <button onClick={insert} style={{width:"100px", height:"30px", marginLeft:"370px", marginTop:"10px"}}>
        추가
      </button>
      

      <div>
        <text id = {'ins'} style = {{marginTop:"30px", marginLeft:"30px"}}> </text>
      </div>

      <br />

      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        조회할 회원 명 <input id={"conn"} style ={{marginLeft:"26px"}}></input></div>
      <button onClick={select} style={{width:"100px", height:"30px", marginLeft:"370px", marginTop:"10px"}}>
        조회
      </button>

      <div>
        <text id = {'sel'} style = {{marginTop:"30px", marginLeft:"30px"}}> </text>
      </div>

      <br />

      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        아 이 디 <input id={"userid02"} style ={{marginLeft:"26px"}}></input></div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        비 밀 번 호 <input id={"password02"} type = 'password' style ={{marginLeft:"26px"}}></input></div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        변경할 비밀번호 <input id={"new_pw"} type = 'password' style ={{marginLeft:"26px"}}></input></div>
      <button onClick={update} style={{width:"100px", height:"30px", marginLeft:"370px", marginTop:"10px"}}>
        업데이트
      </button>

      <div>
        <text id = {'upd'} style = {{marginTop:"30px", marginLeft:"30px"}}> </text>
      </div>

      <br />

      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        아 이 디 <input id={"userid03"} style ={{marginLeft:"26px"}}></input></div>
      <div style={{marginLeft:"10px", marginTop:"10px"}}>
        비 밀 번 호 <input id={"password03"} type = 'password' style ={{marginLeft:"26px"}}></input></div>
      <button onClick={del} style={{width:"100px", height:"30px", marginLeft:"370px", marginTop:"10px"}}>
        삭제
      </button>

      <div>
        <text id = {'dele'} style = {{marginTop:"30px", marginLeft:"30px"}}> </text>
      </div>

      <br />
    </div>
  )
  }
export default App;

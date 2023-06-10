import '../Rewrite.css';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Detail() {
    const navigate = useNavigate();

    //loaclStorage에 저장되어있는 필요한 친구들 불러오기!
    const nickname = localStorage.getItem('nickname');
    const board_id = localStorage.getItem('board_id');
    const title = localStorage.getItem('title');
    const content = localStorage.getItem('content');
    const indate = localStorage.getItem('indate');

    const [modifyIn, setModifyIn] = useState({ //수정한 내용 다시 적는 
        title : title,
        content : content
    })

    const [viewInput, setViewInput] = useState([]); //입력한 내용 저장하기 위해

    const modifyPost = () => { //수정하는 데이터베이스에 접근해 update!
        axios.post("http://localhost:15000/api/update", {
            board_id : board_id,
            title : modifyIn.title,
            content : modifyIn.content
        }).then((response)=> {
            setViewInput(response.data)
            localStorage.removeItem('board_id')
            localStorage.removeItem('title')
            localStorage.removeItem('indate')
            localStorage.removeItem('content')
            navigate("/main")
        })
    }

    const getValue = e =>{ // 데이터가 입력될 때, name/value 가지고 오기
        const { name, value } = e.target;
        // editIn 안의 내용을 복사해 name 이라는 이름의 키값을 value로 바꿔 저장
        setModifyIn({
            ...modifyIn,
            [name] : value
        })
        console.log(modifyIn);
    }

    const cansleModify = () =>{
        navigate(`/detail`)
    }

    const clickLogout = () => { // logout 버튼 눌렀을 때의 설정 
        navigate('/') // 로그인 하는 페이지로 이동
        localStorage.removeItem('userid') 
        localStorage.removeItem('nickname')
        localStorage.removeItem('board_id')
        localStorage.removeItem('title')
        localStorage.removeItem('indate')
        localStorage.removeItem('content') // localstorage에 저장되어있는 회원 정보 삭제
    }

    return(
        <div className='Rewrite'>

        <div className='header'>
                <h1 className='re-tit'> 게시글 수정 </h1>
                <h6 className='nickname'> {nickname}님 안녕하세요 </h6>
            
                {/* 로그아웃 버튼 설정 */}
                <button
                className='logout-btn'
                onClick={clickLogout}>
                    LOGOUT
                </button>      
        </div>

        <div className='post-wrapper'>
            <input className='title-input'
                type='text'
                placeholder='제목'  
                data = { modifyIn.title }
                onChange={getValue}
                name='title'
            />
            <button className='cansleBtn'
                onClick={cansleModify}>
                    취소
            </button>
            
            <button className='modifyBtn'
                onClick={modifyPost}>
                    수정하기
            </button>
            <CKEditor
                editor = {ClassicEditor}
                data = { modifyIn.content }
                onReady = { () => {
                    console.log('Editor is ready to use!');
                }}

                onChange = {(event, editor) => {
                    const data = editor.getData();
                    console.log({event, editor, data});
                    setModifyIn({
                        ...modifyIn,
                        content:data
                    })
                    console.log(modifyIn);
                }}
                // onBlur={(event, editor) => {
                //     console.log('Blur.', editor);
                // }}

                // onFocus={(event, editor) => {
                //     console.log('Focus.', editor);
                // }}
            />   
        </div>
    </div>
    )
}


export default Detail;
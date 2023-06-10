import '../Write.css';
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react'; //ckeditor 설치 후 import
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; //ckeditor 설치 후 import
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
import { useNavigate } from 'react-router';

function Write() {

    const navigate = useNavigate();

    const [postIn, setPostIn] = useState({ //useState를 이용해 입력한 내용을 저장하기 위함 제목, 내용의 변수 생성, 초기값은 null로
        title:'',
        content : ''
    })

    const userid = localStorage.getItem('userid'); 
    const nickname = localStorage.getItem('nickname');

    const [viewInput, setViewInput] = useState([]); //위의 postIn state에 저장된 내용을 화면에 보여주고자 하는 변수
    
    useEffect(() => { //데이터베이스에서 데이터 조회하는데 사용
        axios.post("http://localhost:15000/api/get",{ 

        }).then((response)=> { //그에 대한 응답 콘솔로 찍어옴
            console.log(response)
            setViewInput(response.data); //받아온 데이터 빈 배열인 state에 저장
        })
    }, []) //[]에 두번째 인자로 빈 배열을 주면 처음 들어갈 때 1번만 래더링 되어 이후에 데이터를 다시 불러오지 않음

    const submitPost = () => { //서버로 내용을 전송하고자 하는 함수
        axios.post ("http://localhost:15000/api/insert", { //서버쪽에서 지정한 포트에서 통신하기 위해 주소 제대로 적어야 함!
            title : postIn.title, //저장된 title 값을 불러옴
            content : postIn.content, // 위와 동일
            user_id : userid,
            nickname : nickname
            }).then((response) => {
            console.log(response)
            if (postIn.title===null && postIn.content===null){
                alert('게시글을 입력해주세요.')
            }else {
                alert('게시글이 작성되었습니다.')
                navigate("/main")
            }
        })
    };

    const getValue = e =>{ // 데이터가 입력될 때, 그 값을 저장해주고자 하는 함수
        //이벤트(입력해 데이터가 변하는 상황 의미)가 발생되면 이벤트의 name, value를 가져옴
        const { name, value } = e.target;
        // postIn 안의 내용을 복사해 name 이라는 이름의 키값을 value로 바꿔 저장
        setPostIn({
            ...postIn,
            [name] : value
        })
        console.log(postIn);
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

    const cansleModify = () =>{
        navigate(`/main`)
    }

    return (
        <div className='Write'>
            <div className='header'>
            <h1 className='wri-tit'> 게시글 작성 </h1>
                <h6 className='nickname'> {nickname}님 안녕하세요 </h6>
            
                {/* 로그아웃 버튼 설정 */}
                <button
                className='logout-btn'
                onClick={clickLogout}>
                    LOGOUT
                </button>      
            </div>
            

            <div className='post-wrapper'>
                <div>
                <input className='title-input'
                    type='text' 
                    placeholder='제목' 
                    onChange={getValue}
                    name='title'
                />
                <button className='cansleBtn'
                onClick={cansleModify}>
                    취소
                </button>
                <button className='subBtn'
                onClick={submitPost}> {/*입력이라는 버튼이 눌리면 배열에 내용을 추가*/}
                    게시하기
                </button>
                </div>
                <CKEditor // 내용 입력하는 에디터 설정
                    editor = {ClassicEditor}
                    config={
                        {placeholder: "내용을 입력하세요."}
                    }
                    onReady = { () => {
                        console.log('Editor is ready to use!');
                    }}

                    onChange = {(event, editor) => {
                        const data = editor.getData();
                        console.log({event, editor, data});
                        setPostIn({
                            ...postIn,
                            content:data //기본적으로  data에 값이 입력되는데 그 값을 content로 변경해주는 코드
                        })
                        console.log(postIn);
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

export default Write;
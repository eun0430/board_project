import '../Detail.css';
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

function Detail() {

    const navigate = useNavigate();

    //loaclStorage에 저장되어있는 닉네임 불러오기!
    const nickname = localStorage.getItem('nickname');
    const userid = localStorage.getItem('userid');
    let code = localStorage.getItem('code')
    const board_id = localStorage.getItem('board_id')
    const title = localStorage.getItem('title')
    const content = localStorage.getItem('content')
    const indate = localStorage.getItem('indate')

    //입력한 내용 저장하기 위해
    const [viewInput, setViewInput] = useState([]);

    // 입력한 댓글 내용
    const [comm, setComm] = useState("");
    const [commentList, setCommentList] = useState([]);

    useEffect(() => { //데이터 베이스에서 board_id 이용해 데이터 조회
        axios.post("http://localhost:15000/api/detailGet",{

        }).then((response)=> {
            setViewInput(response.data)
        })
    }, [])

    // 서버로 댓글 데이터 전송해 저장하고자 함
    const submitComment =  () => {
        axios.post("http://localhost:15000/incomment", {
            board_id : board_id,
            comm : comm,
            user_id : userid,
            nickname : nickname
        }).then((response) => {
            console.log(response)
            if (comm ===null || comm === undefined) {
                alert('댓글을 읽을수가 없습니다.')
            } else {
                alert('댓글 입력 완료')
                navigate("/detail")
            }
        })
        
    }  
    const saveComm = e => {
        const {name, value } = e.target;
        setComm({
            ...comm,
            [name] : value
        })
        console.log(comm);
    }

    //수정하기 버튼 눌렀을 때의 설정
    const clickRewrite = () => {
        axios.post('http://localhost:15000/api/checkuser', {
            user_id : userid,
            board_id : board_id
        }).then((response) => {
            localStorage.setItem('code', JSON.stringify(response.data.code))
            if(response.data.code === 'SUC_00'){
                navigate(`/rewrite/${board_id}`)
            } else {
                alert('작성자만 삭제할 수 있습니다.')
            }
        })
        
        // localStorage.getItem('id')
    }

    // logout 버튼 눌렀을 때의 설정
    const clickLogout = () => {  
        navigate('/') // 로그인 하는 페이지로 이동
        localStorage.removeItem('userid', 'nickname') // localstorage에 저장되어있는 회원 정보 삭제
    }
    
    // 목록보기 버튼 눌렀을 때 가지고 온 정보 다 지워버리기
    const tolist = () => {
        localStorage.removeItem('board_id')
        localStorage.removeItem('title')
        localStorage.removeItem('indate')
        localStorage.removeItem('content')
        navigate(`/main`)
    }

    //게시글 삭제버튼 눌렀을 때의 코드
    const deleteData = () => {
        localStorage.removeItem('code')
        axios.post('http://localhost:15000/api/delete', {
            user_id : userid,
            board_id : board_id
        }).then((response) => {
            localStorage.setItem('code', JSON.stringify(response.data.code))
            if(response.data.code === 'SUC_006'){
                alert('게시글이 삭제되었습니다')
                navigate(`/main`)
            } else if (response.data.code === 'ERR_117') {
                alert('작성자만 삭제할 수 있습니다.')
            }
        })
    }

    const addComm = () => {
        localStorage.setItem('comm', JSON.stringify(comm))
        navigate(`/detail`)
    }

    return (
        <div className='Detail'>
            <div className='header'>
                <h1 className='detail-tit'> 게시글 상세 정보 </h1>
                <h6 className='nickname'> {nickname}님 안녕하세요 </h6>
            
                {/* 로그아웃 버튼 설정 */}
                <button
                className='logout-btn'
                onClick={clickLogout}>
                    LOGOUT
                </button>      
            </div>

            <table className='detail-table'>
                <tr>
                    <td className='t-tit'>게시글 번호</td>
                    <td className='t-data'>{board_id}</td>
                </tr>
                
                <tr>
                    <td className='t-tit'>제목</td>
                    <td className='t-data'>{title}</td>
                </tr>
                
                <tr>
                    <td className='t-tit'>작성일</td>
                    <td className='t-data'>{indate}</td>
                </tr>
                
                <tr>
                    <td className='t-tit'>내용</td>
                    <td className='t-data'>{ReactHtmlParser(content)}</td>
                </tr>
            </table>

            <div className='btn-group'>
            <button 
            className='tolist-btn'
            onClick={tolist}>
                목록으로
            </button>

            <button 
            className='rewrite-btn'
            onClick={clickRewrite}>
                수정하기
            </button>

            <button 
            className='delete-btn'
            onClick={deleteData}>
                삭제하기
            </button>

            </div>
            <hr className='de-hr'/>
            <div className='comm-wrapper'>
                <div>
                    <input className='comm-input'
                        type='text' 
                        placeholder='댓글을 입력해주세요' 
                        onChange={saveComm}
                        name='title'
                    />
                    <button className='addcomm-btn'
                    onClick={addComm}>
                        등록
                    </button>
                </div>
            </div>
        </div>
    )
    }

export default Detail;
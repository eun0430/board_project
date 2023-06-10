import '../Main.css';
import {useNavigate} from 'react-router';
import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import axios from 'axios';
// import LoadingIcon from '../loading.gif';
import Spinner from '../Spinner';

function Main() {
    const navigate = useNavigate();
    // state 변수 선언
    //위의 postIn state에 저장된 내용을 화면에 보여주고자 하는 변수
    const [viewInput, setViewInput] = useState([]); 
    //로딩화면 구성할때 필요한 변수 선언 처음 값을 true로 설정에 바로 로딩화면 뜨게 함
    const [loading, setLoading] = useState(true);
    //상위 게시물 3개 불러오는거 저장 
    const [topView, setTopView] = useState([]);

    // localstorage에 저장해놓은 회원정보 가져옴
    const userid = localStorage.getItem('userid'); 
    const nickname = localStorage.getItem('nickname');
    
    useEffect(() => {
        //서버에 요청을 보낸 후
        axios.post("http://localhost:15000/api/get", 
            
        ).then((response)=> { //그에 대한 응답 콘솔로 찍어옴
            setViewInput(response.data)// setViewInput을 통해 viewInput에 결과 저장
            setLoading(false) //로딩이 끝났을 시 로딩화면을 끄고 현재 페이지로 복귀
        })
    }, [])

    // useEffect(() => {
    //     //서버에 요청을 보낸 후
    //     axios.post("http://localhost:15000/api/topBoard", 
            
    //     ).then((response)=> { //그에 대한 응답 콘솔로 찍어옴
    //         setTopView(response.data)// setViewInput을 통해 viewInput에 결과 저장
    //     })
    // }, [])

    // viewInput에 어떤 형식으로 값이 저장되어 있는지 확인하고자 함
    // (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}] > 이런식으로 찍힘... board_id 불러와?

    const clickWrite = () => { // write 버튼 눌렀을 때의 설정
        navigate('/write')
    }

    const clickLogout = () => { // logout 버튼 눌렀을 때의 설정 
        navigate('/') // 로그인 하는 페이지로 이동
        localStorage.removeItem('userid') 
        localStorage.removeItem('nickname')
        localStorage.removeItem('board_id')
        localStorage.removeItem('title')
        localStorage.removeItem('indate')
        localStorage.removeItem('content')// localstorage에 저장되어있는 회원 정보 삭제
    }

    // // state 변수 선언
    // const [Bid, setBid] = useState({
    //     b_id : ''
    // });

    const clickDetail = () => { 

    }

    // const inquery = () => {
    //     axios.post ('http://localhost:15000/api/detailGet', {
    //         board_id : Bid.b_id
    //     }).then((response) => {
    //         console.log(response)
    //         // localStorage.setItem('board_id', JSON.stringify(response.data.result.BOARD_ID))
    //         // localStorage.setItem('title', JSON.stringify(response.data.result.TITLE))//JSON.stringify(response.data)
    //         // localStorage.setItem('indate', JSON.stringify(response.data.result.INSERT_DATETIME))
    //         // localStorage.setItem('content', JSON.stringify(response.data.result.CONTENT)) 
    //         if (response.data.code === 'SUC_004') {
    //             alert('게시글이 조회되었습니다')
    //             navigate(`/detail`)
    //         } else if (response.data.code === 'ERR_109') {
    //             alert('게시글 번호를 다시 입력해주세요')
    //         }
    //     })
    // }
    return (  
        <div className='Main'>  
            <div className='header'>
                <h1 className='main-tit'> Board List </h1>
                <h6 className='nickname'> {nickname}님 안녕하세요 </h6>
            
                {/* 로그아웃 버튼 설정 */}
                <button
                className='logout-btn'
                onClick={clickLogout}>
                    LOGOUT
                </button>      
            </div>
            <div className='post-container'>
                <div className='menu'>  
                    <h2 className='list'> POST LIST </h2>
                    <button
                    className='write-btn'
                    onClick={clickWrite}>
                        WRITE POST
                    </button>
                </div>
                <hr />
                {/* <div>
                    <label> 게시글 조회하기 </label>
                    <label>
                    <input type= 'text' onChange={e => setBid({...Bid, b_id : e.target.value})} value={Bid.b_id} />  
                    </label>
                    <button onClick={inquery}>
                        조회하기
                    </button>
                </div>   */}
                {/* <table className='top-table'>
                    <tr>
                        <th className='m-th'>no <hr /> </th>
                        <th className='m-th'>title <hr /> </th>
                        <th className='m-th'>작성자 <hr /> </th>
                        <th className='m-th'>날짜 <hr /> </th>
                    </tr>
                    {topView.map(ele => 
                    <tr>
                    <td className='m-td'> {ele.BOARD_ID} </td>
                    <td className='m-td' onClick={ () => clickDetail (navigate(`/detail`),
                    localStorage.setItem('board_id', JSON.stringify(ele.BOARD_ID)),
                    localStorage.setItem('title', JSON.stringify(ele.TITLE)),
                    localStorage.setItem('indate', JSON.stringify(ele.INSERT_TIME)),
                    ele                    )}> 
                        {ele.TITLE}
                    </td>
                    <td className='m-td'> {ele.NICKNAME} </td>
                    <td className='m-td'> {ele.INSERT_TIME} </td>
                </tr>
                )}
                </table> */}
                {/* 로딩화면 구현할 때 loading 하고 있으면 ? <Spinner />에 있는 사진을
                loading 끝나면 : 모든 데이터 맵 함수를 이용해 한행씩 불러오기 */}
                <table className='main-table'>
                    <tr>
                    <th className='m-th'>no <hr /> </th>
                    <th className='m-th'>title <hr /> </th>
                    <th className='m-th'>작성자 <hr /> </th>
                    <th className='m-th'>날짜 <hr /> </th>
                    </tr>
                    
                { loading ? <td colSpan={4}><Spinner /></td> :
                
                (viewInput.map(element => 
                    <tr>
                    <td className='m-td'> {element.BOARD_ID} </td>
                    <td className='link' onClick={ () => clickDetail (navigate(`/detail`),
                    localStorage.setItem('board_id', JSON.stringify(element.BOARD_ID)),
                    localStorage.setItem('title', JSON.stringify(element.TITLE)),
                    localStorage.setItem('indate', JSON.stringify(element.INSERT_TIME)),
                    localStorage.setItem('content', JSON.stringify(element.CONTENT))
                    )}> 
                        {element.TITLE}
                    </td>
                    <td className='m-td'> {element.NICKNAME} </td>
                    <td className='m-td'> {element.INSERT_TIME} </td>
                </tr>
                ))} 
    
                </table>
                    
            </div>
        </div>  
    )
}

export default Main;
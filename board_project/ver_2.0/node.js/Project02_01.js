const express = require('express')
const app = express()
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');


//서버 포트 설정하기! 15000번 포트로 express 서버를 오픈하겠다는 의미
const server = app.listen(15000, () => {
    console.log('server start, port 15000')
})

// react에서 이용하기 위해 설정
// cors = 클라이언트 애플리케이션과 다른 origin을 가진 서버 애플리케이션이 서로 통신할 수 있도록 허용하는 프로토콜
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));


// datebase와 연결하기 위해 oracledb설치 및 라이브러리 지정
const oracledb = require('oracledb');
const { response } = require('express');
oracledb.initOracleClient({libDir:"./instantclient_21_6"})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT


//로그인 하는 코드
async function logDB(req, res) {
    let conn
    let user_id = req.body.user_id
    let password = req.body.password
    let sql = `SELECT * FROM USER_DATA WHERE `
    console.log(user_id, password)

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })

        if (user_id!=undefined) {
            sql += `USER_ID = '${user_id}' AND `
            
            if (password!=undefined) {
                sql += `PASSWORD = '${password}'`
                
                const result = await conn.execute(`${sql}`)
                console.log(result)
                
                if (result.rows != 0) {
                    // res.json({"code" : "SUC_001", "message" : "로그인 성공", "ureser_id" : result.rows[0].USER_ID, "nickname" : result.rows[0].NICKNAME})
                    res.json({"code" : "SUC_001", "message" : "로그인 성공", "result" : result.rows[0]})
                } else {
                    res.json({"code" : "ERR_102", "message" : "조회된 데이터 없음"})
                }

            }

        } else {
            // res.write("<script> alert('id 입력 오류') </script>")
            sql = ''
            res.json({"code" : "ERR_101", "message" : "존재하지 않는 ID"})
        }
        
    } catch (error) {
        console.log("select "+error.message)
    }
}

app.post('/pj02_01', function(req, res){
    logDB(req, res)
    // localStorage.setItem('user', JSON.stringify(res))
})


// DB에 게시글 내용 저장하는 코드
async function inBoardDB (req, res) {
    let conn

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        // db에서 이용할 변수 지정 'db 변수명' = req.body.'write에서 전달받은 변수명'
        let user_id = req.body.user_id
        let title = req.body.title
        let content  = req.body.content 
        let nickname = req.body.nickname
        let sql = ``

        sql = `INSERT into BOARD_DATA (board_id, user_id, nickname, title, content, insert_time)
        VALUES (BOARD_SEQ.NEXTVAL,'${user_id}', '${nickname}', '${title}', '${content}', (TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')))`

        // sql = `INSERT into BOARD_DATA (board_id, title, content, insert_time)
        // VALUES (BOARD_SEQ.NEXTVAL, '${title}', '${content}', (TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')))`

        console.log(sql) //s ql문이 제대로 입력되었는가 확인
        oracledb.autoCommit = true //autoCommit 켜놓음

        const result = await conn.execute(sql) //작성한 sql문 실행

        oracledb.autoCommit = false //실행 완료 후 autoCommit 다시 끔
        res.json({"code" : "SUC_002", "message" : "글 저장 완료"}) // 성공했다는 메시지 전송 
    } catch(err) {
        console.log(err)
        res.json({"code" : "ERR_103", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_104", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/insert", (req, res) => {
    console.log(req.query)

    if (req.body.title == undefined) { //요청받은 데이터가 없을 경우 각각 에러처리 > 오류 메시지 출력
        res.json({"code" : "ERR_105", "message" : "제목을 작성해주세요."}) 
    } else if (req.body.content == undefined) {
        res.json({"code" : "ERR_106", "MESSAGE": "내용을 작성해주세요."})
    } else {
        inBoardDB(req, res) // 먼저 변수에 대한 조건을 걸어준 후 둘 다 데이터가 요청되면 위의 함수 불러와 실행
    }   
})


//저장한 값 불러오는 코드(mainpage목록 불러오기 위한 작업) 
async function getDB(req, res) {
    let conn

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        // 사용자가 요청했을 때 게시글을 목록 형태로 최신 글부터 조회하고자 함 > 전체 출력
        const sql = "SELECT * FROM BOARD_DATA ORDER BY BOARD_ID desc"
    
        const result = await conn.execute(sql) //바로 sql문 실행
        // res.json({"result" : result.rows})
        res.send(result.rows)
        console.log(result)

    } catch (err) {
        console.log(err)
        res.json({"code" : "ERR_107", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_108", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/get", (req, res) => { //db의 내용을 가지고 오고자 함
    console.log(req.query) 
    getDB(req, res) 
})


//Board_id 이용해 글 불러오기! (detail 페이지에서 사용)
async function detailDB(req, res) {
    let conn
    let board_id = req.body.board_id //보드 아이디 우선 내가 입력해보는걸로~~
    let sql = `SELECT BOARD_ID, TITLE, CONTENT, INSERT_TIME FROM BOARD_DATA WHERE BOARD_ID = `
    console.log(board_id)

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        
        if (board_id != undefined || board_id != null) {
            sql += `'${board_id}'`
            console.log(sql)

            const result = await conn.execute(`${sql}`)
            
            console.log(result)

            if (result.rows != 0) {
                res.json({"code" : "SUC_004", "message" : "조회성공", "result" : result.rows[0]})
            } else {
                res.json({"code" : "ERR_109", "message" : "조회된 데이터 없음"})
            }
            // res.send(result.rows)
        } else {
            sql=''
            res.json({"code" : "ERR_110", "message" : "존재하지 않는 게시글 번호"})
        }

    } catch (err) {
        console.log(err)
        res.json({"code" : "ERR_111", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_112", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/detailGet", (req, res) => {
    console.log(req.query)
    detailDB(req, res) 
})

// 게시글 수정하기 전 작성자가 맞는지 확인하는 코드
async function checkUser (req, res) {
    let conn
    let board_id = req.body.board_id
    let user_id = req.body.user_id
    let sql = `SELECT * FROM BOARD_DATA WHERE BOARD_ID = '${board_id}' AND USER_ID = '${user_id}'`

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        const result = await conn.execute(`${sql}`)

        console.log(result)

        if (result.rows === 1) {
            res.json({"code" : "SUC_008", "message" : "작성자 일치"})
        } else {
            res.json({"code" : "ERR_130", "message" : "작성자와 일치하지 않음"})
        }
    } catch (err) {
        console.log(err)
        res.json({"code" : "ERR_131", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_132", "message" : err.message}) 
            }
        }
    }
}  

app.post("/api/checkuser", (req, res) => {
    console.log(req.query)
    checkUser(req, res) 
})

// 게시글 수정한거 update하는 코드
async function updateDB (req, res) {
    let conn

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        let board_id = req.body.board_id
        let title = req.body.title
        let content  = req.body.content 
        let sql = ``

        sql = `UPDATE BOARD_DATA SET title = '${title}', content = '${content}' WHERE board_id = '${board_id}'`
        console.log(sql) //s ql문이 제대로 입력되었는가 확인
        oracledb.autoCommit = true //autoCommit 켜놓음

        const result = await conn.execute(sql) //작성한 sql문 실행

        oracledb.autoCommit = false //실행 완료 후 autoCommit 다시 끔
        res.json({"code" : "SUC_005", "message" : "글 수정 완료"})
    } catch(err) {
        console.log(err)
        res.json({"code" : "ERR_113", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_114", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/update", (req, res) => {
    console.log(req.query)

    if (req.body.title == undefined) { //요청받은 데이터가 없을 경우 각각 에러처리 > 오류 메시지 출력
        res.json({"code" : "ERR_115", "message" : "제목을 작성해주세요."}) 
    } else if (req.body.content == undefined) {
        res.json({"code" : "ERR_116", "MESSAGE": "내용을 작성해주세요."})
    } else {
        updateDB(req, res) // 먼저 변수에 대한 조건을 걸어준 후 둘 다 데이터가 요청되면 위의 함수 불러와 실행
    }   
})


// 게시글 삭제하는 코드
async function deleteDB (req, res) {
    let conn

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        let user_id = req.body.user_id
        let board_id = req.body.board_id
        let sql = ``
        
        // let userid = `SUBSTR(user_id, 2, 3)`
        console.log(user_id, board_id)
        sql = `DELETE FROM BOARD_DATA WHERE BOARD_ID = '${board_id}' AND USER_ID = '${user_id}'`
        console.log(sql) //sql문이 제대로 입력되었는가 확인
        oracledb.autoCommit = true //autoCommit 켜놓음

        const result = await conn.execute(sql) //작성한 sql문 실행

        oracledb.autoCommit = false //실행 완료 후 autoCommit 다시 끔
        if (result.rows === 1){
            res.json({"code" : "SUC_006", "message" : "글 삭제 완료"})
        } else if (result.rows === 0) {
            res.json({"code" : "ERR_117", "message" : "조회된 데이터 없음"})
        } 
    } catch(err) {
        console.log(err)
        res.json({"code" : "ERR_118", "message" : "회원정보가 일치하지 않음"})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_119", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/delete", (req, res) => {
    console.log(req.query)

    if (req.body.user_id == undefined || req.body.board_id == undefined) { //요청받은 데이터가 없을 경우 각각 에러처리 > 오류 메시지 출력
        res.json({"code" : "ERR_119", "message" : "데이터가 입력되지 않았습니다."}) 
    } else if (req.body.user_id == null || req.body.board_id == null) {
        res.json({"code" : "ERR_120", "MESSAGE": "데이터가 입력되지 않았습니다."})
    } else {
        deleteDB(req, res) // 먼저 변수에 대한 조건을 걸어준 후 둘 다 데이터가 요청되면 위의 함수 불러와 실행
    }   
})


// 댓글 관련 코드
async function inCommentDB (req, res) {
    let conn

    try {
        conn = await oracledb.getConnection({
            user                : 'HAEUN',
            password            : 'haeun0000',
            connectionString    : 'HAEUN'
        })
        // db에서 이용할 변수 지정 'db 변수명' = req.body.'write에서 전달받은 변수명'
        let user_id = req.body.user_id
        let nickname = req.body.nickname
        let comment = req.body.comm
        let sql = ``

        sql = 
        `INSERT INTO COMMENT_DATA(comment_id, user_id, nickname, content, insert_time)
        VALUES (BOARD_SEQ.NEXTVAL,'${user_id}', '${nickname}', '${comment}', (TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')))`
    
        console.log(sql) //s ql문이 제대로 입력되었는가 확인
        oracledb.autoCommit = true //autoCommit 켜놓음

        const result = await conn.execute(sql) //작성한 sql문 실행

        oracledb.autoCommit = false //실행 완료 후 autoCommit 다시 끔
        res.json({"code" : "SUC_007", "message" : "댓글 저장 완료"}) // 성공했다는 메시지 전송 
    } catch(err) {
        console.log(err)
        res.json({"code" : "ERR_123", "message" : err.message})
    } finally {
        if(conn) {
            try {
                await conn.close()
            } catch (err) {
                console.log(err)
                res.json({"code" : "ERR_124", "message" : err.message}) 
            }
        }
    }
}

app.post("/api/incomment", (req, res) => {
    console.log(req.query) 

    if (req.body.comm === undefined || req.body.comm === null) { //요청받은 데이터가 없을 경우 각각 에러처리 > 오류 메시지 출력
        res.json({"code" : "ERR_125", "message" : "댓글 입력되지 않음"}) 
    } else {
        inCommentDB(req, res) // 먼저 변수에 대한 조건을 걸어준 후 둘 다 데이터가 요청되면 위의 함수 불러와 실행
    }
})


//조회수가 제일 높은 게시물 3개 조회하는 코드
// async function topBoard(req, res) {
//     let conn

//     try {
//         conn = await oracledb.getConnection({
//             user                : 'HAEUN',
//             password            : 'haeun0000',
//             connectionString    : 'HAEUN'
//         })
//         const sql =
//         "SELECT board_id, title, insert_time FROM (SELECT board_id, title, insert_time FROM BOARD_DATA ORDER BY B_RECOMMEND desc) WHERE rownum <=3;"

//         const result = await conn.execute(sql) //바로 sql문 실행
//         // res.json({"result" : result.rows})
//         res.send(result.rows)
//         console.log(result)
//     } catch (err) {
//         console.log(err)
//         res.json({"code" : "ERR_121", "message" : err.message})
//     } finally {
//         if(conn) {
//             try {
//                 await conn.close()
//             } catch (err) {
//                 console.log(err)
//                 res.json({"code" : "ERR_122", "message" : err.message}) 
//             }
//         }
//     }
// }

// app.post("/api/topBoard", (req, res) => {
//     console.log(req.query) 
//     topBoard(req, res)
// })

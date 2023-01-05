const express = require('express')
const app = express()

// react에서 이용하기 위해 설정해놓음!
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 서버 설정하기!
const server = app.listen(15000, () => {
    console.log('server start, port 15000')
})


// datebase와 연결하기 위해 oracledb설치 및 라이브러리 지정
const oracledb = require('oracledb')
oracledb.initOracleClient({libDir:"./instantclient_21_6"})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

//필요한 변수들 설정!


// insert문 이용해 회원 추가하는 코드
async function getDB(req, res) {
    let connection
    let userid= req.body.userid
    let password = req.body.password
    let username = req.body.username

    console.log(userid, password, username)

    try {
        connection = await oracledb.getConnection({
            user            : 'HAEUN',
            password        : 'haeun0000', 
            connectString   : 'HAEUN'
        })
        if (userid == undefined || password == undefined || username == undefined) {
            res.json({"code" : "ERR_100", "message" : "데이터를 정확히 입력해주세요:("})
        }else {

            const result = await connection.execute(
                `INSERT INTO PROGRAM_USER (USER_ID, PASSWORD, USER_NAME, INSERT_DATETIME)
                VALUES ('${userid}', '${password}', '${username}', (to_char(sysdate, 'yyyy.mm.dd')))`
            )
            await connection.commit()

            console.log(result)
            res.json({"code" : "SUC_000", "message" : "데이터 삽입 완료:)"})

        }
    } catch (error) {
        let err = error
        console.log(err)
        res.json({"code" : "ERR_101", "message" : err.message})
    }
}

app.post('/pj01_01', function(req, res){
    getDB(req, res)
})

// select문을 이용해 회원 이름 검색하는 코드
async function inDB(req, res) {
    let connection
    let con = req.query['conn']
    let where = `WHERE USER_NAME like `

    console.log(con)

    try {
        connection = await oracledb.getConnection({
            user            : 'HAEUN',
            password        : 'haeun0000', 
            connectString   : 'HAEUN'
        })


        if (con != undefined) { // con != null 일경우가 실행이 안됨.
            where += `'%${con}%'`
        } else {
            where = "";
        } 

        console.log(`SELECT * FROM PROGRAM_USER '${where}'`)

        const rs = await connection.execute(
            `SELECT * FROM PROGRAM_USER ${where}`
        )
            console.log(rs)
        res.json(rs.rows)

    } catch (error) {
        err = error
        console.log ("select "+err.message)
    } 
}

app.get('/pj01_02', function(req, res){
    inDB(req, res)
})

// update문을 이용해 비밀번호 변경하는 코드
async function upDB(req, res) {
    let connection
    let userid= req.body.userid
    let password = req.body.password
    let new_pw = req.body.new_pw
    let con = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/
    
    console.log(userid, password, new_pw)

    try {
        connection = await oracledb.getConnection({
            user            : 'HAEUN',
            password        : 'haeun0000', 
            connectString   : 'HAEUN'
        })

        if (!con.test(new_pw)) {
            res.json({"code" : "ERR_102", "message" : "영어, 숫자, 특수문자를  1개씩 사용하여 10자리 이상의 비밀번호로 설정하세요:("})
        } else {
            const result = await connection.execute(
                `UPDATE PROGRAM_USER
                SET PASSWORD = '${new_pw}'
                WHERE USER_ID = '${userid}' AND PASSWORD = '${password}'` 
            )
  
            console.log(result)

            if(result.rowsAffected == 1 ) {
                await connection.commit()
                res.json({"code" : "SUC_001", "messages" : "비밀번호 변경 완료:)"})
            } else if (result.rowsAffected == 0) {
                res.json({"code" : "ERR_103", "messages" : "id, pw가 일치하지 않음:("})
            }  else {
                res.json({"code" : "ERR_104", "messages" : "중복 데이터 존재 > 변경 불가:("})
            }
        }
    } catch (error) {
        let err = error
        console.log(error)
        res.json({"code" : "ERR_105", "message" : err.message}) 
    }
}

app.post('/pj01_03', function(req, res){
    upDB(req, res)
})

// delete문을 이용해 회원정보를 삭제하는 코드
async function deDB(req, res) {
    let connection
    let userid = req.body.userid
    let password = req.body.password
    console.log(userid, password)
    try {
        connection = await oracledb.getConnection({
            user            : 'HAEUN',
            password        : 'haeun0000', 
            connectString   : 'HAEUN'
        })
        try {
            const result = await connection.execute(
                `DELETE FROM PROGRAM_USER WHERE USER_ID = '${userid}' AND PASSWORD = '${password}'`
            )
            console.log(result)

            if(result.rowsAffected == 1 ) {
                await connection.commit()
                res.json({"code" : "SUC_002", "messages" : "회원정보 삭제 완료:)"})
            } else if (result.rowsAffected == 0) {
                res.json({"code" : "ERR_106", "messages" : "id, pw가 일치하지 않음:("})
            }  else {
                res.json({"code" : "ERR_107", "messages" : "중복 데이터 존재 > 삭제 불가:("})
            }
                        
        } catch (error) {
            err = error
            console.log ("select "+err)
            res.json({"code" : "ERR_108", "message" : err.message})
        }
    } catch (error) {
        err = error
        console.log ("select "+err.message)
        res.json({"code" : "ERR_109", "message" : err.message})
    }
}

app.post('/pj01_04', function(req, res){
    deDB(req, res)
})
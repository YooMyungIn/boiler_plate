const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')

//application/x-www-form-urlencoded 파일 가져오기 위함
app.use(express.urlencoded({extends:true}))
//application/json 파일 가져오기 위함
app.use(express.json())


//require가 import라고 보면 된다
const {User} = require("./models/User")
const mongoose = require('mongoose')
const config = require('./config/key')



mongoose
.connect(config.mongoURI,{})
.then(()=>console.log('MongoDB Connected!!'))
.catch(err => console.log(err))

//몽고DB 연결완료



//간단한 형태의 route
app.get('/', (req, res) => {
  res.send('Hello World!')
}) 

app.post('/register',(req,res) => {
    //회원가입에 필요한 정보들 client에서 가져오면
    //DB에 저장하는 기능

    
    
    const user = new User(req.body)

    user.save((err,userInfo) =>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success : true
        })
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
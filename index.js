const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookiePaser = require('cookie-parser')
const {auth} = require('./middleware/auth')



//application/x-www-form-urlencoded 파일 가져오기 위함
app.use(express.urlencoded({extends:true}))
//application/json 파일 가져오기 위함
app.use(express.json())

app.use(cookiePaser())


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

//registe route
app.post('/api/user/register',(req,res) => {
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

app.post('/api/user/login',(req,res)=> {
    //로그인 기능
    
    //1.요청된 Email DB에서 검색

    User.findOne({email : req.body.email}, (err,user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message : "해당하는 유저가 없습니다."
            })
        }
        //2.요청한 Email이 있다면, Password가 맞는지 확인한다

        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다"})

         //3.확인이 됐다면 token을 생성해서 돌려준다.
            user.generageToken((err,user)=>{
                if(err) return res.status(400).send(err);
                
                //토큰을 저장한다. 어디? -> 쿠키 or 로컬스토리지 등이 있으나 여기선 쿠기로 한다
                
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess : true, userId : user._id})


            })


        })

    })

})


app.get('/api/user/auth',auth,(req,res)=>{

    //여기까지 들어오면 Auth가 True라는 뜻
    res.status(200).json({
        _id:req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.email,
        name: req.user.name,
        lastname : req.user.lastname,
        role:req.user.role,
        image:req,user,image

    })

})

app.get('/api/user/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id : req.user._id},{token : ""},(err,user)=>{
        if(err) return res.json({success : false,err});
        return res.status(200).send({
            success : true
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
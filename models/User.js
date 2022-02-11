const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlenth : 20

    },
    email : {
        type : String,
        trim : true,//공백제거
        unique : 1
    },
    password : {
        type : String,
        minlenth : 5

    },
    role : {
        type : Number,
        default : 0

    },
    Image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }

})

//save하기 전에 특정 작동을 하도록 할 수 있는 구문
userSchema.pre('save',function(next){
    //비밀번호 암호화
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)

                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword와 암호화된 Password를 같은지 체크 하는법
    //복호화 하는 방식은 불가능, 들어온 비밀번호를 같이 암호화해서 같은지 체크해야함
    
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })

}

userSchema.methods.generageToken = function(cb) {

    //jsonwebtoken 이용해 token 이용하기
    var user = this
    var token = jwt.sign(user._id.toHexString(), '1234')


    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })


}

userSchema.statics.findByToken = function(token,cb)
{
    var user = this;
     
    jwt.verify(token,'1234',function(err,decoded)
    {   
        //유저 아이디를 이용해 유저를 찾고
        //클라이언트에서 가져온 토큰과 일치하는지 확인
        user.findOne({"_id": decoded,"token": token}, function(err,user)
        {
            if(err) return cb(err);
            cb(null,user)

        })
    })
}
const User = mongoose.model('User',userSchema)

module.exports = {User}
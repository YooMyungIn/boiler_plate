const mongoose = require('mongoose')

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

const User = mongoose.model('User',userSchema)

module.exports = {User}
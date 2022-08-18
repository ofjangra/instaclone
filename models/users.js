const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')


const JWTKEY = process.env.JWTKEY

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})


mongoose.model('User', userSchema)


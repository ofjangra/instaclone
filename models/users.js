const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
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
    name:String,
    photo_url:String,
    bio:String,
    website:String
})


mongoose.model('User', userSchema)


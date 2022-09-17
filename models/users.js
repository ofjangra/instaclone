const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


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
    website:String,
    followers:[
        {
            type:ObjectId,
            ref:"User"
        }
    ],
    followings:[
        {
            type:ObjectId,
            ref:"User"
        }
    ]
})


mongoose.model('User', userSchema)


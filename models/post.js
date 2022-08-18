const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const postSchema = new mongoose.Schema({
 
    caption:{
        type:String,
        default:""
    },
    imageurl:{
        type:String,
        required:true,
    },
    postedBy:{
        type:String,
        ref:"User"
    }
})

mongoose.model("Post", postSchema)
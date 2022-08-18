const express = require('express')

const mongoose = require('mongoose')

const Post = mongoose.model("Post")

const requirelogin = require('../middleware/requirelogin')

const router = express.Router()

const User = mongoose.model("User")




router.get('/allpost', async (req, res) =>{

    try{
        const posts =  await Post.find().populate("postedBy","name email")
       return  res.json({posts:posts})
    }
    catch(err){
        console.log(err)
    }
})


router.get("/mypost", requirelogin, async (req, res) =>{
    try{
    const posts = await Post.find({postedBy:req.user._id}).populate("postedBy", "_id name")
    return res.json({posts:posts})
    }
    catch(err){
        console.log(err)
    }
})

router.post("/createpost",requirelogin, async (req, res) =>{
    const {caption, imageurl} = req.body

    // console.log(req.body)

    if(!imageurl){
        return res.status(422).json({error:"Please provide title and body"})
    }

    const post = new Post({
        imageurl,
        caption,
        postedBy:req.rootUsername
    })
    post.save()
    .then((result)=>{
        return res.json({post:result, message:"Post saved successfully"})
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports = router
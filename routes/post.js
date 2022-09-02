const express = require('express')

const mongoose = require('mongoose')

const Post = mongoose.model("Post")

const requirelogin = require('../middleware/requirelogin')

const router = express.Router()

const User = mongoose.model("User")




router.get('/allpost', requirelogin, async (req, res) =>{

    try{
        const posts =  await Post.find().populate("postedBy", "_id photo_url username")
       return  res.json({posts:posts, viewer: req.rootUser.username})
    }
    catch(err){
        console.log(err)
    }
})


router.delete("/deletepost/:post_id",requirelogin, async (req, res) =>{
    const post_id = req.params.post_id
    await Post.deleteOne({_id:post_id})
    return res.send('deleted')

})

router.get("/posts/:username", async (req, res) =>{
    const username = req.params.username
    try{
    const posts = await Post.find({postedBy:username}).populate("postedBy", "_id username")
    return res.json(posts)
    }
    catch(err){
        console.log(err)
    }
})

router.post("/createpost",requirelogin, async (req, res) =>{
    const {caption, imageurl} = req.body

    if(!imageurl){
        return res.status(422).json({error:"Please provide title and body"})
    }

    const post = new Post({
        imageurl,
        caption,
        postedBy:req.userId,
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
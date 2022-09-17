const express = require('express')

const mongoose = require('mongoose')

const Post = mongoose.model("Post")

const requirelogin = require('../middleware/requirelogin')

const router = express.Router()

const User = mongoose.model("User")





router.get("/homefeed", requirelogin, async (req, res) =>{
    try{
    const posts = await Post.find({postedBy:{$in:req.rootUser.followings}})
    .populate('postedBy', "_id photo_url username")
    .sort("-createdAt")

    return  res.json({posts:posts, viewer: {username:req.rootUser.username, id: req.rootUser._id}})
    } catch(err){
        console.log(err)
    }
})


router.delete("/deletepost/:post_id",requirelogin, async (req, res) =>{
    const post_id = req.params.post_id
    await Post.deleteOne({_id:post_id})
    return res.send('deleted')

})

router.put('/posts/like/:post_id', requirelogin, async (req, res) =>{
    const post_id = req.params.post_id

    Post.findByIdAndUpdate(post_id, {$push:{likes:req.rootUser._id}}, {new:true}).exec((err)=>{
        if(err){
            return
        }
    })
    return
})



router.put('/posts/unlike/:post_id', requirelogin, async (req, res) =>{
    const post_id = req.params.post_id

    Post.findByIdAndUpdate(post_id, {$pull:{likes:req.rootUser._id}}, {new:true}).exec((err)=>{
        if(err){
            return
        }
    })
})

router.put("/posts/comment", requirelogin, async(req, res) =>{
    const {comment, post_id} = req.body
    const commenter = await User.findById(req.userId)
    const commentedBy = commenter.username
    Post.findByIdAndUpdate(post_id, {$push:{comments:{text:comment, postedBy:req.rootUser._id, commentedBy:commentedBy}}}, {new:true}).exec((err) => {
        if(err) {
            console.log(err)
            return 
        }
    })
    return res.status(201).json({message:"Comment Posted Successfully"})
})


router.get('/posts/likes/:post_id', async (req, res) =>{
    const post_id = req.params.post_id

    const result = await Post.findById(post_id).populate("likes", '_id username photo_url')

    const likes = result.likes

    if(!result){
        return res.status(404).json({error:"post not found"})
    }
    return res.send(likes)
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
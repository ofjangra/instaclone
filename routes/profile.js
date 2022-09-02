const express = require('express')
const { default: mongoose } = require('mongoose')

const User = mongoose.model('User')

const Post = mongoose.model('Post')

const requirelogin = require("../middleware/requirelogin")

const router = express.Router()




router.get('/profile', requirelogin, async (req, res) =>{
    const userId = req.userId

    try{
        const requestedUser = await User.findOne({_id:userId}).select("-password")

    if(!requestedUser){
        return res.status(404).json({error:"OOPS!!, User not found."})
    }

    const userPosts = await Post.find({postedBy:userId})


    return res.status(200).json({userDetails:requestedUser, posts:userPosts})

    } catch(err){
        return res.status(400).json({error:"There was an error"})
    }
})



router.put("/editprofile", requirelogin, async (req, res) =>{
    try{
    const {username, phone, name, bio, website} = req.body

    let errors = {}

    let query = {}

    const filter = {_id:req.rootUser._id}



    
    if(username !== req.rootUser.username){
        const usernameTaken = await User.findOne({username:username})
        if(usernameTaken){
            errors.username = "Username already taken"
        }
       query.username = username.toLowerCase()
    }


    if(phone !== req.rootUser.phone){
        const phoneUsed = await User.findOne({phone:phone})
        if(phoneUsed){
            errors.phone = "Phone number already in use"
            console.log(errors)
        }
        query.phone = phone
    } 


    if(name !== req.rootUser.name){
        query.name = name
        console.log(query)
    }


    if(bio !== req.rootUser.bio){
        query.bio = bio
    }
    if(website !== req.rootUser.website){
        query.website = website
    }

    if(errors.username || errors.phone){
        return res.status(422).json({error:errors})
    }

    if(!query.username || !query.phone || !query.name || !query.bio || !query.website){
        return res.status(422).json({error:""})
    }

     User.updateOne(filter, {$set: query},{new:true}).exec((err) =>{
        if (err){
            return res.status(400).json({error:err})
        }
    })

    return res.status(201).json({message:"Profile Edited Successfully"})
} catch(err){
    console.log(err)
    return res.json({error:err})
}
})

router.put('/editprofile/photo', requirelogin, (req, res) =>{
    const photo_url = req.body.photo_url
    
    const filter = {_id:req.rootUser._id}

    const query = {$set: {photo_url}}

    User.updateOne(filter, query, {new:true}).exec((err) =>{
        if(err){
            return res.status(400).json({error:"failed to update profile"})
        } else{
            return res.status(201).json({message:"Photo saved successfully"})
        }
    })
})

module.exports = router
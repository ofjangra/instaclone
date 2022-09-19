const express = require('express')
const { default: mongoose } = require('mongoose')

const User = mongoose.model('User')

const Post = mongoose.model('Post')

const requirelogin = require("../middleware/requirelogin")

const validateuser = require("../middleware/validateuser")

const router = express.Router()




router.get('/currprofile', requirelogin, async (req, res) =>{
    const userId = req.userId

    try{
        const requestedUser = await User.findOne({_id:userId}).select("-password")

    if(!requestedUser){
        return res.status(404).json({error:"OOPS!!, User not found."})
    }

    return res.status(200).json({user:requestedUser.username})

    } catch(err){
        return res.status(400).json({error:"There was an error"})
    }
})


router.get("/users/:username", validateuser,  async(req, res) =>{
    try{
    const username = req.params.username

    const requestedUser = await User.findOne({username:username}).select("-password")

    if(!requestedUser){
        return res.status(404).json({error:"OOPS!! User Not Found"})
    }

    
    const posts = await Post.find({postedBy:requestedUser._id}).sort("-createdAt")

    return res.status(200).json({user_props:req.userProps, userDetails:requestedUser, posts:posts})
} catch (err){
    return res.status(422).json({error:"Something went wrong"})
}
})

router.get('/getprofile', requirelogin, async (req, res) =>{
    try{
        const user_id = req.rootUser._id

        const user = await User.findById(user_id).select("-password")

        if(!user){
            return res.status(404).json({error:"Oops!! Something went wrong"})
        }

        return res.status(200).json({userDetails:user})

    } catch(err){
        return res.status(501).json({error:"Something went wrong"})
    }
})

router.get('/suggestions', requirelogin, async (req, res) =>{
    try{
        
    const users = await User.find().select("_id username photo_url")

    const suggestions = users.filter((val) =>{
        return val.username !== req.rootUsername
    })
    return res.status(200).json(suggestions)
    } catch(err){
        return res.status(500).json({error:"something went wrong"})
    }
})

router.put("/editprofile", requirelogin, async (req, res) =>{
    try{
    const {username, phone, name, bio, website} = req.body

    let errors = {}

    const query = {}

    const find_filter = {username:req.rootUsername}



    
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

    if(!query.username && !query.phone && !query.name && !query.bio && !query.website){
        return
    }

     await User.updateOne(find_filter, {$set: query},{new:true})

     const updatedUsername =  await User.findById(req.userId).select("username")



    return res.status(201).json({message:"Profile Edited Successfully", username:updatedUsername})
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
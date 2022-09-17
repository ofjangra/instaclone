const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = mongoose.model('User')
const Post = mongoose.model('Post')
const jwt = require('jsonwebtoken')
const requirelogin = require('../middleware/requirelogin')
const jwtkey = process.env.JWTKEY

const router = express.Router()

router.get('/', requirelogin, async (req, res) =>{
    const userData = await User.findById(req.userId)
    const currUsername = userData.username
    res.json({username:currUsername})
})


router.post("/signup",async (req, res)=>{
    const {username, phone,  password} = req.body

    if(!username || !phone || !password){
        return res.status(422).json({error:"please fill all the fields"})
    }

    try{
        const phoneExists = await User.findOne({phone:phone})
        if(phoneExists){
            return res.status(401).json({error:"Phone No. Already Used"})
        } 
        const usernameExists = await User.findOne({username:username})
        if(usernameExists){
            return res.status(401).json({error:"Username Already Used"})
        }
        const passHash = await bcrypt.hash(password, 12)
        const user = new User({
            username: username.toLowerCase(),
            phone:phone,
            password:passHash,
            name:"",
            photo_url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            bio:"",
            website:""
        })
        await user.save()
            return res.status(200).json({message: "registered successfully"})
    }
    catch(err){
        console.log(err)
    }
    
})


router.post('/signin', async (req, res) =>{
    const {username, password} = req.body

    if(!username || !password){
        return res.status(422).json({error:"please provide credentials"})
    }
    try{



    const currUser = await User.findOne({username})

    if(!currUser){
        return res.status(400).json({error:"Invalid credentials"})
    }


    const passMatch = await bcrypt.compare(password, currUser.password)

    if(!passMatch){
        return res.status(400).json({error:"Invalid Credentials"})
    }

    const token  = jwt.sign({_id:currUser._id},jwtkey)
    
    return res.json({token:token, user: currUser.username})

}
catch(err){
    console.log(err)
}
})





module.exports = router

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')

const JWTKEY = process.env.JWTKEY


module.exports = async (req, res, next) =>{
    
    const {authorization} = req.headers
    const userProps = {
        loggedIn:false,
        viewerID:""
    }
    if(!authorization){
        req.userProps = userProps
        return next()
    }

    const token = authorization.replace("Bearer ","")

    const verifiedToken = jwt.verify(token, JWTKEY)

    const rootUser = await User.findById(verifiedToken._id)

    if(!rootUser){
        return res.status(422).json({error:"something went wrong"})
    }

    userProps.loggedIn = true
    userProps.viewerID = rootUser._id
    req.userProps = userProps
   return next()
}



const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = mongoose.model('User')

const jwtkey = process.env.JWTKEY

module.exports = async (req, res, next) =>{
    try{
        const {authorization} = req.headers
        
        if(!authorization){
        	return res.status(401).json({error:"you must be logged in"})
        }
        
        const token = authorization.replace("Bearer ","")
        
        const verifyToken =  jwt.verify(token, jwtkey)
        const rootUser = await User.findById(verifyToken._id)
        if(!rootUser){
            return res.status(422).json({error:"There was an error"})
        }
       
        req.token = token
       
        req.rootUser = rootUser
        req.rootUsername = rootUser.username
        req.userId =  rootUser._id
       
        next()
    } catch(err){
        return res.status(401).json({error:"There was an error"})
    }


}

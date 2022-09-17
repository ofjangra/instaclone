const express = require('express')
const { default: mongoose } = require('mongoose')

const User = mongoose.model('User')

const requirelogin = require("../middleware/requirelogin")

const router = express.Router()



router.put("/follow_user", requirelogin, async (req, res) =>{
    const followee_id = req.body.followee_id

    const followerID = req.userId

    User.findByIdAndUpdate(followee_id, {$push:{followers:followerID}}, {new:true}).exec((err, result)=>{
        if(err){
            return res.status(501).json(err)
        }
        else{
            User.findByIdAndUpdate(followerID, {$push:{followings:followee_id}}, {new:true}).exec((err)=>{
                if(err){
                    return res.status(501).json(err)
                }
                else{
                    return res.status(201).json({message:"user followed"})
                }
            })
        }
    })
})
router.put("/unfollow_user", requirelogin, async (req, res) =>{
    const followee_id = req.body.followee_id

    const followerID = req.userId

    User.findByIdAndUpdate(followee_id, {$pull:{followers:followerID}}, {new:true}).exec((err, result)=>{
        if(err){
            return res.status(501).json(err)
        }
        else{
            User.findByIdAndUpdate(followerID, {$pull:{followings:followee_id}}, {new:true}).exec((err)=>{
                if(err){
                    return res.status(501).json(err)
                }
                else{
                    return res.status(201).json({message:"user ufollowed"})
                }
            })
        }
    })
})


router.get("/allfollowers/:user_id", async (req, res) =>{
    const targetUserId = req.params.user_id

    const targetUser = await User.findById(targetUserId).populate("followers", "_id username photo_url")

    if(!targetUser){
        return res.status(404).json({error:"no user found"})
    }
    const followers = targetUser.followers

    return res.status(200).json(followers)
})

router.get("/allfollowings/:user_id", async (req, res) =>{
    const targetUserId = req.params.user_id

    const targetUser = await User.findById(targetUserId).populate("followings", "_id username photo_url")

    if(!targetUser){
        return res.status(404).json({error:"no user found"})
    }
    const followings = targetUser.followings

    return res.status(200).json(followings)
})

module.exports = router
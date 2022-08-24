const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Tweet = require('../models/Tweet')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Feed
// @route GET /feed
router.get('/feed', ensureAuth, async (req,res) => {
    try {
        const tweets = await Tweet.find({$or:[{privacy : 'public'},{user: req.user.id}]})
        .populate('user')
        .lean()
        res.render('feed', {
            name: req.user.firstName,
            tweets
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Tweet = require('../models/Tweet')

// @desc show add page
// @route get /tweets/add
router.get('/add', ensureAuth, (req,res) => {
    res.render('tweets/add')
})

// @desc post tweet
// @route post /tweets
router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await Tweet.create(req.body)
        res.redirect('/feed')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc show all public tweets
// @route get /tweets
router.get('/', ensureAuth, async (req,res) => {
    try {
        const tweets = await Tweet.find({user: req.user.id})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        res.render('tweets/index', {
            tweets
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// @desc show edit page
// @route get /tweets/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res) => {
    try {
        const tweet = await Tweet.findOne({
            _id: req.params.id,
        }).lean()

        if (!tweet){
            return res.render('error/404')
        }

        if (tweet.user != req.user.id){
            res.redirect('/tweets')
        } else {
            res.render('tweets/edit', {
                tweet,
            })
        }

        
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc update story
// @route put /tweets/:id
router.put('/:id', ensureAuth, async (req,res) => {
    try{
        let tweet = await Tweet.findById(req.params.id).lean()

        if(!tweet) {
            return res.render('error/404')
        }

        if(tweet.user != req.user.id) {
            res.redirect('/tweets')
        } else {
        tweet = await Tweet.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect('/tweets')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc delete story
// @route delete /tweets/:id
router.delete('/:id', ensureAuth, async (req,res) => {
    try {
        await Tweet.deleteOne({ _id: req.params.id })
        res.redirect('/feed')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

module.exports = router
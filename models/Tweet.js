const mongoose = require('mongoose')
const User = require('./User')

const TweetSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    body: {
        type:String,
        required: true
    },
    privacy:{
        type: String,
        required: true,
        default: 'public',
        enum: ['public','private']
    },
    likes:{
         type: Number,
         required: true,
         default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Tweet', TweetSchema)
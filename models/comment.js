var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema({
    content: {
        type: String,

    },
    articleId : [{
        type : Schema.Types.ObjectId,
        ref : 'Article',

    }]  
},{
    timestamps : true,
})

module.exports = mongoose.model('Comment',commentSchema)
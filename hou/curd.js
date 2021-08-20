var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sms', { useUnifiedTopology: true });

var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    nickname: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Dd', userSchema);
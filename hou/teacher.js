var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sms', { useUnifiedTopology: true });

var Schema = mongoose.Schema;
var userSchema = new Schema({
    //工号
    jobnumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    //角色
    role: {
        type: String,
        required: true
    },
    //入职时间
    entrydate: {
        type: String,
        required: true
    },
    //电话号码
    phone: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Teacher', userSchema);

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sms', { useUnifiedTopology: true });

var Schema = mongoose.Schema;
var userSchema = new Schema({
    //学号
    stunum: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    //入学时间
    admissiondate: {
        type: String,
        required: true
    },
    //手机号码
    phone: {
        type: String,
        required: true
    },
    //授课教师
    teacher: {
        type: String,
        required: true
    },
    // 所在班级
    class: {
        type: String,
        required: true
    },
    //工作单位
    job: {
        type: String,
        required: true
    },
    //薪资待遇
    money: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Student', userSchema);
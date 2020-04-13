//包含多个操作数据库集合的model模块

const MD5 = require('blueimp-md5');
//1、连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
const conn = mongoose.connection;
conn.on('connected',function () {
    console.log('数据库连接成功！')
});

//users Model
const userSchema = mongoose.Schema({//指定文档的结构：属性名/属性名的类型，是否时必须的，默认值
    username:{type:String,require:true},
    password:{type:String,require:true},
    type:{type:String,require:true},
    header:{type:String},
    post:{type:String},
    info:{type:String},
    company:{type:String},
    salary:{type:String},
});
const UserModel = mongoose.model('user',userSchema);//集合名：users（是一个函数）
exports.UserModel = UserModel;

//chat Model
const chatSchema = mongoose.Schema({
    from:{type:String,required:true}, //发送用户的id
    to:{type:String,required:true},//接收用户的id
    chat_id:{type:String,required:true},//from和to组成的字符串
    content:{type:String,default:false},//内容
    read:{type:Boolean,required:true},//标识是否可读
    create_time:{type:Number},//创建时间
})
const ChatModel  = mongoose.model('chat',chatSchema)
exports.ChatModel = ChatModel

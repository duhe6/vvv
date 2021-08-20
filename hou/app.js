var express=require('express');
var bodyParser=require('body-parser');
var router=require('./router.js');
var path=require('path');
var app=express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')));
app.use(express.static('./dist'))
app.use(router)
app.listen(3000,function(){
    console.log('runing......');
});
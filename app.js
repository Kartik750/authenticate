require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const port=3000;

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://kartikorson4:WA5PSbZyaL1YODwk@auth.viarzop.mongodb.net/auth');

// const userSchema={
//     email: String,
//     password: String
// }

// creating new version of schema with encryption
const userSchema=new mongoose.Schema({
    email: String,
    password: String
});

// const secret="Thisisourlittlesecret";
// to accessdata from .env
console.log(process.env.SECRET);
// previous
// userSchema.plugin(encrypt, {secret, encryptedFields:['password']});
// after
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:['password']});

const User=mongoose.model('User', userSchema);

app.route('/')
.get(function(req, res){
    res.render('home');
}).post(function(req, res){
    if(req.body.hasOwnProperty('homeLogin')){
        res.redirect('/login');
    }
    if(req.body.hasOwnProperty('homeRegister')){
        res.redirect('/register');
    }
});

app.route('/register')
.get(function(req, res){
    res.render('register');
}).post(function(req, res){
    if(req.body.hasOwnProperty('regBtn')){
        const user=new User({
            email: req.body.regMail,
            password: req.body.regPass
        });
        user.save();
        // alert('successfully saved')
    }
    res.render('secrets');
});

app.route('/login')
.get(function(req, res){
    res.render('login');
}).post(function(req, res){
    const username=req.body.logMail;
    const password=req.body.logPass;
    User.findOne({email: username, password: password}).then(function(foundUser){
        if(foundUser.email===username && foundUser.password===password){
            res.render('secrets');
        }
        else if(foundUser===null){
            console.log('wrong email or password');
        }
    });
});

app.route('/secrets')
.get(function(req, res){
    res.render('secrets');
});

app.route('/submit')
.get(function(req, res){
    res.render('submit');
});

app.route('/secrets')
.get(function(req, res){
    res.render('secrets');
});

app.listen(port, function(){
    console.log('server is running at the port ',port);
});
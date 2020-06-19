const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user-model.js');

//Route to Register a New User. Checks for Unique Username, and inserts user into DB
//Returns the new User Object if successfully created
router.post('/register',(req,res)=>{
    User.findOne({username:req.body.username})
        .then((user)=>{
            if(user) {
                res.status(409).send('Username Already Exists\n');
            } else {
                //Creating the New User
                const newUser = new User({
                    username:req.body.username,
                    password: req.body.password,
                    isInfected: false
                });
            
                newUser.save()
                    .then((user)=>{
                        res.status(201).json(user);
                    });
            }
        })
        .catch((err)=>{
            res.send("error");
        })
});

//POST Route for Login Request. Checks credentials, and returns a signed JWT if credentials match
router.post('/login',(req,res)=>{
    console.log(req.body);
    User.findOne({username:req.body.username})
        .then((user)=>{
            if(user) {
                if(user.password===req.body.password) {
                    //Signing and Creating the JWT
                    var token = jwt.sign({username: user.username, password: user.password, uuid: user.id},Buffer.from(process.env.JWT_SECRET,'base64'));

                    res.send(token);
                }
                else {
                    res.send('Password is Invalid');
                }
            } else {
                res.send('Username does not Exist');
            }
        })
});

module.exports = router;

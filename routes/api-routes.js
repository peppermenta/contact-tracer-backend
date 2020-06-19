const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user-model.js');


//Endpoint to access list of Infected Persons. Returns a list of infected persons
//Checks for Request Authentication using JWTs
router.get('/infecteds',(req,res)=>{
    const authHeader = req.headers.authorization;
    if(authHeader!=null) {
        const jwtToken = req.headers.authorization.split(' ')[1];
        jwt.verify(jwtToken,Buffer.from(process.env.JWT_SECRET,'base64'),(authErr,decoded)=>{
            if(authErr) {
                res.status(401).send("Request not Authenticated");
                
            } else {
                //Finding all Users that are infected
                User.find({isInfected: true},(err,result)=>{
                    if(err) {
                        res.send("Error");
                    } else {
                        res.header("Content-Type","application/json");
                        res.json(result);
                    }
                });
            }
        });
    } else {
        res.status(401).send("Request not Authenticated");
    }
});

//Endpoint for a User to change status to "Infected"
//Checks for Request Authentication using JWTs
router.post('/infecteds',(req,res)=>{
    const authHeader = req.headers.authorization;
    
    if(authHeader!=null) {
        const jwtToken = req.headers.authorization.split(' ')[1];
        jwt.verify(jwtToken,Buffer.from(process.env.JWT_SECRET,'base64'),(authErr,decoded)=>{
            if(authErr) {
                res.status(401).send("Request not Authenticated");
            } else {
                //Find User and Update using User ID included in JWT
                User.findByIdAndUpdate(decoded.uuid,{isInfected: true},{upsert:false, new:true},(err,result)=>{
                    if(err) {
                        res.send("Error");
                    } else {
                        res.status(200).send(result);
                    }
                });
            }
        });
    } else {
        res.status(401).send("Request not Authenticated");
    }
});

module.exports = router;

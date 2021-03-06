const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Importing routes from files
const authRoutes = require('./routes/auth-routes.js');
const apiRoutes = require('./routes/api-routes.js');

//Loading config values from .env file
dotenv.config();
const PORT = process.env.PORT||5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;


const app = express();
//Connecting to MongoDB Database
mongoose.connect(MONGO_DB_URI,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log('Connected to MongoDB...');
    })
    .catch((err)=>{
        console.log(err);
    });


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/api',apiRoutes);

app.listen(PORT,()=>{
    console.log(`Listening on Port ${PORT}...`);
})

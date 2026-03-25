const connectToMango=require('./db');
const express=require('express'); 
var cors = require('cors')
const app=express();
app.use(cors());
app.use(express.json())
app.use('/auth/Validateuser',require('./Routes/UserRoute'));
app.use('/auth/Posts',require('./Routes/PostRoute'));

app.listen(5000,()=>
    console.log("connection established")
);
connectToMango();
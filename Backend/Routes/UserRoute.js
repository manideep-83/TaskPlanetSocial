const express=require('express');
const User=require('../schema/user');
const { body , validationResult } = require('express-validator');
const router=express.Router();
//Route to signup
router.post('/signup',[
    body('email','Enter a valid email').isEmail()
],async (req,res)=>{
    let success=false;
    const errors= validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    const existed_user=await User.findOne({email:req.body.email});
    if(existed_user!=null)
    {
        return res.status(409).json({success,error: "Email already exists" });
    }
    const userdetails=await User.create({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password
    });
    success = true;
    res.json({success, user: {id: userdetails._id,name: userdetails.name,email: userdetails.email}
      });
});
//Route to login
router.post("/login",[
      body("email", "Enter valid email").isEmail(),
      body("password", "Password is required").notEmpty() ],
    async (req, res) => {
      console.log("hi")
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(400).json({ success, error: "Invalid credentials" });
        }
        if (req.body.password !== user.password) {
          return res.status(400).json({ success, error: "Wrong password" });
        }
        success = true;
        res.json({
          success,
          user: {
            id: user._id,
            name: user.username,
            email: user.email
          }
        });
  
      } catch (error) {
        res.status(500).json({ success, error: "Server error" });
      }
    }
);
module.exports = router;
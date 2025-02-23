const express = require('express');
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Register
router.post("/register", async(req, res)=> {
    const { username, email, password, profile }= req.body;
    const profileImage = profile;
    const user = await User.findOne({ username });
    if(user){
        return res.status(409).json({ message: "User already exists!"});
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(409).json({ message: "Email already used!"});
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profileImage,
    });
    const savedUser = await newUser.save();
    res.status(200).json({ message: "User registered successfully!", user: savedUser })
});


//Login
router.post("/login", async(req, res)=> {
   try {
     const user = await User.findOne({email: req.body.email});
     if(!user){
        return res.status(404).json("User not found!");
     }
     const match = await bcrypt.compare(req.body.password, user.password);
     if(!match){
        return res.status(401).json("Wrong credentials!");
     }
     const token = jwt.sign({_id:user._id,username:user.username,email:user.email,profileImage:user.profileImage},process.env.SECRET,{expiresIn:"11d"})
        const {password,...info}=user._doc
        res.cookie("token",token).status(200).json(info)
     } catch (error) {
      return res.status(500).json(err);
   }
});

//refetch user
router.get("/refetch", (req, res)=> {
    const token = req.cookies.token;
    jwt.verify(token,process.env.SECRET,{},async(err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })

});

//logout 
router.get("/logout", (req, res)=> {
    try {
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!");
    } catch (error) {
        res.status(500).json(err);
    }
})


module.exports = router;
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User.model");

const router = express.Router();

router.get("/",async(req,res)=>{
  try {
    const Users = await UserModel.find();
    res.send(Users);
  } catch (error) {
    res.send({message:"Cannot get Users",error:error.message})
  }
})

router.post("/register", async (req, res) => {
  const { name, username, email, password, phone, gender, role } = req.body;
  
  try {
    // Validate role
    const validRoles = ['buyer', 'seller', 'admin'];
    const userRole = role || 'buyer';
    
    if (!validRoles.includes(userRole)) {
      return res.status(400).send({ message: "Invalid role. Must be buyer, seller, or admin." });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        const User = new UserModel({
          name,
          username,
          email,
          password: hash,
          phone,
          gender,
          role: userRole,
          status: userRole === 'buyer' ? 'approved' : 'pending' // Auto-approve buyers, sellers need approval
        });
        
        await User.save();
        res.send({ 
          message: `User has been registered successfully as ${userRole}. ${userRole === 'seller' ? 'Your account is pending admin approval.' : ''}`,
          role: userRole,
          status: userRole === 'buyer' ? 'approved' : 'pending'
        });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong", error: error.message });
  }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
      const User = await UserModel.findOne({email});
      if(User){
        bcrypt.compare(password, User.password, (err, result) => {
          if(err){
            console.log({error: err.message});
            res.status(500).send({message: "Login error", error: err.message});
          } else if(result){
            const token = jwt.sign({UserId: User._id, role: User.role}, "anysecretkey");
            res.send({
              message: "User has been login successfully",
              token: token,
              userDetails: {
                id: User._id,
                name: User.name,
                username: User.username,
                email: User.email,
                role: User.role,
                status: User.status,
                phone: User.phone,
                gender: User.gender
              }
            });
          } else {
            res.status(401).send({message: "Wrong Credentials"});
          }
        });
      } else {
        res.status(404).send({message: "User not found"});
      }
    } catch (error) {
      res.status(500).send({ message: "Something went wrong", error: error.message });  
    }
});

module.exports=router
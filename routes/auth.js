const express = require('express');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const User = require("../models/User")
const { check, validationResult } = require('express-validator');

const router = express.Router();

//@route GET /api/auth
//@desc Get logged in user
//@access Private
router.get('/',(req,res) => res.send("Get logged in user"));

//@route POST /api/auth
//@desc Auth user and get token
//@access Public
router.post('/',
    [check("email", "A valid email is required").normalizeEmail().isEmail(),
        check("password","Please enter a password").exists()],
    async (req,res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()});
      }  
      
      const {password, email} = req.body;

      try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"User does not exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid password"})
        }
        const payload = {
            user: {
                id:user.id
            }
        }

        jwt.sign(payload,
                config.get("jwtSecret"),
                {expiresIn:360000},
                (err,token) => {
                    if(err) throw err;
                    res.json({token})
                })
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth')
const User = require("../models/User")
const Contact = require("../models/Contact")

const router = express.Router();

//@route GET /api/contacts
//@desc Get all user's contacts
//@access Private
router.get('/',auth,async (req,res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1})
        res.json(contacts)
    } catch (err) {
       console.error(err) 
       res.status(500).send("Server error") 
    }
});

//@route POST /api/contacts
//@desc Add a new contact
//@access Private
router.post('/',
            [
                auth,
                check("type","type is required").not().isEmpty()],
                async (req,res) =>{
                    const errors = validationResult(req)

                    if(!errors.isEmpty()) {
                        return res.status(400)
                                .json({errors:errors.array()})
                    } 
                    const {name, email, phone, type} = req.body;

                    try {
                       const newContact = new Contact({
                           name,
                           email,
                           phone,
                           type,
                           user: req.user.id
                       }); 

                       const contact = await newContact.save();
                       res.json(contact)
                    } catch (err) {
                       console.error(err);
                       res.status(500).send("Server Error")
                    }
                });

//@route PUT /api/contacts/:id
//@desc Update a contact
//@access Private
router.put('/:id',[auth],
        async (req,res) =>{
            const {name, email, phone, type} = req.body;

            //Build a contact object
            const contactFields = {}
            if(name) contactFields.name = name;
            if(email) contactFields.email = email;
            if(phone) contactFields.phone = phone;
            if(type) contactFields.type = type;
            
            try {
                let contact = await Contact.findById(req.params.id)

                if(!contact){
                    return res.status(404).json({msg:"Contact not found"})
                }

                if(contact.user.toString() !== req.user.id){
                    return res.status(401).json({msg:"Not authorized"})
                }

                contact = await Contact.findByIdAndUpdate(req.params.id,
                                                          {$set:contactFields},
                                                          {new:true})
                res.json(contact)
            } catch (err) {
                console.error(err);
                res.status(500).send("Server Error")
            }
        });

//@route DELETE /api/contacts/:id
//@desc Delete a contact
//@access Private
router.delete('/:id',auth, async(req,res) => {
    try {
        let contact = await Contact.findByIdAndRemove(req.params.id)

        if(!contact){
            return res.status(404).json({msg:"Contact not found"})
        }

        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({msg:"Not authorized"})
        }

        res.send("Contact successfully deleted")
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error")
    }
});

module.exports = router;


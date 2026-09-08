const Admin = require("../models/adminSchema");

const createAdmin = async (req, res) => {

   try {

      const existingAdmin = await Admin.findOne();

      if(existingAdmin){

         return res.status(400).json({
            message:"Admin already exists"
         });

      }

      const admin = await Admin.create(req.body);

      res.status(201).json({
         message:"Admin created successfully",
         admin
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};
const checkAdmin = async (req, res) => {

   try {

      const existingAdmin = await Admin.findOne();

      return res.status(200).json({
         exists: Boolean(existingAdmin)
      });

   } catch(err){

      res.status(500).json({
         message: err.message
      });

   }

};
const adminLogin = async (req,res) => {
 const admin = await Admin.findOne({
   username:req.body.username
 });
 if(!admin) {
   return res.json({
      message:"admin not found"
   })
 }
 if(admin.password !== req.body.password) {
   return res.json({
      message:"password not matched"

   })
 }
 res.json({
   message:"login Successful",
   success: true
 })
}
module.exports = {createAdmin, adminLogin, checkAdmin} ;
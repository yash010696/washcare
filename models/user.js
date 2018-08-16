var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Franchise = require('./franchise');
var Role = require('./role');
var userSchema = new Schema({
  first_Name: {
    type:String,
    required:true
  },
  last_Name: {
    type:String,
    required:true
  },
  franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Franchise'
  },
  role:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  email: {
    type:String,
    required:true,
    unique: true,
    trim:true,
    validate:{
      validator: (value)=>{

        return validator.isEmail(value);  

      },

      message:'{VALUE} is not a valid Email'

 }
  },
  mobile: {
    type: String,
    required: true
   
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim:true 
  }, 
  password: {
    type: String,
    required: true,
    minlength:6
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  created_at:{
    type: Date,
  },
  updated_by:{
    type:String
  },
  updated_at:{
    type: Date
  },
  status:{
    type: Boolean
  },
  statee:{
    type: Boolean
  }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);

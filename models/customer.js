var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
// var Area = require('./area');
// var Franchise = require('./franchise');
var Ordertype = require('./ordertype');
var customerSchema = new Schema({
  first_Name: {
    type: String,
    required: true
  },
  last_Name: {
    type: String,
    required: true
  },
  // area: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Area'
  // },
  // franchise: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Franchise'
  // },
  order_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ordertype'
  },
  gender: {
    type: String
  },
  dob: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => {

        return validator.isEmail(value);

      },

      message: '{VALUE} is not a valid Email'

    }
  },
  mobile: {
    type: String,
    required: true

  },
  whatsup: {
    type: String,
    required: true

  },
  otp: {
    type: String,
  },
  referral_Code: {
    type: String,
  },
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },
  confirm_Password: {
    type: String
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
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
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  status: {
    type: Boolean
  },
  statee: {
    type: Boolean
  }
}, { timestamps: true }, { collection: 'customers' });

module.exports = mongoose.model('Customer', customerSchema);

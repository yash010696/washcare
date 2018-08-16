var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var itemSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  item_Name: {
    type:String,
    required:true
  },
  unit_Type: {
    type:String,
    required:true
  },
  threshold_Qty: {
    type:String,
    default:0
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  created_at:{
    type: Date,
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_at:{
    type: Date
  },
  status:{
    type: Boolean
  },
  state:{
    type: Boolean
  }
}, { collection: 'items' });

module.exports = mongoose.model('Item', itemSchema);

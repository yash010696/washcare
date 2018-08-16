var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator =require('validator');
var ObjectId = mongoose.Types.ObjectId;

var Admininfo = require('./admininfo');
var Item = require('./item');
var inventorytransactionSchema = new Schema({
  id: {
    type:Number,
    unique:true,
    default:1
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },  
  qty_day_open: {
    type:String,
  },
  qty_day_consumed: {
    type:String,
    default:0
  },
  qty_day_close: {
    type:String,
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  created_at:{
    type: String,
  },
  updated_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admininfo'
  },
  updated_at:{
    type: String
  },
}, { collection: 'inventorytransactions' });

module.exports = mongoose.model('Inventorytransaction', inventorytransactionSchema);

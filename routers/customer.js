var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Customer = require('../models/customer');
var Area = require('../models/area');
var Ordertype = require('./ordertype');
var Verifytoken = require('./loginadmin');
var checkAuth = require('./../middleware/check-auth');
var customerRouter = express.Router();


///Create router for  register the new user.
customerRouter
  .route('/customer')
  .post(checkAuth, function (req, res) {
    console.log(';;;;;;;;;;;;;;;;;;;;;;;;;')
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var randomstring = ''; var string;
      var chars = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
      var string_length = 6;
      for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        string += chars.substring(rnum, rnum + 1);
      }
      savedata(counter, randomstring);
    }
    function savedata(counter, randomstring) {
      var referral_Code = randomstring.toUpperCase();
      // var area = new Area(req.body);
      var customer = new Customer({
        first_Name: req.body.first_Name,
        last_Name: req.body.last_Name,
        order_type: req.body.order_type,
        gender: req.body.gender,
        dob: req.body.dob,
        email: req.body.email,
        mobile: req.body.mobile,
        whatsup: req.body.whatsup,
        otp: req.body.otp,
        referral_Code: referral_Code,
        username: req.body.username,
        password: req.body.password,
        confirm_Password: req.body.confirm_Password,
        address1: req.body.address1,
        address2: req.body.address2,
        pincode: req.body.pincode,
        city: req.body.city,
        state: req.body.state,
        created_by: req.body.admin_id,
        updated_by: null,
        status: true,
        statee: true
      });
      customer.save().then()
      customer.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ success: true, msg: 'Successful created new customer.' });
      });

    }

  })


  //Create router for fetching All subservice.
  .get(checkAuth, function (req, res) {
    Customer.
      find({ statee: true }).
      populate('order_type').
      exec(function (err, customers) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Customer  is %s', customers);
        res.json(customers);
      });

  });

//Create router for fetching Single user.
customerRouter
  .route('/customers/:customerId')
  .get(checkAuth, function (req, res) {

    console.log('GET /customers/:customerId');

    var customerId = req.params.customerId;

    Customer.findOne({ id: customerId }, function (err, customer) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(customer);

      res.json(customer);

    });

  })

  //Create router for Updating .
  .put(checkAuth, function (req, res) {

    console.log('PUT /customers/:customerId');

    var customerId = req.params.customerId;

    Customer.findOne({ _id: customerId }, function (err, customer) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (customer) {
        customer.first_Name = req.body.first_Name;
        customer.last_Name = req.body.last_Name;
        customer.order_type = req.body.order_type;
        customer.gender = req.body.gender;
        customer.email = req.body.email;
        customer.mobile = req.body.mobile;
        customer.whatsup = req.body.whatsup;
        customer.address1 = req.body.address1;
        customer.address2 = req.body.address2;
        customer.pincode = req.body.pincode;
        customer.city = req.body.city;
        customer.state = req.body.state,
          customer.status = req.body.status,
          customer.updated_by = req.body.updated_by;
        customer.updated_at = myDateString;
        customer.save();

        res.json(customer);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
customerRouter
  .route('/customerss/:customerId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /customerss/:customerId');
    var customerId = req.params.customerId;
    Customer.findOne({ _id: customerId }, function (err, customer) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (customer) {
        customer.statee = false;

        customer.save();
        res.json(customer);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = customerRouter;
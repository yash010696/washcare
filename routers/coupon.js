var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Coupon = require('../models/coupon');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var couponRouter = express.Router();

///Create router for  register the new user.

couponRouter
  .route('/coupon')
  .post(checkAuth, function (req, res) {
    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {
      var counter;
      Coupon.find().exec(function (err, results) {
        var count = results.length;
        counter = count + 1;
        savedata(counter);

      });
    }
    function savedata(counter) {
      var myDateString = Date();
      var cc = counter;
      console.log('cc', cc);
      // var area = new Area(req.body);
      var couponCode = req.body.couponCode.toUpperCase();
      var coupon = new Coupon({
        id: cc,
        franchise: req.body.franchise,
        couponCode: couponCode,
        offerIn: req.body.offerIn,
        couponAmount: req.body.couponAmount,
        validFor: req.body.validFor,
        description: req.body.description,
        couponExpireAt: req.body.couponExpireAt,
        created_by: req.body.admin_id,
        couponCreatedAt: myDateString,
        updated_by: null,
        updated_at: myDateString,
        status: true
      });
      coupon.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.json({ success: true, msg: 'Successful created new coupon.' });
      });
    }
  })
  //Create router for fetching All subservice.
  .get(checkAuth, function (req, res) {
    Coupon.
      find().
      populate('franchise').
      exec(function (err, coupons) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Coupon  is %s', coupons);
        res.json(coupons);
      });
  });

//Create router for fetching Single user.
couponRouter
  .route('/coupons/:couponId')
  .get(checkAuth, function (req, res) {
    console.log('GET /coupons/:couponId');
    var couponId = req.params.couponId;
    Coupon.
      findOne({ id: couponId }).
      populate('franchise').
      exec(function (err, coupon) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        console.log('The Franchise  is %s', coupon);
        res.json(coupon);
      });
  })
  //Create router for Updating .
  .put(checkAuth, function (req, res) {
    console.log('PUT /coupons/:couponId');
    var couponId = req.params.couponId;
    Coupon.findOne({ _id: couponId }, function (err, coupon) {
      var myDateString = Date();
      var couponCode = req.body.couponCode.toUpperCase();
      if (coupon) {
        coupon.franchise = req.body.franchise,
          coupon.couponCode = couponCode,
          coupon.offerIn = req.body.offerIn,
          coupon.couponAmount = req.body.couponAmount,
          coupon.validFor = req.body.validFor,
          coupon.description = req.body.description,
          coupon.couponExpireAt = req.body.couponExpireAt,
          coupon.status = req.body.status,
          coupon.updated_by = req.body.updated_by;
        coupon.updated_at = myDateString;
        coupon.save();
        res.json(coupon);
        return;
      }
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
module.exports = couponRouter;
var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Franchise = require('../models/franchise');
var Role = require('../models/role');
var Verifytoken = require('./loginadmin');
var userRouter = express.Router();
var bcrypt = require('bcrypt');
var checkAuth = require('./../middleware/check-auth');


///Create router for  register the new user.
userRouter
  .route('/user')
  .post(checkAuth, function (req, res) {


    if (!req.body) {
      res.json({ success: false, msg: 'Please Enter Required Data.' });
    } else {

      var myDateString = Date();

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err
          })
        } else {
          var user = new User({
            first_Name: req.body.first_Name,
            last_Name: req.body.last_Name,
            franchise: req.body.franchise,
            role: req.body.role,
            email: req.body.email,
            mobile: req.body.mobile,
            username: req.body.username,
            password: hash,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
            created_by: req.body.admin_id,
            created_at: myDateString,
            updated_by: null,
            updated_at: myDateString,
            status: true,
            statee: true
          });
          user.save(function (err) {
            if (err) {
              res.status(400).send(err);
              return;
            }
            res.json({ success: true, msg: 'Successful created new user.' });
          });
        }
      })


    }

  })


  //Create router for fetching All subservice.
  .get(checkAuth, function (req, res) {
    User.find({ statee: true }).populate('franchise role').
      exec(function (err, users) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        // console.log('The User  is %s', users);
        res.json(users);
      });
  });

//Create router for fetching Single user.
userRouter.route('/users/:userId')
  .get(checkAuth, function (req, res) {
    var userId = req.params.userId;
    User.findOne({ _id: userId }).
      populate('franchise role').
      exec(function (err, users) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        // console.log('The User  is %s', users);
        res.json(users);
      });

  })
  .put(checkAuth, function (req, res) {

    var userId = req.params.userId;
    User.findOne({ _id: userId }, function (err, user) {
      var myDateString = Date();
      if (user) {
        user.address = req.body.address,
          user.city = req.body.city,
          user.email = req.body.email,
          user.first_Name = req.body.first_Name,
          user.franchise = req.body.franchise,
          user.last_Name = req.body.last_Name,
          user.mobile = req.body.mobile,
          user.pincode = req.body.pincode,
          user.role = req.body.role,
          user.state = req.body.state,
          user.status = req.body.status,
          user.username = req.body.username,
          user.password = req.body.password,
          user.updated_by = req.body.updated_by;

        user.updated_at = myDateString
        user.save();
        res.json({ success: true, msg: 'User updated successfully' });
        return;
      }
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ success: true, msg: 'Successful Updated user.' });
      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
userRouter
  .route('/userss/:userId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /userss/:userId');
    var userId = req.params.userId;
    User.findOne({ _id: userId }, function (err, user) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (user) {
        user.statee = false;

        user.save();
        res.json(user);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })

userRouter
  .route("/userLogin")
  .post((req, res) => {
    User.find({
      username: req.body.username
    })
      .populate("role")
      .exec()
      .then(user => {
        // console.log(user);

        if (user.length < 1) {
          return res.status(401).json({
            error: "User not found"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Auth failed"
            });
          }
          if (result) {
            const payload = {
              _id: user[0]._id,
              email: user[0].email,
              username: user[0].username,
              franchise: user[0].franchise ? user[0].franchise : "",
              role: user[0].role.name,
              created_by: user[0].created_by,
            };

            const token = jwt.sign(payload, config.secret, {
              expiresIn: '8h' // 1 week
            });
            res.status(200).json({
              user: user[0],
              success: true,
              token: 'JWT ' + token
            })
          } else {
            res.status(401).json({
              error: "Wrong Password"
            });
          }
        });
      })
  })

module.exports = userRouter;
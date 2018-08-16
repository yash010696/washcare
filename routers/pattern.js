var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Pattern = require('../models/pattern');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var patternRouter = express.Router();

//Create router for  register the new subservice.
patternRouter
    .route('/pattern')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Pattern.find().exec(function (err, results) {
            var count = results.length;
            counter=count +1;
            savedata(counter);
             
          });
            

        }    
        function savedata(counter){
          // var myDateString = Date();
          var cc=counter;
           console.log('cc',cc);
          // var area = new Area(req.body);
          var code = req.body.code.toUpperCase();
          var pattern = new Pattern({
              id:cc,
              pattern_name: req.body.pattern_name,
              code:code,
              created_by:req.body.admin_id,
              // created_at:myDateString,
              updated_by:null,
              // updated_at:myDateString,
              status:true
            });
            pattern.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new pattern.' });
          });
    
        }
      
    })


//Create router for fetching All subservice.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Pattern.find({ state: true },function (err, patterns) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(patterns);
      res.json(patterns);
    });

  });

//Create router for fetching Single subservice.
patternRouter
  .route('/patterns/:patternID')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /patterns/:patternID');

    var patternID = req.params.patternID;

    Pattern.findOne({ _id: patternID }, function (err, pattern) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(pattern);

      res.json(pattern);

    });
  })

  //Create router for Updating subservice.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /patterns/:patternID');

    var patternID = req.params.patternID;

    Pattern.findOne({ _id: patternID }, function (err, pattern) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      // var myDateString = Date();
      var code = req.body.code.toUpperCase();
      if (pattern) {
        pattern.pattern_name= req.body.pattern_name,
        pattern.code= code,
        pattern.status = req.body.status;
        pattern.updated_by = req.body.updated_by;
        
        pattern.save();

        res.json(pattern);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  patternRouter
  .route('/patternss/:patternId')
  .put(checkAuth, function (req, res) {
    console.log('PUT /patternss/:patternId');
    var patternId = req.params.patternId;
    Pattern.findOne({ _id: patternId }, function (err, pattern) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (pattern) {
        pattern.state = false;
       
        pattern.save();
        res.json(pattern);
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = patternRouter;
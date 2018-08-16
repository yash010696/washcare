var express = require('express');
const config = require('../config/config');
var passport = require('passport');
require('../config/passport')(passport);
var jwt = require('jsonwebtoken');
var Timeslot = require('../models/timeslot');
var Verifytoken = require('./loginadmin');
var checkAuth=require('./../middleware/check-auth');
var timeslotRouter = express.Router();

//Create router for  register the new .
timeslotRouter
    .route('/timeslot')
    .post(passport.authenticate('jwt', { session: false}),function (req, res) {
      

        if (!req.body) {
            res.json({ success: false, msg: 'Please Enter Required Data.' });
        } else { 
          
          var counter;

          Timeslot.find().exec(function (err, results) {
            var count = results.length;
            counter=count +1;
            savedata(counter);
             
          });
            

        }    
        function savedata(counter){
          var myDateString = Date();
          var cc=counter;
           console.log('cc',cc);
          // var area = new Area(req.body);
          var timeslot = new Timeslot({
              id:cc,
              time_Slot: req.body.time_Slot,
              created_by:req.body.created_by,
              created_at:myDateString,
              updated_by:req.body.updated_by,
              updated_at:myDateString,
              status:true
            });
            timeslot.save(function (err) {
              if (err) {
                  res.status(400).send(err);
                  return;
              }
              res.json({ success: true, msg: 'Successful created new.' });
          });
    
        }
      
    })


//Create router for fetching All subservice.
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {


    Timeslot.find(function (err, timeslots) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(timeslots);
      res.json(timeslots);
    });

  });

//Create router for fetching Single subservice.
timeslotRouter
  .route('/timeslots/:timeslotId')
  .get(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('GET /timeslot/:timeslotId');

    var timeslotId = req.params.timeslotId;

    Timeslot.findOne({ id: timeslotId }, function (err, timeslot) {

      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(timeslot);
    });
  })

  //Create router for Updating subservice.
  .put(passport.authenticate('jwt', { session: false}),function (req, res) {

    console.log('PUT /timeslot/:timeslotId');

    var timeslotId = req.params.timeslotId;
    Timeslot.findOne({ _id: timeslotId }, function (err, timeslot) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      var myDateString = Date();
      if (timeslot) {
        timeslot.time_Slot= req.body.time_Slot,
        timeslot.updated_by = req.body.updated_by;
        timeslot.status = req.body.status;
        timeslot.updated_at =myDateString
        timeslot.save();
        res.json({ success: true, msg: 'Timeslot updated successfully' });
        return;
      }

      res.status(404).json({
        message: 'Unable to found.'
      });
    });
  })
  module.exports = timeslotRouter;
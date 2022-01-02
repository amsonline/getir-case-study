var express = require('express');
const outputResults = require('../services/outputResults');
const moment = require('moment');
var router = express.Router();

var db = require('../services/db');

router.post('/', function(req, res, next) {
  
  // Check to see if all fields are present inside the payload
  if (typeof req.body.startDate === 'undefined'
    || typeof req.body.endDate === 'undefined'
    || typeof req.body.minCount === 'undefined'
    || typeof req.body.maxCount === 'undefined') {
      res.status(400).send(outputResults([], -101, "Request payload should contain startDate, endDate, minCount and maxCount."));
      return;
  }

  var startDate = new Date(req.body.startDate);
  var endDate = new Date(req.body.endDate);
  var minCount = parseInt(req.body.minCount);
  var maxCount = parseInt(req.body.maxCount);

  // Validate startDate
  if (!moment(req.body.startDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send(outputResults([], -111, "startDate is invalid. It should be in YYYY-MM-DD format."));
    return;
  }

  // Validate endDate
  if (!moment(req.body.endDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send(outputResults([], -112, "endDate is invalid. It should be in YYYY-MM-DD format."));
    return;
  }

  // Validate minCount
  if (isNaN(minCount) || minCount < 0) {
    res.status(400).send(outputResults([], -121, "minCount is invalid. It should be a number greater or equal to 0."));
    return;
  }

  // Validate maxCount
  if (isNaN(maxCount) || maxCount < 0) {
    res.status(400).send(outputResults([], -122, "maxCount is invalid. It should be a number greater or equal to 0."));
    return;
  }

  // startDate should be less than or equal to endDate
  if (startDate > endDate) {
    res.status(400).send(outputResults([], -113, "startDate should be less than or equal to endDate."));
    return;
  }

  // minCount should be less than or equal to maxCount
  if (minCount > maxCount) {
    res.status(400).send(outputResults([], -123, "minCount should be less than or equal to maxCount."));
    return;
  }

  db.connectToServer().then(() => {
    var dbo = db.getDb();
    dbo.collection("records").aggregate([
      {
        $addFields: {
          totalCount: {$sum: "$counts"}
        }
      },
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          },
          totalCount: {
            $gte: minCount,
            $lte: maxCount
          }
        }
      },
      {
        $project: {
          _id: 0, key: 1, createdAt: 1, totalCount: 1
        }
      }
    ]).toArray((error, results) => {
      if (error) {
        res.status(500).send(outputResults([], 500, `An internal error has been occurred (code ${error.code}).`));
        return;
      }
      res.send(outputResults(results));
      db.close();
    });
  }).catch(err => {
    console.error("An error has been occurred...", err);
    res.send(outputResults([], 500, "An unexpected error has been occurred."));
    db.close();
  });
});

module.exports = router;

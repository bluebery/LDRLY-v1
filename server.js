// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb://192.168.1.88:27017/test'); 

// configure app to use bodyParser() - this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080; 

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 

// middleware to use for all requests
router.use(function (req, res, next) {
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'welcome to the LDRLY api' });
});

// on routes that end in /sendStat
// ----------------------------------------------------
router.route('/sendStat')

	// create a game stat (accessed at POST http://localhost:8080/api/sendStat)
	.post(function (req, res) {
	
		var gameStat = new GameStat(); 		// create a new instance of the Stat model
		gameStat.name = req.body.name;  // set the stats name (comes from the request)
		gameStat.value = req.body.value;
		gameStat.username = req.body.username;
	
		// save the stat and check for errors
		gameStat.save(function (err) {
			if (err)
				res.send(err);
		
			res.json({ message: 'GameStat created!' });
		});
	});

// on routes that end in /getLeaderboard 
// require query string key statname
// ----------------------------------------------------
router.route('/getLeaderboard')

	// get the game stat with that id (accessed at GET http://localhost:8080/api/getLeaderboard?statname=name)
	.get(function (req, res) {
		if (!req.query.statname) { res.json({ message: 'You must provide a statname in the query string!' }); return; }

		GameStat.find({ name: req.query.statname }).sort({ value: 'desc' }).lean().select('value username -_id').exec(function (err, docs) {
			if (err)
				res.send(err);
		
			// now the docs are sorted, add the ranking property to each object
			// we are able to do this because we used the lean() function on our query
			for (var i = 0; i < docs.length; i++) {
				docs[i].ranking = i + 1;
			}
		
			res.json(docs);
		});
	});

// on routes that end in /getStats
// require query string key username
// ----------------------------------------------------
router.route('/getStats')

	// get the game stat with that id (accessed at GET http://localhost:8080/api/getStats?username=uid)
	.get(function (req, res) {
		if (!req.query.username) { res.json({ message: 'You must provide a username in the query string!' }); return; }
		
		GameStat.find({ username: req.query.username }).select('name value -_id').exec(function (err, docs) {
			if (err)
				res.send(err);
		
			res.json(docs);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LDRLY RESTful API Started on Port ' + port + '. Created by Wes Alcock.');

var GameStat = require('./app/models/gamestat');
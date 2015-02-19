// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to our database
mongoose.connect('mongodb://bluebery.dyx.com:27017/test'); // this db is pre populated and you can perform test api calls on it
//mongoose.connect('mongodb://192.168.1.88:27017/test');
//mongoose.connect('mongodb://localhost:27017/test');

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
	
	// make sure we go to the next routes and don't stop here
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'welcome to the LDRLY api' });
});

// on routes that end in /sendStat. requires body input for name, value, and username.
router.route('/sendStat')

	// create a game stat (accessed at POST http://localhost:8080/api/sendStat)
	.post(function (req, res) {
	
		// simple check to ensure we have all three input items
		if (!req.body.name || !req.body.value || !req.body.username) {
			res.status(422).json({ error: 'You must provide a name, value, and username in the post data! Please try again.' });
			return;
		}
	
		// slightly more involved check to see if this is a duplicate stat entry for the given user
		GameStat.find({ name: req.body.name, username: req.body.username }, function (err, docs) {

			if (docs.length > 0) {
				res.status(422).json({ error: 'This is a duplicate stat for given user! Please try again.' });
				return;				
			}
		
			// create new object for insertion
			var gameStat = new GameStat(); 		
			gameStat.name = req.body.name;  
			gameStat.value = req.body.value;
			gameStat.username = req.body.username;
		
			// save the stat and check for errors
			gameStat.save(function (err) {
				if (err)
					res.send(err);
			
				res.json({ message: 'GameStat created!' });
			});
		});
	});

// on routes that end in /getLeaderboard. requires query string key statname
router.route('/getLeaderboard')

	// get a list of game stats with the given statname (accessed at GET http://localhost:8080/api/getLeaderboard?statname=name)
	.get(function (req, res) {

		// simple check to ensure that we have a statname in the query string
		if (!req.query.statname) {
			res.status(422).json({ error: 'You must provide a statname in the query string! Please try again.' });
			return;
		}

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

// on routes that end in /getStats. requires query string key username
router.route('/getStats')

	// get a list of game stats with the given username (accessed at GET http://localhost:8080/api/getStats?username=name)
	.get(function (req, res) {
	
		// simple check to ensure that we have a username in the query string
		if (!req.query.username) {
			res.status(422).json({ error: 'You must provide a username in the query string! Please try again.' });
			return;
		}
		
		GameStat.find({ username: req.query.username }).select('name value -_id').exec(function (err, docs) {
			if (err)
				res.send(err);
		
			res.json(docs);
		});
	});

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LDRLY RESTful API Started on Port ' + port + '. Created by Wes Alcock.');

var GameStat = require('./app/models/gamestat');

// ONLY CALL THIS FOR INITIAL POPULATION OF DATABASE
// Please do not use on bluebery.dyx.com as this is already pre populated.
//var initdb = require('./initdatabase.js')(mongoose);



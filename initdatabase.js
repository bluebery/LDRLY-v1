module.exports = exports = InitializeDatabase;

var GameStat = require('./app/models/gamestat');

function InitializeDatabase(mongoose) {
	var users = [];
	for (var i = 0; i < 100; i++) {
		
		var name = "user" + i.toString();
		var stats = [];
		
		stats.push("points");
		stats.push("kills");
		stats.push("xp");
		stats.push("level");
		stats.push("missions_complete");
		stats.push("items");
		stats.push("friends");
		stats.push("playtime");
		stats.push("deaths");
		stats.push("hp");
		
		var values = [];
		
		values.push(Math.floor(Math.random() * 1000));
		values.push(Math.floor(Math.random() * 100));
		values.push(Math.floor(Math.random() * 10000));
		values.push(Math.floor(Math.random() * 10));
		values.push(Math.floor(Math.random() * 100));
		values.push(Math.floor(Math.random() * 100));
		values.push(Math.floor(Math.random() * 100));
		values.push(Math.floor(Math.random() * 1000));
		values.push(Math.floor(Math.random() * 100));
		values.push(Math.floor(Math.random() * 1000));
		
		var user = { name: name, stats: stats, values: values };
		users.push(user);
	}
	
	for (var j = 0; j < users.length; j++) {
		for (var k = 0; k < users[j].stats.length; k++) {
			var gameStat = new GameStat(); 		// create a new instance of the Stat model
			gameStat.name = users[j].stats[k];  // set the stats name (comes from the request)
			gameStat.value = users[j].values[k];
			gameStat.username = users[j].name;
			
			gameStat.save();
		}
	}
}
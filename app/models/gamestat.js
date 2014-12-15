var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameStatSchema = new Schema({
	name: String, // stat name
	value: Number, // stat value
	uid: Number // user id
});

module.exports = mongoose.model('GameStat', GameStatSchema);
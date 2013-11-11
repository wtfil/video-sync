var mongoose = require('mongoose'),
	storage = {};

function noDb() {
	var pages = [];
	storage.get = function(id) {
		return pages[id] || null;
	}
	storage.set = function(url) {
		return pages.push(url) - 1;
	}
}
function db() {
	
}
mongoose.connect('mongodb://localhost/test', function (err) {
	err ? noDb() : db();
});

module.exports = storage;

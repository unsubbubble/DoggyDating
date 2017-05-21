var mongoose = require('mongoose')

var dbURI = 'mongodb://21716309:cits3403@ds147821.mlab.com:47821/doggydating'
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg);
			callback();
				});
};

var dogSchema = new mongoose.Schema({
	name:{type:String, required:true},
	age:{type:Number, required:true},
	picture:{type:String, required:true},
	gender:{type:String, required:true},
	breed:{type:String, required:true},
	
	dateCreated:{type:Date, required:true},
	dateLastEdited:{type:Date, required:true, default:Date.now},
});

mongoose.model('Dog', dogSchema);
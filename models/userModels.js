var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	email:{type:String, required:true},
	username:{type:String, required:true},
	name:{type:String, required:true},
	dateOfBirth:{type:String, required:true},
	gender:{type:String, required:true},
	profilePicture:{type:String, required:true},
	//phoneNumber:{type:String, required:true},
	suburb:{type:String, required:true},
	
	dateCreated:{type:Date, required:true},
	dateLastEdited:{type:Date, required:true, default:Date.now},
	isDeleted:{type:Boolean, required:true, default:false},
	registrationComplete:{type: Boolean, required: true, default: false},
	
});
	
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);

var dogSchema = new mongoose.Schema({
	name:{type:String, required:true},
	age:{type:Number, required:true},
	picture:{type:String, required:true},
	gender:{type:String, required:true},
	breed:{type:String, required:true},
	
	owner:{type:[userSchema], required:true},
	
	dateCreated:{type:Date, required:true},
	dateLastEdited:{type:Date, required:true, default:Date.now},
});

var Dog = mongoose.model('Dog', dogSchema);


var matchSchema = new mongoose.Schema({
	response:{type:String, required:true},
	user:{type:[userSchema], required:true},
	targetUser:{type:[userSchema], required:true},
});

var Matches = mongoose.model('Matches', matchSchema);

var messageSchema = new mongoose.Schema({
	message:{type:String, required:true},
	userFrom:{type:[userSchema], required:true},
	userTo:{type:[userSchema], required:true},
	read:{type:Boolean, required:true, default:false},
});

var Messages = mongoose.model('Messages', messageSchema);

var notificationSchema = new mongoose.Schema({
	target:{type:String, required:true},
	userTarget:{type:[userSchema], required:true},
	read:{type:Boolean, required:true, default:false},
});

var Notifications = mongoose.model('Notifications', notificationSchema);
		
		
		

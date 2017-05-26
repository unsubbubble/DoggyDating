var mongoose = require('mongoose');
var passport = require('passport');
var fs = require("fs");

var User = mongoose.model('User');
var Dog = mongoose.model('Dog');

/* Get UnAuth Pages */

/* Home */
module.exports.home = function(req, res, next){
	res.render('index', { title: 'DoggyDates' });
};

module.exports.login  = function(req, res, next){
	res.redirect('/discover');
};

/* Registration */
module.exports.register = function(req, res, next){
	res.render('register_dog', { title: 'DoggyDates - Registration' });
};

function validateRegistration(req){
	var valid = true;
	if(!req.body.email){
		valid = false;
	}
	
	if(!req.body.name){
		valid = false;
	}
	
	if(!req.body.dob || isNaN(Date.parse(req.body.dob))){
		valid = false;
	}
	
	if(!req.body.gender){
		valid = false;
	}
	
	if(!req.file){
		valid = false;
	}
	
	if(!req.body.address){
		valid = false;
	}
	
	if(!req.body.password1 || !req.body.password2 || req.body.password1 != req.body.password2){
		valid = false;
	}
	
	if(!req.body.dog){
		valid = false;
	}
	
	return valid;
}

module.exports.registerPost = function(req, res, next){
	console.log(req.body);
	if(!validateRegistration(req)){
		res.status(500);
		res.render('error', {
			message:"Error: Parameters missing",
			error:{}
		});
	}
	else{
		Dog.findOne({_id:req.body.dog}, function(err, dog){
			if(err){
				console.log(err);
				res.status(500);
				res.render('error', {
					message:err.message,
					error:err
				});
			}
			else{
				var ownerGenderPreference;

				if(req.body.gender == "male"){
					ownerGenderPreference = "female";
				}else if(req.body.gender == "female"){
					ownerGenderPreference = "male";
				}else{
					ownerGenderPreference = "any";
				}

				var dogGenderPreference = dog.gender;
				var ownerAgeDifference = 10;
				var dogAgeDifference = 5;

				var newUser = new User({
					email: req.body.email,
					username: req.body.email,
					name: req.body.name,
					dateOfBirth: new Date(req.body.dob),
					gender: req.body.gender,
					suburb: req.body.address,
					
					dog: dog,

					preferences: {
                        ownerGenderPreference: ownerGenderPreference,
                        dogGenderPreference: dogGenderPreference,
                        ownerAgeDifferenceRange: ownerAgeDifference,
                        dogAgeDifferenceRange: dogAgeDifference
					},
					
					dateCreated: Date.now()
				});

				newUser.profilePicture.data = req.file.buffer.toString("base64");
				newUser.profilePicture.contentType = req.file.mimetype;
				
				console.log(newUser);
				User.register(newUser, req.body.password1, function(err, data){
					if(err){
						console.log(err);
						res.status(500);
						res.render('error', {
							message:err.message,
							error:err
						});
					}
					else{
						res.redirect("/welcome");
					}
				
				});
			}
		});
	}
};



/* Registration Dog */
module.exports.registerDog =  function(req, res, next) {
	res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
};

function validateRegistrationDog(req){
	var valid = true;
	if(!req.file){
		valid = false;
	}
	
	if(!req.body.name){
		valid = false;
	}
	
	if(!req.body.age){
		valid = false;
	}
	
	if(!req.body.gender){
		valid = false;
	}
	
	if(!req.body.breed){
		valid = false;
	}
	
	return valid;
}

module.exports.registerDogPost = function(req, res, next){
	console.log(req.file);
	if(!validateRegistrationDog(req)){
		res.status(500);
		res.render('error', {
			message:"Error: Parameters missing",
			error:{}
		});
	}
	else{
		var newDog = new Dog({
			name: req.body.name,
			age: new Number(req.body.age),
			gender: req.body.gender,
			breed: req.body.breed,
			
			dateCreated: Date.now()
		});

        newDog.picture.data = req.file.buffer.toString("base64");
        newDog.picture.contentType = req.file.mimetype;
				
		console.log(newDog);
		newDog.save(function(err, data){
			if(err){
				console.log(err);
				res.status(500);
				res.render('error', {
					message:err.message,
					error:err
				});
			}
			else{
				
				console.log(data, ' saved');
				res.render('register', {dog: newDog._id});
				
			}
		});
	}
};

module.exports.welcome = function(req, res, next){
	res.render('welcome');
};

module.exports.instructions = function(req, res, next){
    res.render('instructions');
};

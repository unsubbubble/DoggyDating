var mongoose = require('mongoose');
var passport = require('passport');
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
	res.render('register', { title: 'DoggyDates - Registration' });
};

function validateRegistration(req){
	var valid = true;
	if(!req.body.email){
		valid = false;
	}
	
	if(!req.body.name){
		valid = false;
	}
	
	if(!req.body.dob){
		valid = false;
	}
	
	if(!req.body.gender){
		valid = false;
	}
	
	if(!req.body.profile_picture){
		valid = false;
	}
	
	if(!req.body.address){
		valid = false;
	}
	
	if(!req.body.password1 || !req.body.password2 || req.body.password1 != req.body.password2){
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
		var newUser = new User({
			email: req.body.email,
			username: req.body.email,
			name: req.body.name,
			dateOfBirth: new Date(req.body.dob),
			gender: req.body.gender,
			profilePicture: req.body.profile_picture,
			suburb: req.body.address,
			dateCreated: Date.now()
		});
		
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
				passport.authenticate('local')(req, res, function () {
				  res.redirect('/register_dog');
				});
			};
		
		});
		
	}
};



/* Registration Dog */
module.exports.registerDog =  function(req, res, next) {
	res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
};

function validateRegistrationDog(req){
	var valid = true;
	if(!req.body.profile_picture){
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

	if(!req.body.user){
		valid = false;
	}
	
	return valid;
}

module.exports.registerDogPost = function(req, res, next){
	console.log(req.body);
	if(!validateRegistrationDog(req)){
		res.status(500);
		res.render('error', {
			message:"Error: Parameters missing",
			error:{}
		});
	}
	else{
		User.findOne({_id:req.body.user}, function(err, user){ 
			if(err){
				console.log(err);
				res.status(500);
				res.render('error', {
					message:err.message,
					error:err
				});
			}
			else{
				var newDog = new Dog({
					name: req.body.name,
					age: new Number(req.body.age),
					gender: req.body.gender,
					picture: req.body.profile_picture,
					breed: req.body.breed,
					owner: user,
					
					dateCreated: Date.now()
				});
				
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
						user.registrationComplete = true;
						user.save(function(err, data){
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
								res.redirect('discover');
							};
						});
					}
				});
			}
		});
	}
};


var express = require('express');
var db = require('../models/userModels');

/* Get UnAuth Pages */

/* Home */
module.exports.home = function(req, res, next){
	res.render('index', { title: 'DoggyDates' });
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
			name: req.body.name,
			dateOfBirth: req.body.dob,
			gender: req.body.gender,
			profilePicture: req.body.profile_picture,
			suburb: req.body.address,
			dateCreated: Date.now
		});
		
		console.log(newUser);
		newUser.save(function(err, data){
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
				res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
			};
		
		});
		
	}
};



/* Registration Dog */
module.exports.registerDog =  function(req, res, next) {
	res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
};


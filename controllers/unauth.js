
/* Get UnAuth Pages */

/* Home */
module.exports.home = function(req, res, next){
	res.render('index', { title: 'DoggyDates' });
};

/* Registration */
module.exports.register = function(req, res, next){
	res.render('register', { title: 'DoggyDates - Registration' });
};

/* Registration Dog */
module.exports.registerDog =  function(req, res, next) {
	res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
};


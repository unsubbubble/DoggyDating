/* Get Auth Pages */

/* Discover */
module.exports.discover = function(req, res, next) {
  res.render('discover', { title: 'Discover', user: req.user });
};

module.exports.discoverPost = function(req, res, next) {
  res.render('discover', { title: 'Discover' });
};

/* Messages */
module.exports.messages = function(req, res, next) {
  res.render('messages', { title: 'Messages' });
};

/* Profile */
module.exports.profile = function(req, res, next) {
  res.render('profile', { title: 'Profile' });
};
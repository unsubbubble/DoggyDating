/* Get Auth Pages */
var mongoose = require('mongoose');
var Matches = mongoose.model('Matches');
var User = mongoose.model('User');

function loggedIn(req){
  return req.user;
}

function rateMatch(user, match){
  var score = 0;

  // gender search
  if(user.gender !== match.gender){
    score += 100;
  }

  // dog gender search
  if(user.dog.gender === match.dog.gender){
    score += 100;
  }

  // age difference

  score += (100 -
    (
        // age difference in years
        Math.abs(user.dateOfBirth - match.dateOfBirth)
        / (60 * 60 * 24 * 1000 * 31 * 12)
    )
  );

  // dog age difference
  score += (100 - Math.abs(user.dog.age - match.dog.age));

  return score;
}

function sortDiscover(req){
    User.find({'_id': {$ne: req.user._id}}, function (err, matches) {
        if (err) return handleError(err);

        var bestMatch = null;
        console.log(matches);

        for(var match in matches){
            console.log(match);

            if(!bestMatch){
              bestMatch = match;
            }
            else if(rateMatch(req.user, match) > rateMatch(req.user, bestMatch)){
                bestMatch = match;
            }
        }

        return bestMatch;
    });
}

/* Discover */
module.exports.discover = function(req, res, next) {
  if(loggedIn(req)){
      sortDiscover(req);
      res.render('discover', { title: 'Discover', user: req.user, targetUser: sortDiscover(req)});
  }
  else{
    res.redirect("/");
  }

};


function validateDiscover(req){
  var valid = true;
  if(!req.body.response){
    valid = false;
  }

  if(!req.body.targetUser){
    valid = false;
  }

  return valid;
}


module.exports.discoverPost = function(req, res, next) {

  if(!loggedIn(req)){
    res.redirect("/");
  }
  else if(!validateDiscover(req)){
        res.status(500);
        res.render('error', {
            message:"Error: Parameters missing",
            error:{}
        });
  }
  else{

      User.findOne({_id:req.body.targetUser}, function(err, targetUser){
          if(err){
              console.log(err);
              res.status(500);
              res.render('error', {
                  message:err.message,
                  error:err
              });
          }
          else{
              var newMatch = new Matches({
                  response: req.body.response,
                  user: req.user,
                  targetUser: targetUser,
                  dateCreated: Date.now()
              });
              console.log(newMatch);
              newMatch.save(function(err, data){
                  if(err){
                      console.log(err);
                      res.status(500);
                      res.render('error', {
                          message:err.message,
                          error:err
                      });
                  }
                  else{
                      res.redirect("/");

                  }
              });
          }
      });
  }
};

/* Messages */
module.exports.messages = function(req, res, next) {
  res.render('messages', { title: 'Messages' });
};

/* Profile */
module.exports.profile = function(req, res, next) {
  res.render('profile', { title: 'Profile' });
};
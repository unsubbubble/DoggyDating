/* Get Auth Pages */
var mongoose = require('mongoose');
var Matches = mongoose.model('Matches');
var User = mongoose.model('User');
var Messages = mongoose.model('Messages');

function loggedIn(req){
  return req.user;
}

function getMatches(req, callback){
    // get user IDs you have accepted
    Matches.find({'user': req.user._id, response:'accept'}, 'targetUser', function(err, yourMatches){
        var matchIds = [];

        for(var yourMatch in yourMatches){
            matchIds.push(yourMatches[yourMatch].targetUser);
        }

        // filter for user IDs who have accepted you
        Matches.find({'user': {$in: matchIds}, targetUser: req.user._id, response:'accept'}, 'user').sort('-dateCreated').exec(function(err, matches){
            var matchIds = [];

            for(var match in matches){
                matchIds.push(matches[match].user);
            }

            callback(matchIds);
        });

    });
}

function getNotifications(req, callback){
    var userID = req.user._id;
    var notifications = {};
    Messages.find({userTo: userID, read: false}).exec(function(err, messages){
        console.log("Messages: " + messages);
        getMatches(req, function(matchIds){
            console.log(matchIds);
            Matches.find({user: {$in: matchIds}, targetUser: userID, response: 'accept', read: 'false'}).exec(function(err, matches){
                console.log("Matches: " + matches);
                if(messages){

                    notifications['messages'] = messages.length;
                }else{
                    notifications['messages'] = messages;
                }

                if(matches){
                    notifications['matches'] = matches.length;
                }else{
                    notifications['matches'] = matches;
                }

                var sorted_messages = {};
                for(var message in messages){
                    if(messages[message]){
                        if(!sorted_messages[messages[message].fromUser]){
                            sorted_messages[messages[message].fromUser.toString()]= [messages[message]];
                            console.log(sorted_messages[messages[message].fromUser]);
                        }
                        else{
                            sorted_messages[messages[message].fromUser.toString()].push(messages[message]);
                        }
                    }
                }

                notifications['sorted_messages'] = sorted_messages;
                for(var message in sorted_messages){
                    console.log("Message: " + message);
                    console.log(sorted_messages[message]);
                }

                console.log("Sorted Messages: " + sorted_messages);

                callback(notifications);
            });
        });
    })
}


function checkMatch(userID, targetID, callback){
    // check if you matched them
    Matches.findOne({user:userID, targetUser: targetID}, function(err, match){
        if(err){
            console.log(err);
            res.status(500);
            res.render('error', {
                message:err.message,
                error:err
            });
        }
        else{
            if(match && match.response === 'accept'){
                //check if they matched you
                Matches.findOne({user:userID, targetUser: targetID}, function(err, matchBack){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.render('error', {
                            message:err.message,
                            error:err
                        });
                    }
                    else{
                        if(matchBack && matchBack.response === "accept"){
                            callback(true);
                        }
                        else{
                            callback(false);
                        }
                    }
                });
            }
            else{
                callback(false);
            }
        }
    });
}


function getMessages(userId, targetId, callback){
    Messages.find({$or:[{userFrom: userId, userTo: targetId}, {userFrom: targetId, userTo: userId}]}).sort('dateCreated').exec(
    function(err, messages){
        console.log("userId: " + userId);
        console.log("targetId: " + targetId);
        console.log(messages);
        callback(messages);
    });
}

function rateMatch(user, match){
  var score = 0;

  // gender search
  if(user.preferences.ownerGenderPreference === match.gender){
    score += 100;
  }

  // dog gender search
  if(user.preferences.dogGenderPreference === match.dog.gender){
    score += 100;
  }

  // age difference

  score += (100 + (user.preferences.ownerAgeDifferenceRange) -
    (
        // age difference in years
        Math.abs(user.dateOfBirth - match.dateOfBirth)
        / (60 * 60 * 24 * 1000 * 31 * 12)
    )
  );

  // dog age difference
  score += (100 + (user.preferences.dogAgeDifferenceRange) - Math.abs(user.dog.age - match.dog.age));

  return score;
}

function sortDiscover(req, callback){
  Matches.find({'user': req.user._id}, 'targetUser', function(err, ids){
    var invalidIds = [];
    invalidIds.push(req.user._id);

    for(var pastMatch in ids){
      invalidIds.push(ids[pastMatch].targetUser);
    }

    User.find({'_id': {$nin: invalidIds}}, function (err, matches) {
        if (err) return handleError(err);

        var bestMatch = null;

        for(var match in matches){
            if(!bestMatch){
                bestMatch = matches[match];
            }
            else if(rateMatch(req.user, matches[match]) > rateMatch(req.user, bestMatch)){
                bestMatch = matches[match];
            }
        }

        callback(bestMatch);
    });
  });

}

/* Discover */
module.exports.discover = function(req, res, next) {
  if(loggedIn(req)){
      sortDiscover(req, function(targetUser){
          getNotifications(req, function(notifications){
              res.render('discover', { title: 'Discover', user: req.user, targetUser: targetUser,
                  notifications: notifications})
          });


      });
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
                  user: req.user._id,
                  targetUser: targetUser._id,
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
                      res.redirect("/discover");

                  }
              });
          }
      });
  }
};

function markMessagesRead(userId, messages){
    for(var message in messages){
        if(messages[message].userTo == userId) {
            messages[message].read = true;
            messages[message].save(function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                }
                else {
                    console.log(data, ' saved');
                }
            });
        }
    }
}

/* Messages */
module.exports.messages = function(req, res, next) {
    if(loggedIn(req)) {
        getNotifications(req, function(notifications){
            getMatches(req, function (matchIds) {
                // get user objects for matches
                User.find({'_id': {$in: matchIds}}, function (err, users) {
                    if (req.query) {
                        var id = req.query.id;
                        if (id) {
                            User.findOne({'_id': id}, function(err, targetUser){
                                checkMatch(req.user._id, id, function (isMatch) {
                                    if (isMatch) {
                                        getMessages(req.user._id, id, function (messages) {
                                            console.log(messages);
                                            markMessagesRead(req.user._id, messages);
                                            res.render('messages', {matches: users, messages: messages, target: id,
                                                notifications:notifications, targetUser: targetUser});
                                        })
                                    }
                                    else {
                                        res.render('messages', {matches: users, target: id,
                                            notifications: notifications, targetUser:targetUser});
                                    }
                                })
                            });
                        }
                        else {
                            res.render('messages', {matches: users, notifications: notifications});
                        }
                    }
                    else {
                        res.render('messages', {matches: users, notifications: notifications});
                    }
                });
            });
        });
    }
    else{
        res.redirect('/');
    }

};

function validateMessage(req){
    var valid = true;
    if(!req.body.message || !req.user || !req.body.userTo){
        valid = false;
    }

    return valid;
}

module.exports.messagesPost = function(req, res, next){
    var id;
    if(req.query){
        id = req.query.id;
    }
    if(loggedIn(req)){
        if(validateMessage(req)){
            var newMessage = new Messages({
                message: req.body.message,
                userFrom: req.user._id,
                userTo: req.body.userTo,
                dateCreated: Date.now()
            });

            newMessage.save(function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                }
                else {

                    console.log(data, ' saved');
                    res.redirect('/messages?id=' + id)

                }
            })
        }
        else{
            res.redirect('/messages?id=' + id)
        }
    }else{
        res.redirect('/');
    }
};

/* Profile */
module.exports.profile = function(req, res, next) {
    if(loggedIn(req)) {
        var dob = new Date(req.user.dateOfBirth).toISOString().slice(0, 10);
        getNotifications(req, function(notifications){
            res.render('profile', {user: req.user, dob: dob, notifications: notifications});
        });
    }
    else{
        res.redirect("/");
    }
};

function validateProfileUpdate(req){
    var valid = true;
    if(
        !req.body.dog_name ||
        !req.body.dog_age ||
        !req.body.dog_breed ||
        !req.body.name ||
        !req.body.date ||
        !req.body.address
    ){
        valid = false;
    }

    return valid;
}

module.exports.proflePost = function(req, res, next){
    if(loggedIn(req)){

        if(validateProfileUpdate(req)){
            var updateUser = req.user;

            updateUser.dog[0].name = req.body.dog_name;
            updateUser.dog[0].age = req.body.dog_age;
            updateUser.dog[0].breed = req.body.dog_breed;
            updateUser.dog[0].dateLastEdited = Date.now();

            if(req.file){
                updateUser.dog[0].picture.contentType = req.file.mimetype;
                updateUser.dog[0].picture.data = req.file.buffer.toString("base64");
            }

            updateUser.name = req.body.name;
            updateUser.dateOfBirth = req.body.date;
            updateUser.suburb = req.body.address;
            updateUser.dateLastEdited = Date.now();

            updateUser.save(function(err, data){
                if(err){
                    console.log(err);
                    res.status(500);
                    res.render('error', {
                        message:err.message,
                        error:err
                    });
                }
                else{

                    res.redirect("/profile");

                }
            });
        }
        else{
            // TODO: Add error handling.
            res.redirect("/profile");
        }



    }
    else{
        res.redirect("/");
    }
};


/* Matches page */

function markMatchesRead(userId, matchIds){
    for(var match in matchIds){
        console.log("Match: " + match);
        Matches.findOne({user: matchIds[match], targetUser: userId, response: "accept", read: "false"},
            function(err, matchToRead){
            console.log("Match to Read: " + matchToRead);
            if(matchToRead){
                matchToRead.read = true;
                console.log("Match to Read: " + matchToRead);
                matchToRead.save(function(err, data){
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.render('error', {
                            message: err.message,
                            error: err
                        });
                    }
                    else {
                        console.log(data, ' saved');
                    }

                })
            }
        })
    }
}

module.exports.matches = function(req, res, next){
    if(loggedIn(req)){
       getMatches(req, function(matchIds){
           // get user objects for matches
           User.find({'_id': {$in: matchIds}}, function(err, users) {
               getNotifications(req, function(notifications){
                   markMatchesRead(req.user._id, matchIds);
                   res.render('matches', {matches: users, notifications: notifications});
               });
           });
       });
    }
    else {
        res.redirect('/');
    }
};


/* Preferences */
module.exports.preferences = function(req, res, next){
    if(loggedIn(req)){
        getNotifications(req, function(notifications){
            res.render('preferences', {user: req.user, notifications: notifications})
        });
    }
    else{
        res.redirect('/');
    }
};

function validatePreferencePost(req, callback){
    var valid = true;
    console.log(req.body);
    if(!req.body.dogAgeDifference || !req.body.dogGenderPreference ||
    !req.body.ownerAgeDifference || ! req.body.ownerGenderPreference){
        valid = false;
    }

    callback(valid);
}

module.exports.preferencesPost = function(req, res, next){
    console.log(req.body);
    if(loggedIn(req)){
        validatePreferencePost(req, function(check){
            if(check){
                var userUpdate = req.user;
                userUpdate.preferences.ownerGenderPreference = req.body.ownerGenderPreference;
                userUpdate.preferences.ownerAgeDifferenceRange = req.body.ownerAgeDifference;
                userUpdate.preferences.dogGenderPreference = req.body.dogGenderPreference;
                userUpdate.preferences.dogAgeDifferenceRange = req.body.dogAgeDifference;

                userUpdate.save(function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500);
                        res.render('error', {
                            message: err.message,
                            error: err
                        });
                    }else{
                        console.log(data + " updated");
                        res.redirect('/preferences');
                    }
                })
            }
            else{
                console.log("Form invalid");
                res.redirect('/preferences');
            }

        });

    }else{
        res.redirect('/');
    }
};

/* Logout */
module.exports.logout = function(req, res, next){
    req.logout();
    res.redirect('/');
};
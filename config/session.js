let tokens = {};

const mask = function (req, res, next) {
  req.session = {};
  if (req.query.token && tokens[req.query.token]) {
    req.session = tokens[req.query.token];
  }
  next();
}

const generateToken = function(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
  mask: mask,
  generateToken: generateToken,
  tokens: tokens
} 

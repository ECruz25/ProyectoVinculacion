const Strategy = require('passport-local').Strategy;
const fs = require('fs');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
    const usuario = info.usuario;
    if (usuario.username === username) {
      return done(null, usuario);
    }
  });

  passport.use(
    new Strategy(async (username, password, done) => {
      var info = JSON.parse(fs.readFileSync('./public/info.json', 'utf8'));
      const usuario = info.usuario;
      if (usuario.username === username) {
        console.log(password, usuario.password);
        const match = await bcrypt.compare(password, usuario.password);
        if (match) {
          return done(null, usuario);
        }
        return done(null, false);
      }
      return done(null, false);
    })
  );
};

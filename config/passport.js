const User = require("../models/User");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const config = require("./config");

module.exports = passport => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy({ usernameField: "email" }, function(
      email,
      password,
      done
    ) {
      User.findOne({ email: email }, async function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      async function(accessToken, refreshToken, profile, cb) {
        const name = profile.displayName;
        const email = profile.emails[0].value;
        try {
          const oldUser = await User.findOne({ email });
          if (oldUser) {
            return cb(null, oldUser);
          }
          const user = new User({
            name,
            email
          });
          const savedUser = await user.save();
          return cb(null, savedUser);
        } catch (error) {
          return cb(error, false);
        }
      }
    )
  );
};

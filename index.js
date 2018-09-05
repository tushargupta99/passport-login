const express = require("express");
const app = express();

app.get("/", (req, res) => res.sendFile("auth.html", { root: __dirname }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));


/*  PASSPORT */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => {
  res.send("You have successfully logged in");
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  FACEBOOK AUTHENTICATION  */

const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = 2114703652182529;
const FACEBOOK_APP_SECRET = "7ab67e6aa2373600bc3eade247f7423a" ;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)"
      ]
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
  });
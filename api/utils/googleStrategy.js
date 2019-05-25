const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports.google = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: "960408583269-t3r100j7bkf8293c2u41hhccop8b8ekk.apps.googleusercontent.com",
            clientSecret: "pSaEP1W2OA8olCgc99gYOMTi",
            callbackURL: "http://localhost:3000/google-auth"
        },
        (token, refreshToken, profile, done) => {
          console.log(profile)
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};
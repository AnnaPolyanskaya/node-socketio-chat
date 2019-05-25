const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const googleStrategy = require('./utils/googleStrategy');

const cors = require('cors');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');

const port = process.env.PORT || 5000;

const app = express();

// Mongo connection
mongoose.connect(keys.mongoUri)
    .then(() => {
        console.log('Mongo DB connected')
    })
    .catch(error => {
        console.log(error)
    })

// Body Parser    
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport
// app.use(passport.initialize());
require('./middleware/passport')(passport);

googleStrategy.google(passport);
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  

// Cors 
app.use(cors())


app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});


// Routes
app.use('/api/auth',
cors(), 
authRoutes);







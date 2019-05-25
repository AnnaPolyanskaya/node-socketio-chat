const express = require('express');
const passport = require('passport');
const controller = require('../controllers/auth');
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/google',  
passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
), controller.googleContr);
router.get('/google-code', controller.googleCode);


module.exports = router;
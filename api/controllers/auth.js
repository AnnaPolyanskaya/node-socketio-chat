const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const googleUtil = require('../utils/googleUtil');
const errorHandler = require('../utils/errorHandler');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports.register = async (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    const password = req.body.password


    const candidate = await User.findOne({email: req.body.email})

    if(candidate){ 
        res.status(403).json({
            message: "This email already registered"
        })
    } else {
        const user = await new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try{
            user.save()
                .then( result => {
                    console.log(result)
                    res.status(201).json({
                        user: user,
                        message: "Registered successfully"
                    })
                })
                .catch(error => {
                    console.log(error)
                }) 
        } catch(error) {
            errorHandler(res, error)
        }
    }
    
}

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({email: req.body.email})
    if(candidate){
        const password = bcrypt.compareSync(req.body.password, candidate.password)
        if(password){
            const token = jwt.sign({
                email: req.body.email,
                userId: candidate._id
            }, 
            keys.jwt,
            {expiresIn: 60*60})
            res.status(200).json({
                user: candidate,
                token
            })
        } else {
            res.status(403).json({
                message: 'Password is incorrect'
            })
        }    
    } else {
        res.status(404).json({
            message: "Email does not exist"
        })
    }
    
}

// module.exports.google = (req, res) => {
//     const url = googleUtil.urlGoogle();
//     res.status(201).json({
//         url
//     })
// }

// module.exports.googleCode = (req, res) => {
//     const code = req.body.code;
//     console.log(code)
//     const result= googleUtil.getGoogleAccountFromCode(code)
//     console.log(result)
// }


// module.exports.google = passport.authenticate('google', { scope: ['profile'] })

// module.exports.googleAuth = passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {res.redirect('http://localhost:3000/google-auth')}


module.exports.googleContr = passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile']});

module.exports.googleCode = (req, res) => {
    console.log(req.google)
}

module.exports.googleRedirect = passport.authenticate('google', {
    failureRedirect: '/'
}),
(req, res) => {}
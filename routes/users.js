const express = require('express');

const passport = require('passport');

const userController = require("../controllers/user_controller");

const router = express.Router();


console.log("User Router loaded");

//using middleware
router.get('/profile/:id', passport.checkAuthentication ,userController.profile);

router.get('/profile/update/:id',passport.checkAuthentication,userController.modify);

router.post('/update/:id', passport.checkAuthentication ,userController.update);

router.get('/delete/:id', passport.checkAuthentication ,userController.deleteUser);

router.get('/login',userController.login);

// router.get('/login/reset_pass',userController.resetTokenValues);

router.get('/signup',userController.signup);

router.post('/create',userController.create);

//use passport as middleware to authenticate
router.post('/create-session', 
	passport.authenticate('local',{failureRedirect:'/users/login'})
	,userController.createSession);

router.get('/remove-session',userController.removeSession);



router.get('/confirm_account/:id',userController.confirmAccount);



router.post('/reset_password',userController.resetToken);

router.get('/reset_password/token/:id/',userController.resetPasswordPage);

router.post('/reset_password/:id/',userController.resetPassword);


router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),userController.createSession);

router.get('/auth/facebook',passport.authenticate('facebook',{scope:['profile','email']}));

router.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/users/login'}),userController.createSession);

module.exports = router;
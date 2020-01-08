const express = require('express');

const userController = require("../controllers/user_controller")

const router = express.Router();

console.log("User Router loaded");

router.get('/profile',userController.profile);

router.get('/login',userController.login);

router.get('/signup',userController.signup);

router.post('/create',userController.create);

router.post('/create-session',userController.createSession);

router.post('/remove-session',userController.removeSession)

module.exports = router;
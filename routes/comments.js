const express = require('express');

const passport = require('passport');

const commentController = require("../controllers/comment_controller");

const router = express.Router();

console.log("Comment Router loaded");

router.post('/create' , passport.checkAuthentication , commentController.create);

router.get('/destroy/:id' , passport.checkAuthentication , commentController.destroy);

module.exports = router;
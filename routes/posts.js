const express = require('express');

const passport = require('passport');

const postController = require("../controllers/post_controller");

const router = express.Router();

console.log('Post router loaded');

router.post('/create',passport.checkAuthentication,postController.post);

router.get('/destroy/:id', passport.checkAuthentication ,postController.destroy);

module.exports = router;
const express = require('express');

const likeController = require("../controllers/like_controller");

const router = express.Router();

console.log('Like router loaded');

router.get('/toggle',likeController.toggleLike);

module.exports = router;
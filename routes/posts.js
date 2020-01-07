const express = require('express');

const postController = require("../controllers/post_controller");

const router = express.Router();

console.log('Post router loaded');

router.get('/',postController.post);

module.exports = router;
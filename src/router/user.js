const express = require('express')
const router = express.Router();
const controller = require('../controllers/controller_user');

router.get('/', controller.getAll);
router.post('/', controller.postar);

module.exports = router;
const express = require('express');
const router = express.Router();

const {getUser} = require('../controllers/userController');

router.get('/home',getUser);

module.exports = router;
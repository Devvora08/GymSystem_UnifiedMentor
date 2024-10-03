const express = require('express');
const router = express.Router();

const {getMember} = require("../controllers/memberController");

router.get('/home',getMember); 

module.exports = router;
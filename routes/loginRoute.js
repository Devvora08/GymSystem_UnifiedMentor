const express = require('express');
const AllUser = require('../model/allUsersSchema');
const router = express.Router();

const {getLogin,postLogin} = require("../controllers/loginController");

router.route("/")
.get(getLogin)
.post(postLogin);

module.exports = router;
const express = require('express');
const router = express.Router();

const {getMember, getBill, getDetails, getNotification, cancelMember, getShop} = require("../controllers/memberController");

router.get('/home',getMember); 
router.get('/details', getDetails);
router.get('/bill',getBill);
router.get('/notification',getNotification);
router.get('/cancelmember',cancelMember);
router.get('/shop', getShop);

module.exports = router;
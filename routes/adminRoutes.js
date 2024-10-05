const express = require('express');
const router = express.Router();

const {getAdmin, getBills, getNotify, getShop, postNotify} = require('../controllers/adminController');

router.get('/home',getAdmin);

router.get('/notify',getNotify);
router.post('/notify',postNotify);

router.get('/bills',getBills);

router.get('/shop',getShop);



module.exports = router;
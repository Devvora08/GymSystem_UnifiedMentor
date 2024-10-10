const express = require('express');
const router = express.Router();

const {getAdmin, getBills, getNotify, getShop, postNotify,getMembers,singleItem,editItem,viewNotifications} = require('../controllers/adminController');

router.get('/home',getAdmin);
router.get('/members',getMembers);
router.get('/notify',viewNotifications)
router.get('/notify/post',getNotify);
router.post('/notify/post',postNotify);

router.get('/members/bills',getBills);

router.get('/shop',getShop);
router.get('/shop/:id',singleItem);
router.post('/shop/:id',editItem);



module.exports = router;
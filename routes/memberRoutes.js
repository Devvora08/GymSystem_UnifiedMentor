const express = require('express');
const router = express.Router();

const {getMember, getBill, getDetails, getNotification,getSingleNotification, cancelMember,deleteMember,
     getShop,getSingleItem,addToCart, deleteCartItem} = require("../controllers/memberController");

router.get('/home',getMember); 
router.get('/details', getDetails);
router.post('/details',deleteCartItem);
router.get('/bill',getBill);
router.get('/notification',getNotification);
router.get('/notification/:id',getSingleNotification);
router.post('/notification/:id',getNotification);
router.get('/cancelmember',cancelMember);
router.post('/cancelmember',deleteMember);
router.get('/shop', getShop);
router.get('/shop/:id',getSingleItem);
router.post('/shop/:id',addToCart);

module.exports = router;
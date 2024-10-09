const express = require('express');
const router = express.Router();

const {getUser,becomeMember,getPlans,getuserShop,newMemberEntry} = require('../controllers/userController');

router.get('/home',getUser);
router.get('/membership', becomeMember);
router.post('/membership',newMemberEntry);
router.get('/plans',getPlans);
router.get('/store',getuserShop);


module.exports = router;
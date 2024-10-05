const express = require('express');
const router = express.Router();

const {getUser,becomeMember,getPlans,getStore} = require('../controllers/userController');

router.get('/home',getUser);
router.get('/membership', becomeMember);
router.get('/plans',getPlans);
router.get('/store',getStore);

module.exports = router;
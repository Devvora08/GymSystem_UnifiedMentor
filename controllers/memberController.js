function getMember(req,res){
    res.render('memberfront/memberHome');    
};
function getBill(req,res){
    res.render('memberfront/memberBill');    
};
function getDetails(req,res){
    res.render('memberfront/memberDetail');    
};
function cancelMember(req,res){
    res.render('memberfront/cancelMember');    
};
function getNotification(req,res){
    res.render('memberfront/memberNotification');    
};
function getShop(req,res){
    res.render('memberfront/memberShop');    
};



module.exports = {
    getMember,
    getBill,
    getDetails,
    cancelMember,
    getNotification,
    getShop
};
function getUser(req,res){
    res.render('userfront/userHome');
};
function becomeMember(req,res){
    res.render('userfront/userMembership');
}
function getPlans(req,res){
    res.render('userfront/userPlans');
}
function getStore(req,res){
    res.render('userfront/userStore');
}

module.exports = {
    getUser,
    becomeMember,
    getPlans,
    getStore,
};
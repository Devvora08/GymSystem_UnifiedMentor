const {getUser} = require('../service/auth');

async function restrictToLoggedInOnly(req,res,next) {
    const userUid = req.cookies?.uid;

    if(!userUid) return res.redirect('/login');
    const user = getUser(userUid);
    if(!user)  return res.redirect('/login');
    
    req.user = user;
    next()
}

function restrictTo(roles = []){
    return function(req, res, next){
        if(!req.user){
            return res.redirct("/login");   
        }
        if(!roles.includes(req.user.role)){
            return res.end("unauthorized !!!");
        }
        next();
    }
}



module.exports = {
    restrictToLoggedInOnly,
    restrictTo,
};
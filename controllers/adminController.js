const Notification = require('../model/notificationSchema');

function getAdmin(req,res){
    res.render('adminfront/admin');
};
function getBills(req,res){
    res.render('adminfront/bill');
};
function getNotify(req,res){
    res.render('adminfront/notify');
};
async function postNotify(req,res){
    //logic of making a notification here. make a form type info box on get notify route to make new notifications
    const notifybody = req.body;
    if(!notifybody.title || !notifybody.message || !notifybody.dateposted) return null;
    try{
        const newNotification = await Notification.create({
            title: notifybody.title,
            message:notifybody.message,
            datePosted:notifybody.dateposted
        });
        console.log("a new notification is just created... ");
        return res.redirect("/admin/home");
    }
    catch(error){
        console.log("error found in handling notification, check...",error);
    }
}
function getShop(req,res){
    res.render('adminfront/shop');
};

module.exports = {
    getAdmin,
    getBills,
    getNotify,
    postNotify,
    getShop,
};  
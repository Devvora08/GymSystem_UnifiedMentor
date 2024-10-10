const Notification = require('../model/notificationSchema');
const Shop = require('../model/shopSchema');
const AllMember = require('../model/allMembersSchema');
const AllUser = require('../model/allUsersSchema');
const Bill = require('../model/billschema');


function getAdmin(req,res){
    res.render('adminfront/admin');
};
async function getMembers(req,res){
    const allMembers = await AllMember.find({});
    const allUsers = await AllUser.find({role:"member"});
    const membersWithDetails = allUsers.map(user => {
        const memberDetails = allMembers.find(member => member.userId.equals(user._id));
        return {
            ...user.toObject(), // Convert Mongoose document to plain object
            memberDetails // Add extra details from AllMember
        };
    });
    res.render('adminfront/members.ejs',{
        membersWithDetails
    });
}
async function getBills(req, res) {
    try {
        // Fetch all members
        const allMembers = await AllMember.find({});
        
        // Fetch all users with role "member"
        const allUsers = await AllUser.find({ role: "member" });
        
        // Fetch all bills (assuming each bill has a reference to a member's _id)
        const allBills = await Bill.find({});

        // Map through the users, attach member details and bill details
        const membersWithDetails = allUsers.map(user => {
            // Find matching member details for the current user
            const memberDetails = allMembers.find(member => member.userId.equals(user._id));
            
            // Find matching bill details for the member
            const billDetails = allBills.filter(bill => bill.memberId.equals(memberDetails._id));

            // Return a combined object with user, member, and bill details
            return {
                ...user.toObject(), // Convert Mongoose document to plain object
                memberDetails, // Add extra details from AllMember
                billDetails // Add extra details from Bills
            };
        }); 
        console.log(membersWithDetails);
       
        res.render('adminfront/bill', { membersWithDetails });
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).send('Server error');
    }
}
async function viewNotifications(req,res){

    try {
        const notifications = await Notification.find({});  //retrieves all notifications
        res.render('adminfront/showNotifications', {
            notifications,                                  //sending notifications all to front end
        });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Server error');
    }
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
        return res.redirect("/admin/notify");
    }
    catch(error){
        console.log("error found in handling notification, check...",error);
    }
}
async function getShop(req,res){
    const clothing = await Shop.find({ category: "Clothing & Accessories" });
    const equipment = await Shop.find({ category: "Equipment" });
    const supplement = await Shop.find({ category: "Supplement" });
    const health = await Shop.find({ category: "Health and Wellness" });
    res.render('adminfront/shop', {
        clothing,equipment,supplement, health,
    });
};
async function singleItem(req, res) {
    try {
        const shopitm = await Shop.findById(req.params.id);
        res.render('adminfront/adminShopSingle', { shopitm });
    } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).send('Server error');
    }
};
async function editItem(req,res){
    const {description, price, stockQuantity} = req.body;
    //console.log(description, price, stockQuantity);
    const myItem = await Shop.findById(req.params.id);
    //console.log(myItem);
    try{
        if (!myItem) {
            return res.status(404).send('Item not found');
        }
        myItem.description = description;
        myItem.price = price;
        myItem.stockQuantity = stockQuantity;
        //console.log("Updated new details are : ",myItem);
        const savednewDetails = await myItem.save();
        res.redirect('/admin/shop');
    }
    catch(error){
        console.error('Error updating item:', err);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAdmin,
    getBills,
    viewNotifications,
    getNotify,
    postNotify,
    getShop,
    singleItem,
    editItem,
    getMembers
};  
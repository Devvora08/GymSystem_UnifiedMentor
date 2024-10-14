const Notification = require('../model/notificationSchema');
const Shop = require('../model/shopSchema');
const AllMember = require('../model/allMembersSchema');
const AllUser = require('../model/allUsersSchema');
const Bill = require('../model/billschema');
const Admin = require('../model/adminSchema');


async function getAdmin(req, res) {
    try {
        // Fetch all admins
        const admins = await AllUser.find({ role: 'admin' });
        if (!admins || admins.length === 0) {
            return res.status(404).json({ msg: "No admins found" });
        }
        
        // Fetch total users count
        const totalUsersCount = await AllUser.countDocuments();
        const allUsers = await AllUser.find({});
        // Fetch member  details
        const members = await AllMember.find({});
        // Fetch recent member
        const recentMember = await AllMember.findOne()
            .sort({ joinDate: -1 });

        let userDetails = null; // Initialize a variable for user details

        // If recent member is found, fetch its user details
        if (recentMember) {
            userDetails = await AllUser.findById(recentMember.userId);
        }
        const basicplan = await AllMember.find({membershipPlan:"basic"});
        //console.log(basicplan)
        // Fetch unpaid bills and populate member information
        const unpaidBills = await Bill.find({ status: 'Unpaid' });
             // Adjust according to your schema

        // Fetch recently updated items from the Shop collection
        const recentItems = await Shop.find({}).sort({ updatedAt: -1 }).limit(3); 
        const recentNotification = await Notification.findOne().sort({ datePosted: -1 }).exec();
        const basicMembers = await AllMember.find({ membershipPlan: 'Basic' });
        const goldMembers = await AllMember.find({ membershipPlan: 'Gold' });
    
        // Fetch members with the "Standard" membership plan
        const standardMembers = await AllMember.find({ membershipPlan: 'Standard' });
        
        // Fetch members with the "Premium" membership plan
        const premiumMembers = await AllMember.find({ membershipPlan: 'Premium' });
        
        // Fetch members with the "Premium-Gold" membership plan
        const premiumGoldMembers = await AllMember.find({ membershipPlan: 'Premium-Gold' });
        // Hardcoded upcoming events
        const today = new Date();
        const events = [
            {
                name: 'Yoga Class',
                description: 'Join our relaxing and refreshing yoga class.',
                date: new Date(today.setDate(today.getDate() + 1)), // 1 day from today
                time: '10:00 AM',
                admin: admins[0] // Assuming the first admin organizes this event
            },
            {
                name: 'HIIT Workout',
                description: 'High-Intensity Interval Training to get your heart pumping!',
                date: new Date(today.setDate(today.getDate() + 3)), // 3 days from today
                time: '5:00 PM',
                admin: admins[1] // Second admin organizes this event
            },
            {
                name: 'Nutrition Workshop',
                description: 'Learn about balanced diets and meal planning from experts.',
                date: new Date(today.setDate(today.getDate() + 5)), // 5 days from today
                time: '2:00 PM',
                admin: admins[0] // First admin again
            }
        ];
       

        // Render admin homepage with all required data
        res.render('adminfront/admin', {
            adminDetails: admins,
            unpaidBills,
            members,
            basicMembers,
            standardMembers,
            goldMembers,
            premiumMembers,
            premiumGoldMembers,
            events,
            allUsers,
            recentItems,
            recentNotification,
            totalUsersCount,
            recentMember, // Keep the recent member object
            userDetails,  // Pass the user details as well
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}
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
        //console.log(membersWithDetails);
       
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
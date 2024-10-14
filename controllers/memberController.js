const AllUser = require('../model/allUsersSchema');
const AllMember = require('../model/allMembersSchema');
const Bill = require('../model/billschema');
const Admin = require('../model/adminSchema');
const Notification = require('../model/notificationSchema');
const Plan = require('../model/allPlanSchema');
const Shop = require('../model/shopSchema');

const mongoose = require('mongoose');

const { getUser } = require('../service/auth');




async function getMember(req, res) {
    const token = req.cookies.uid; // or wherever you're storing it
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized access" });
    }

    const currentUser = getUser(token); 
    const user = await AllUser.findOne({ _id: currentUser._id }); // take user's name from here.
    const memberDetails = await AllMember.findOne({ userId: user._id });
    const today = new Date();
    if (!memberDetails) {
        return res.status(404).json({ msg: "Member details not found" });
    }

    const bills = await Bill.find({ memberId: memberDetails._id });
    const admins = await AllUser.find({ role: 'admin' });
    const recentNotification = await Notification.findOne().sort({ datePosted: -1 }).exec();
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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Get current month (0-11)

    // Fetch the last three plans: premium, gold, and premium-gold
    const plans = await Plan.find({ planName: { $in: ["Premium", "Gold", "Premium-Gold"] } });

    if (!plans.length) {
        return res.status(404).json({ msg: "No plans found" });
    }

    // Calculate discount for each plan
    const discountedPlans = plans.map(plan => {
        const discountPercentage = 20; // Example discount of 20%
        const discountedPrice = plan.planPrice - (plan.planPrice * (discountPercentage / 100));

        // Calculate the offer valid period (15th-20th of next month)
        const startOfferDate = new Date(currentDate.getFullYear(), currentMonth + 1, 15);
        const endOfferDate = new Date(currentDate.getFullYear(), currentMonth + 1, 20);

        return {
            planName: plan.planName,
            planDuration: plan.planDuration,
            originalPrice: plan.planPrice,
            discountedPrice: discountedPrice.toFixed(2), // Format to 2 decimals
            description: plan.description,
            offerPeriod: `${startOfferDate.toLocaleDateString()} - ${endOfferDate.toLocaleDateString()}`,
            logoUrl: plan.planLogoUrl,
            adminContact: "Dev Vora - 9979976864" // You can fetch this from the Admin collection if needed
        };
    });

    res.render('memberfront/memberHome', {
        admins,
        memberDetails,
        user,
        recentNotification,
        bills,
        events,
        discountedPlans,
    });
}
async function getBill(req, res) {
    const token = req.cookies.uid; // or wherever you're storing it
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized access" });
    }

   
    const currentUser = getUser(token); 
    const user = await AllUser.findOne({ _id: currentUser._id });
    if (!user || user.role !== 'member') {
        return res.status(404).json({ msg: "User not found or not a member" });
    }

    // Step 4: Find the corresponding member details
    const memberDetails = await AllMember.findOne({ userId: user._id });
    if (!memberDetails) {
        return res.status(404).json({ msg: "Member details not found" });
    }
    const bills = await Bill.find({ memberId: memberDetails._id });
    //console.log(memberDetails,bills,user);
    res.render('memberfront/memberBill', { bills, memberDetails,user}); //use details to display from these 3 variables.

};
async function getDetails(req, res) {
    try {
        // Step 1: Retrieve the token from cookies
        const token = req.cookies.uid; // Same as in the cart function
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized access" });
        }

        const currentUser = getUser(token);

        const user = await AllUser.findOne({ _id: currentUser._id });

        if (!user || user.role !== 'member') {
            return res.status(404).json({ msg: "User not found or not a member" });
        }
        const memberDetails = await AllMember.findOne({ userId: user._id });
        if (!memberDetails) {
            return res.status(404).json({ msg: "Member details not found" });
        }
        const myPlan = await Plan.findOne({ planName: memberDetails.membershipPlan });  //out of 5 plans finding the one chosen by member
        const lastMsg = await Notification.findOne({}).sort({ _id: -1 });           //sending the most recent notification sent by admin
        let cartItems;

        const itemNames = memberDetails.cart.split(",").map(item => item.trim());
        cartItems = await Shop.find({ itemName: { $in: itemNames } });

        //console.log(cartItems);  this contains the array of the items
        res.render('memberfront/memberDetail', { user, memberDetails, myPlan, lastMsg, cartItems });

    } catch (error) {
        console.error("Error fetching member details:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
async function deleteCartItem(req, res) {
    // Step 1: Retrieve the token from cookies
    const token = req.cookies.uid;
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized access" });
    }

    // Step 2: Get the current user from the token
    const currentUser = getUser(token);
    const user = await AllUser.findOne({ _id: currentUser._id });

    // Step 3: Check if user exists and is a member
    if (!user || user.role !== 'member') {
        return res.status(404).json({ msg: "User not found or not a member" });
    }

    // Step 4: Find the member details based on user ID
    const memberDetails = await AllMember.findOne({ userId: user._id });
    if (!memberDetails) {
        return res.status(404).json({ msg: "Member details not found" });
    }

    // Step 5: Get the item ID from the request body
    const itemId = req.body.itemId;

    // Assuming the cart is a string of item names
    if (memberDetails.cart) {
        // Step 6: Get the item from the shop collection to find its name
        const itemToRemove = await Shop.findById(itemId);
        if (!itemToRemove) {
            return res.status(404).json({ msg: "Item not found in shop" });
        }

        // Step 7: Split the cart string into an array
        const cartItems = memberDetails.cart.split(",").map(item => item.trim());

        // Step 8: Remove the item from the cart
        const updatedCart = cartItems.filter(item => item !== itemToRemove.itemName);

        // Step 9: Update the member's cart
        memberDetails.cart = updatedCart.join(", ");
        await memberDetails.save();
    }
    res.redirect('/member/details');
}

function cancelMember(req, res) {
    res.render('memberfront/cancelMember');
};
async function deleteMember(req,res){
    const { email, password: inputPassword } = req.body; // Extract email and password from the form
    const currentUser = req.user._id;
    try{
        const user = await AllUser.findById(currentUser).select('+password');  //taking in only password and email
        if(!user) res.json({msg:"Re-enter the details properly"});
        if(user.email !== email || user.password !== inputPassword) res.json({msg:"Enter correct credentials !"});
        else{
             const updateUser = await AllUser.findByIdAndUpdate(currentUser, {role:"user"}); //updating the alluser collection first
             const deleted = await AllMember.findOneAndDelete({userId: currentUser}); //deleting the member
             if (deleted) {
                const deleteBill = await Bill.deleteMany({ memberId: deleted._id }); // deleting all bills associated with the member
            }
             res.status(200).redirect('/');
        }
    }
    catch(error){
        console.error('Error canceling membership:', error);
        res.status(500).json({ error: 'An error occurred while canceling membership' });
    }
}


const getSingleNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        res.render('memberfront/notificationDetail', { notification });
    } catch (err) {
        console.error('Error fetching notification:', err);
        res.status(500).send('Server error');
    }
};
async function getNotification(req, res) {
    try {
        const notifications = await Notification.find({});  //retrieves all notifications
        res.render('memberfront/memberNotification', {
            notifications,                                  //sending notifications all to front end
        });
    }
    catch (error) {
        console.error('Error fetching notifications:', err);
        res.status(500).send('Server error');
    }
};
async function getShop(req, res) {
    const clothing = await Shop.find({ category: "Clothing & Accessories" });
    const equipment = await Shop.find({ category: "Equipment" });
    const supplement = await Shop.find({ category: "Supplement" });
    const health = await Shop.find({ category: "Health and Wellness" });
    res.render('memberfront/memberShop', {
        clothing,
        equipment,
        supplement,
        health,
    });
}

async function getSingleItem(req, res) {
    try {
        const shopitm = await Shop.findById(req.params.id);
        res.render('memberfront/memberShopSingle', { shopitm });
    } catch (err) {
        console.error('Error fetching notification:', err);
        res.status(500).send('Server error');
    }
};

async function addToCart(req, res) {
    const token = req.cookies.uid;
    const user = getUser(token);

    if (!user) {
        console.error('Failed to decode user from token:', token);
        return res.status(401).send('Unauthorized');
    }

    const memberId = user.memberId;
    const productId = req.params.id;
    const productName = req.body.productName;
    try {
        const member = await AllMember.findById(memberId);
        if (!member) {
            return res.status(404).send('Member not found');
        }
        if (member.cart) {
            member.cart += `, ${productName}`;
        } else {
            member.cart = productName;
        }
        await member.save();
        res.redirect(`/member/shop/${productId}`);
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Server error');
    }
}



module.exports = {
    getMember,
    getBill,
    getDetails,
    cancelMember,
    deleteMember,
    getNotification,
    getSingleNotification,
    getShop,
    getSingleItem,
    addToCart,
    deleteCartItem,
}
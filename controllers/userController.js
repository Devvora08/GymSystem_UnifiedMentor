const Shop = require('../model/shopSchema');
const Plan = require('../model/allPlanSchema');
const AllMember = require('../model/allMembersSchema');
const AllUser = require('../model/allUsersSchema');
const Bill = require('../model/billschema');

function getUser(req, res) {
    res.render('userfront/userHome');
};
async function becomeMember(req, res) {
    const allPlans = await Plan.find({}); //retrieve all plans for user to be shown and selected(1)
    res.render('userfront/userMembership', { allPlans });
};

async function newMemberEntry(req, res) {
    const { age, membershipPlan } = req.body; 
    const userId = req.user._id;  

    try {
      
        const updateUser = await AllUser.findByIdAndUpdate(userId, { role: 'member' });
        const myPlan = await Plan.find({ _id: membershipPlan });

        if (myPlan.length > 0) {
            console.log(myPlan[0].planDuration);
        } else {
            console.log("No plan found with the given ID.");
        }
      
        const newMember = await AllMember.create({
            userId: userId,  
            age: age,
            membershipPlan: myPlan[0].planName,
            mobileNumber: 999999999,
            planDuration: myPlan[0].planDuration,
            startDate: new Date(),
        });        

        const newBill = await Bill.create({
            memberId: newMember._id, // Reference to the newly created member
            username: updateUser.email, // Assuming username is the email from AllUser
            amount: myPlan[0].planPrice, // Assuming planPrice is the bill amount
            status: 'Unpaid', // Set initial status to 'Unpaid'
            dueDate: Date.now(),
            description: `Membership fee for ${myPlan[0].planName}`, // Optional description
        });
        res.status(201).render('userfront/welcomeMember');
    } catch (error) {
        console.error("Error processing membership:", error);
        res.status(500).json({ message: 'Error processing membership.' });
    }
}


async function getPlans(req, res) {
    try {
        const allPlans = await Plan.find({});
        res.render('userfront/userPlans', { allPlans });
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).send("Server error, unable to fetch plans.");
    }
};

async function getuserShop(req, res) {
    const clothing = await Shop.find({ category: "Clothing & Accessories" });
    const equipment = await Shop.find({ category: "Equipment" });
    const supplement = await Shop.find({ category: "Supplement" });
    const health = await Shop.find({ category: "Health and Wellness" });
    res.render('userfront/userStore', {
        clothing,
        equipment,
        supplement,
        health,
    });
}
module.exports = {
    getUser,
    becomeMember,
    getPlans,
    getuserShop,
    newMemberEntry
};
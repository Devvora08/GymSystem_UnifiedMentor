const Shop = require('../model/shopSchema');
const Plan = require('../model/allPlanSchema');
const AllMember = require('../model/allMembersSchema');
const AllUser = require('../model/allUsersSchema');
const Bill = require('../model/billschema');
const Admin = require('../model/adminSchema');

async function getUser(req, res) {
    try {
        const userId = req.user._id; // Assuming you're using a middleware that adds the user to req
        const today = new Date();

        // Fetch admins
        const admins = await AllUser.find({ role: 'admin' });
        if (!admins || admins.length === 0) {
            return res.status(404).json({ msg: "No admins found" });
        }
        const adminDetails = await Admin.find({});

        // Hardcoded upcoming events
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

        // Fetch the last three plans
        const plans = await Plan.find({ planName: { $in: ["Premium", "Gold", "Premium-Gold"] } });
        if (!plans || plans.length === 0) {
            return res.status(404).json({ msg: "No plans found" });
        }

        // Calculate discount for each plan
        const discountedPlans = plans.map(plan => {
            const discountPercentage = 20; // Example discount of 20%
            const discountedPrice = plan.planPrice - (plan.planPrice * (discountPercentage / 100));

            return {
                planName: plan.planName,
                planDuration: plan.planDuration,
                originalPrice: plan.planPrice,
                discountedPrice: discountedPrice.toFixed(2), // Format to 2 decimals
                description: plan.description,
                logoUrl: plan.planLogoUrl,
                adminContact: "Dev Vora - 9979976864" // Adjust this as needed
            };
        });

        // Fetch random products from the shop
        const randomProducts = await Shop.aggregate([{ $sample: { size: 3 } }]);

        // Optional: Fetch user-specific data, if necessary
        //const userDetails = await User.findById(userId).select('membershipStatus'); // Example field

        res.render('userfront/userHome', {
            admins,
            events,
            discountedPlans,
            randomProducts,
            adminDetails,
        });

    } catch (error) {
        console.error("Error fetching user home data:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

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
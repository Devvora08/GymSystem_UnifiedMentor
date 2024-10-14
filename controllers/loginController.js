const AllUser = require('../model/allUsersSchema');
const { v4: uuidv4 } = require('uuid');
const {setUser} = require('../service/auth');
const AllMember = require('../model/allMembersSchema')

function getLogin
    (req,res) {
        res.render("login");
    };

async function postLogin(req, res) {  
    const userbody = req.body; 
    try {
        const checkuser = await AllUser.findOne({ email: userbody.email, password: userbody.password });
        if (!checkuser) {
            return res.status(401).redirect('/'); // Redirect to home if user not found
        }

        let token;

        // Fetch the member only if the user is a member
        if (checkuser.role === 'member') {
            const member = await AllMember.findOne({ userId: checkuser._id });
            if (!member) {
                return res.status(404).json({ msg: "Member not found" }); // Handle case where member is not found
            }
            // Create token with memberId for members
            token = setUser({ ...checkuser.toObject(), memberId: member._id });
        } else {
            // Create token without memberId for non-members (user/admin)
            token = setUser(checkuser.toObject());
        }

        res.cookie("uid", token); // Set the token in the cookie

        // Redirect based on user role
        let userRole = checkuser.role;
        if (userRole === 'admin') {
            return res.redirect('/admin/home');
        } else if (userRole === 'member') {
            return res.redirect('/member/home');
        } else if (userRole === 'user') {
            return res.redirect('/user/home');
        } else {
            return res.status(400).json({ msg: "Invalid user role" });
        }        
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}



module.exports = {
    getLogin,
    postLogin,
}
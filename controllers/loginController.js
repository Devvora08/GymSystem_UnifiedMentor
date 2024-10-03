const AllUser = require('../model/allUsersSchema');
const { v4: uuidv4 } = require('uuid');
const {setUser} = require('../service/auth');

function getLogin
    (req,res) {
        res.send(` <h1>Login</h1>
        <form action="/login" method="POST">
            <label for="email">Username (Email):</label><br>
            <input type="email" id="email" name="email" required><br><br>
            
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            
            <button type="submit">Submit</button>
        </form>`);
    };


async function postLogin
    (req,res){  
        const userbody = req.body; 
        try{
            const checkuser = await AllUser.findOne({ email: userbody.email, password: userbody.password });
            if (!checkuser) {
                return res.status(401).redirect('/');  // here also either render a new page for error, common for all errors, or redirect to home page
            }
            if (checkuser) {
                //const sessionId = uuidv4();
                //setUser(sessionId, checkuser);
                const token = setUser(checkuser)
                //res.cookie("uid", sessionId);
                res.cookie("uid", token);
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
            }        
        }
        catch(error){
            console.error('Error creating user:', error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    };



module.exports = {
    getLogin,
    postLogin,
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const AllUser = require('./model/allUsersSchema'); 
const Bill = require('./model/billschema');
const Plan = require('./model/allPlanSchema');
const AllMember = require('./model/allMembersSchema');
const Shop = require('./model/shopSchema');
const Admin = require('./model/adminSchema');
const {restrictToLoggedInOnly, restrictTo} = require('./middleware/middleware');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const memberRouter = require('./routes/memberRoutes');
const loginRouter = require('./routes/loginRoute');

const app = express();
const port = process.env.PORT || 3000;   // using env file for dynamic porting for deployement

mongoose.connect("mongodb://127.0.0.1:27017/SynergyFitness").then(()=>{
    console.log('Connection to the Synergy-Fitness Database has been established !');
}).catch((err)=>{
    console.log('error found - ',err);
}); 

//Setting up the view engine for frontend ui
app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));

//Middlewares here
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/',(req,res)=>{         // This is the official home page. no user,member or admin auth required, sign up will be found here to become a user.
    res.render("homepage.ejs");
});

app.get('/user/shop/random-products', async (req, res) => {
    try {
        // Fetch 3 random products from the Shop collection
        const randomProducts = await Shop.aggregate([{ $sample: { size: 3 } }]);
        res.json({ randomProducts }); // Send the products as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch random products' });
    }
});

app.get('/signup',(req,res)=>{
    res.render('signup');
});
app.post('/signup',async (req,res)=>{
    const newUser = req.body;
    const makeUser = await AllUser.create({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role,
        signupDate: new Date()
    });
    console.log(makeUser); // checking the new entry 
    res.redirect("/");
});

//Routes controlled here
app.use("/user", restrictToLoggedInOnly,restrictTo(["user"]),userRouter);
app.use("/admin", restrictToLoggedInOnly, restrictTo(["admin"]), adminRouter);
app.use("/member",restrictToLoggedInOnly,restrictTo(["member"]), memberRouter);
app.use("/login",loginRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


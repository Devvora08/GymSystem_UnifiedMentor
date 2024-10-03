const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const AllUser = require('./model/allUsersSchema'); 
const AllMember = require('./model/allMembersSchema');
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


app.get('/',(req,res)=>{
    res.send(` <button onclick="window.location.href='/login'">Login</button>
    <button onclick="window.location.href='/signup'">Sign Up</button>`);
});

app.get('/signup',(req,res)=>{
    res.send('hey you are signing up now');
})
//Routes controlled here
app.use("/user", restrictToLoggedInOnly,restrictTo(["user"]),userRouter);
app.use("/admin", restrictToLoggedInOnly, restrictTo(["admin"]), adminRouter);
app.use("/member",restrictToLoggedInOnly,restrictTo(["member"]), memberRouter);
app.use("/login",loginRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


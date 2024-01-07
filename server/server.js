import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// schema below
import User from './Schema/User.js';

const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());
server.use(cors(
    {
        origin: 'https://laganiforum.vercel.app/',
        credentials: true,
        methods: ['GET', 'POST', 'OPTIONS']
    }
));
server.options('*', cors());
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
});

const formatDatatoSend = (user) => {
    if (!process.env.SECRET_ACCESS_TOKEN_KEY) {
        console.error('Missing SECRET_ACCESS_TOKEN_KEY in environment variables');
        return null;
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_TOKEN_KEY, { expiresIn: '100h' });
    return {
        accessToken,
        profile_img: user.personal_info.profile_img,
        fullname: user.personal_info.fullname,
        username: user.personal_info.username,
    };
};


const generateUsername = async(email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({"personal_info.username": username}).then((result)=> result);

    isUsernameNotUnique ? username += nanoid().substring(0,3) : "";
    return username;
}

server.post("/signup", (req, res) => {
    let {fullname, email, password} = req.body;

    // valiating data from frontend
    if(!fullname || !email || !password) {
        return res.status(403).json({msg: "Please enter all fields"});
    }

    if(fullname.length < 3) {
        return res.status(403).json({msg: "Fullname must be at least 3 characters"});
    }
    if(!emailRegex.test(email)) {
        return res.status(403).json({msg: "Please enter a valid email"});
    }

    if(!passwordRegex.test(password)) {
        return res.status(403).json({msg: "Password must be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"});
    }

    bcrypt.hash(password, 10, async (err, hash) => {
        if(err) {
            return res.status(500).json({msg: "Server error"});
        }
        let username = await generateUsername(email);
        let user = new User({
            personal_info: {
                fullname: fullname,
                username: username,
                email: email,
                password: hash
            },
        });

        user.save()
        .then((u) => {
          return res.status(200).json(formatDatatoSend(u));
        })
        .catch((err) => {

            if(err.code === 11000) {
                return res.status(403).json({msg: "Email already exists"});
            }

          return res.status(500).json({ 'Server error': err.message });
        });
    })

})

server.post("/signin",(req,res)=> {
    let {email, password} = req.body;
    User.findOne({"personal_info.email": email})
    .then((user)=> {
        if(!user) {
            return res.status(403).json({msg: "User not found"})
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if(err) {
                return res.status(403).json({msg: "Error occured during authentication please try again"});
            }

            if(!result) {
                return res.status(403).json({msg: "Incorrect password"});
            }

            return res.status(200).json(formatDatatoSend(user));
        })
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({"Server error": err.message})
    })
})

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})

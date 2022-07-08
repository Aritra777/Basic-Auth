const express = require("express");
require("dotenv").config();
// For password hasing
const bcrypt = require("bcryptjs");
// JWT TOKEN
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const isAuth = require("./middleware/auth");

// Connection
require("./config/database").connect();

// Models
const User = require("./model/user");

// Express
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Hello from auth system</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && password && firstname && lastname)) {
      return res.status(400).send("All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("User already exists");
    } else {
      // Hash password
      const myEncpass = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: myEncpass,
      });
      // handle password
      user.password = undefined;

      // Creating Token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(201).json(user);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/login", async (req, res) => {
  try {
    // Gettng All Info ------->
    const { email, password } = req.body;

    // Checking Madetory Fields ------->
    if (!(email && password)) {
      res.status(400).send("field is missing");
    } else {
      // Getting user from Database ------->
      const user = await User.findOne({ email });

      // if(!user){
      //     res.status(400).send("you are not register");
      // }

      // Comparing and Varifing the Password ------->
      if (user && (await bcrypt.compare(password, user.password))) {
        // if Password varified then giving the token ------->
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        user.password = undefined;
        // res.status(200).json(user);

        // if you want to use cookies
        const options = {
            expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ),
            httpOnly: true,
        }
        res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user
        })
        setTimeout(() => {
            res.clearCookie('token');
            res.end()
        }, 10000);

      } else {
        res.status(400).send("email or password is incorrect");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", isAuth, (req, res) => {
    // Protecting The route
    res.send("welcome to dashboard");
})

module.exports = app;

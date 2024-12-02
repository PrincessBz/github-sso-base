const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const path = require("path");

const app = express();

// Mock user database
const users = [];

// Passport GitHub strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: "Iv23liEPnHdy1pbjTft2",
            clientSecret: "fc35298ad69fe8574f59790e10e56c3454c043ef",
            callbackURL: "http://localhost:3000/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            
        }
    )
);

// Session configuration
app.use(
    session({
        secret: "secret_key",
        resave: false,
        saveUninitialized: false,
    })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    
});
passport.deserializeUser((id, done) => {
    
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (request, response) => {
    response.render("index", { user: request.user });
});

app.get("/profile", (request, response) => {
    if (!request.isAuthenticated()) {
        response.redirect("/");
    }
    response.render("profile", { user: request.user });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

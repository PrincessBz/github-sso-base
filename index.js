const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const path = require("path");

const app = express();

// Mock user database
const users = [];

passport.use(
  new GitHubStrategy(
    {
      clientID: "Ov23liOdPgdnxlddWb9M",
      clientSecret: "f54216295996e2547abee6a69be7e1a24dd9877b",
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, githubProfile, doNextMiddleware) => {
      let user = users.find((user) => user.id === githubProfile.id);
      if (!user) {
        user = {
          id: githubProfile.id,
          username: githubProfile.username,
          email: githubProfile.emails?.[0]?.value || "No public email",
          avatar: githubProfile.photos?.[0]?.value || "No photo",
        };
        users.push(user);
      }
      return doNextMiddleware(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  return done(null, user);
});

// Session configuration
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (request, response) => {
  response.render("index", { user: request.user });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (request, response) => {
    // Successful authentication, redirect home.
    response.redirect("/profile");
  }
);

app.get("/profile", ensureAuthentication ,(request, response) => {
   
  response.render("profile", { user: request.user });
});

app.get("/logout", (request, response) => {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    response.redirect("/");
  });
});

function ensureAuthentication(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
   return response.redirect("/");
}


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

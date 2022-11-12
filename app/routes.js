const { ObjectId } = require("mongodb");

// need to do put and delete
module.exports = function (app, passport, db, objectId) {
  //Bieeg Func from server
  //split from server (2nd part)
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("messages")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          messages: result,
        });
      });
  });

  app.get("/home", isLoggedIn, function (req, res) {
    db.collection("tiers")
      .find({ rank: "S-Tier" })
      .toArray((err, sRank) => {
        db.collection("tiers")
          .find({ rank: "A-Tier" })
          .toArray((err2, aRank) => {
            db.collection("tiers")
              .find({ rank: "B-Tier" })
              .toArray((err3, bRank) => {
                db.collection("tiers")
                  .find({ rank: "C-Tier" })
                  .toArray((err4, cRank) => {
                    db.collection("tiers")
                      .find({ rank: "D-Tier" })
                      .toArray((err5, dRank) => {
                        db.collection("tiers")
                          .find({ rank: "E-Tier" })
                          .toArray((err6, eRank) => {
                            if (err) return console.log(err);
                            res.render("home.ejs", {
                              user: req.user,
                              sRank: sRank,
                              aRank: aRank,
                              bRank: bRank,
                              cRank: cRank,
                              dRank: dRank,
                              eRank: eRank,
                            });
                          });
                      });
                  });
              });
          });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
  //loading

  // message board routes ===============================================================
  //create method
  app.post("/new", (req, res) => {
    db.collection("tiers").save(
      {
        //req.body is the request from the body. The types are name and msg
        name: req.body.name.toLowerCase(),
        rank: req.body.rank,
        userId: ObjectId(req.user._id),
        date: new Date(),
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/home");
      }
    );
  });
  // thumbs up and thumbs down logic
  // puts and deletes are main js only / fetch
  app.put("/update", (req, res) => {
    db.collection("tiers").findOneAndUpdate(
      {
        //looking for
        _id: objectId(req.body._id),
      },
      {
        //the do
        //delete everything and put this here
        $set: {
          _id: ObjectId(req.body._id),
          name: req.body.name,
          rank: req.body.rank,
          userId: req.user._id,
          date: new Date()
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });


  app.delete("/delete", (req, res) => {
    console.log(req.body.name, req.body._id)
    db.collection("tiers").findOneAndDelete({
      name: req.body.name,
      _id: ObjectId(req.body._id) 
    },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send(result);
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}

const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/update-settings", (req, res) => {
  const { user } = req.session;
  res.render("user/settings", { user });
});

router.post("/update-settings", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  const { username, bio, location } = req.body;
  // This is where we would also update IMAGE!!!

  if (username.length < 3) {
    return res.status(400).render("user/settings", {
      errorMessage: "Usernames need to be at least 3 characters long.",
    });
  }

  User.findOne({ username }).then((foundUser) => {
    if (foundUser && foundUser.username !== req.session.user.username) {
      return res.render("/settings", {
        errorMessage: "Username is already taken",
        // user: req.session.user,
      });
    }

    User.findByIdAndUpdate(
      req.session.user._id,
      { username, bio, location }, // if images, add here
      { new: true }
    ).then((updatedUser) => {
      req.session.user = updatedUser;
      res.redirect("/profile");
    });
  });
});

// Password update
router.get("/update-password", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("user/settings", { user: req.session.user });
});

// * NEEDS AUTHENTICATED USER
router.post("/update-password", (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.render("user/settings", {
      errorMessage: "Please make sure your passwords match.",
    });
  }

  // compareSync does the same as compare, but does it synchronously.
  const isSamePassword = bcrypt.compareSync(
    oldPassword,
    req.session.user.password
  );

  if (isSamePassword) {
    return res.render("user/settings", {
      errorMessage: "Please make sure to choose a different password.",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).render("user/settings", {
      errorMessage: "Your password needs to be at least 8 characters long",
    });
  }

  const hashingAlgorithm = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(newPassword, hashingAlgorithm);

  User.findByIdAndUpdate(
    req.session.user._id,
    { password: hashedPassword },
    { new: true }
  ).then((newAndUpdatedUser) => {
    req.session.user = newAndUpdatedUser;
    // after we update user with the new data, here we are just making sure that we have the most up to date info in the session. This user now has a new password therefore we should have the new password also on the user session
    res.redirect("/profile");
  });
});

router.get("/profile", (req, res) => {
  const { user } = req.session;
  res.render("user/profile", { user });
});

router.get("/user/:userID", (req, res) => {
  const { userID } = req.params;
  User.findById(userID).then((foundUser) => {
    res.render("user/user", { user: foundUser });
  });
});

module.exports = router;

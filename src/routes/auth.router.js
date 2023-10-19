import { Router } from "express";
import { UserModel } from "../dao/models/schema.user.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/signup",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/auth/failure-signup",
  }),
  async (req, res) => {
    res.redirect("/login");
  }
);

router.get("/failure-signup"),
  (req, res) => {
    res.send("Passport register failed");
  };

router.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/auth/failure-login",
  }),
  async (req, res) => {
    if (req.user) {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
      };
      res.redirect("/products");
    } else {
      return res.status(401).send("Invalid credentials");
    }
  }
);

router.get("/failure-login"),
  (req, res) => {
    res.send("Invalid credentials");
  };



router.get(
  "/github",
  passport.authenticate("githugSignup", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/github-callback",
  passport.authenticate("githugSignup", {
    failureRedirect: "/auth/failure-signup",
  }),
  (req, res) => {
    req.session.user = req.user
    res.redirect("/products");
  }
);

//logOut
router.post("/logout",async(req, res) => {
  if (req.user.email == "adminCoder@coder.com") {
    await UserModel.deleteOne({ email: "adminCoder@coder.com" })
  }
  req.session.destroy((error) => {
    if (error) {
      return res.send("could not close the session");
    } else {
      res.redirect("/login");
    }
  });
});

export default router;

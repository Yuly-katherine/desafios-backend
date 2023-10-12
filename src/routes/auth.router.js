import { Router } from "express";
import { UserModel } from "../dao/models/schema.user.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();



router.post("/signup", passport.authenticate("signupStrategy", {
  failureRedirect : "/api/failure-signup"
}), async (req, res) => {
  res.redirect("/login")
})

router.get("/failure-signup"),(req, res) => {
  res.send("Passport register failed")
}


router.get("/failure-login"),(req, res) => {
  res.send("Invalid credentials")
}

router.post("/login", passport.authenticate("loginStrategy", {
  failureRedirect : "/api/failure-login"
}), async (req, res) => {
  if(req.user){
    req.session.user = {
      first_name : user.first_name,
      last_name : user.last_name,
      email : user.email,
      age: user.age
    }
    res.redirect("products")
  } else {
    return res.status(401).send("Invalid credentials")
  }
})

//logOut
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.send("no se pudo cerrar la sesion");
    } else {
      return res.redirect("/");
    }
  });
});

export default router;

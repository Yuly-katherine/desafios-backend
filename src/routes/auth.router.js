import { Router } from "express";
import { UserModel } from "../dao/models/schema.user.js";

const router = Router();


router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      const newUser = await UserModel.create({ email, password });
      req.session.user = newUser.email;
      req.session.rol = "user";
      if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.rol = "admin";
      }
      return res.redirect("/login");
    } else {
      res.send(
        `User is already registered <a href="/login">Login </a>`
      );
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const authorized = await UserModel.findOne({
    email: email,
    password: password,
  });
  if (!authorized) {
    res.send("usuario no identificado");
  } else {
    req.session.user = email;
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.rol = "admin";
    } else {
      req.session.rol = "user";
    }
    return res.redirect("/products");
  }
});

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

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
      if (email === "adminCoder@coder.com") {
        req.session.rol = "admin";
      }
      return res.redirect("/login");
    } else {
      res.send(
        `Usuario ya encuentra registrado <a href="/login">Iniciar sesion </a>`
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
    if (email === "adminCoder@coder.com") {
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

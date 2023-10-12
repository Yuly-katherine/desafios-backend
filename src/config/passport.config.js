import passport from "passport";
import local from "passport-local";
import { UserModel } from "../dao/models/schema.user.js";
import { createHash } from "../utils.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "signupStrategy",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(passport),
          };
          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};


export default initializePassport;

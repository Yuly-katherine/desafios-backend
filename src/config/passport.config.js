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
  passport.use(
    "loginStrategy",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            if (isValidPassword(user, password)) {
              return done(null, user);
            }
            return done(null, false);
          } else {
            console.log(`User ${user} not found`);
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Serializar y deserializar a los usuarios
passport.serializeUser((user, done) => {
    done(null, user._id)
  });
  
  passport.deserializeUser(async(id, done) => {
    const user = await UserModel.findById(id);
    return done(null, user)
  })
  
};

export default initializePassport;

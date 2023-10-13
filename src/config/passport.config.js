import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2"
import { UserModel } from "../dao/models/schema.user.js";
import { createHash, isValidPassword } from "../utils.js";

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
            password: createHash(password),
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
  passport.use('githugSignup', new GitHubStrategy({
    // clientID: "Iv1.Iv1.211fa61d654c7aa4",
    // clientSecret:"0a592fa7f9d6bf8a781b51d3c21b69fc8996bf29",
    // callbackURL: "http://localhost:8080/auth/github-callback"
    clientID: "Iv1.56094c3584c51e5e",
    clientSecret:"4c1e44511ee5dc676b8ec7218826039b5e9ecdda",
    callbackURL: "http://localhost:8080/auth/github-callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try{
      console.log(profile, "profile")
      const userExist = await UserModel.findOne({email:profile.username})
      if(userExist){
        return done(null, userExist);
      }else {
        const newUser = {
          email:profile.username,
          password:createHash(profile.id)
        }
        const userCreated = await UserModel.create(newUser);
        return done(null, userCreated);
      }
    }catch(err){
      return done(err);
    }
  }
  ))

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

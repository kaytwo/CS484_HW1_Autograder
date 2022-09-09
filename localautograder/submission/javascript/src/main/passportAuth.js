// Import Modules Required to setup passport local stragegy 
const crypto = require("crypto");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const crudOperations = require("./crudOperationFunctions.js")


/**
 * passportInit() function is used to initialize the LocalStrategy of passport.js
 * This strategy helps apply session based authentication 
 * Please note "usenameField" & "passwordField" provide the alias names which correspond to input data
 * For Ex - Any POST Requires must have key value like  emailId="someEmail@email.com" and password="SomePassword"
 * Call Back for this function has three arguments (emailId, password, next) where the next is called to apply next stage in the middleware 
 * For more information on middlewares check out this link- https://expressjs.com/en/guide/using-middleware.html
 */
function passportInit(){
    passport.use(
        new LocalStrategy( {usernameField : "emailId", passwordField : "password"},function (emailId, password, next) {
           
            /**
             * This code space is used to initialize passport strategy
             * The Local Strategy takes in two arguments emailId and password which will be used to setup autheticate user 
             * For authenticating a user, you should first check if the user exists and and then fetch data about user (like emailId, encrypted password, etc ) 
             * Check if the password matches with what is stored in the database (i.e. the encrypted password in database is same as password entered by the user on screen)
             * If a match is found, pass the control to the next middleware. Call the next middleware by passing two arguments (err, information). Pass-in data if password is valid Else pass false for the information param.   
             * Hint -You could leverage validPassword, genPassword helper functions  
             */

            // Check if the user exists and get the data
            crudOperations.checkUserAndGet(emailId, (err, data)=>{
                
                if (err != null){
                    console.log("Error while Logging in->")
                    console.log(err)
                    return next(err, false)
                }
               
                else{
                    if (data != null && data != ""){
                       
                        // Check if the password matched
                        isValidUser = validPassword(password, data.password, data.salt)
    
                        if(isValidUser){
                            console.log(`Its a valid user.. Authenticating user with email ID - ${emailId}` )
                            return next(null, data);
                        }else{
                            return next(null, false);
                        }
                    }else{
                        return next(null, false)
                    }
                }
                
                
            })
          
        })
      );

}


/**
 * Functions serializeUser & deserializeUser need to be implementated while working with passport
 * serializeUser function stores a mapping of emailId and cookie sessionID 
 * derializeUser functions does the opposite of finding if there exists a valid user **
 */
passport.serializeUser(function (data, next) {
    console.log(`Serializing data for ${data.email}`)
    //next(null, data.rows[0].email);

    // Call the middleware with the data that you want to be stored in the express session 
    next(null, [data.email, data.role]);
  });


// User input for the deserialize function comes from the passport entry that forms in the express session
passport.deserializeUser(function (user_emailId_role, next) {
    console.log(`Deserializing data for ${user_emailId_role[0]}`)

    // Fetch the data about the user and if the user exists then return data else return false 
    crudOperations.checkUserAndGet(user_emailId_role[0], function(err, data){
        if (err != null){
            console.log("Error while Logging in-> Deserializing the user")
            console.log(err)
            next(err, false)
        }
        next(null, data)
    })
});


// Function to generate hashed password and salt 
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString("hex");
    var genHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
  
    return {
      salt: salt,
      hash: genHash,
    };
}

// Function to validate if password matches the stored has
function validPassword(password, hash, salt) {
    var hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === hashVerify;
}

module.exports = {
    passportInit, genPassword, validPassword
}

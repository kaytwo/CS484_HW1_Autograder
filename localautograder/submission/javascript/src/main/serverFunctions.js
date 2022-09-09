// This file contains all the helper functions
require('dotenv').config() 
const fromEmail = 'Tejas <trajop2@uic.edu>'
// Mail Gun Import
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});



// Function to check if the username is string and not empty
function checkString(username){
    //Remove all the white spacing from the left and the right 
    username = username.trim()

    if (typeof username === "string" && username.length != 0){
        return true;
    }else{
        return false;
    }
}

// Function to check if the password length is atleast 8 characters
function checkPasswordLength(password){
    if (password.length >= 8){
        return true;
    }else{
        return false;
    }
}

// Function to check if the email Id has '@' and contains '.' and the email Id is string@string.string.* format
function checkEmailId(emailID){
    // Regex for checking a simple email id
    var re = /\S+@\S+\.\S+/;
    return re.test(emailID);
}


function sendEmailViaMailgun(htmlContentString, toEmail){
    console.log("Starting to send email");
    console.log(toEmail)
    // Get email id from the request Id
    mg.messages.create('sandbox60d70efdad1e4e7ebfbcf99bfc0f7869.mailgun.org', {
        from: fromEmail,
        to: [toEmail],
        subject: "About your service request",
        html: `<h1>${htmlContentString}</h1>`
      })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.error(err)); // logs any error

}

// Export modules so that they can be accessed from another file . Check out import statements in server.js
module.exports = {checkPasswordLength, checkString, checkEmailId, sendEmailViaMailgun};
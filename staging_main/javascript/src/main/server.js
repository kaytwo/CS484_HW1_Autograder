// Import modules
const express = require('express')
const app = express()
const sessionObj = require("express-session");
const port = 8080
const crudOperations = require("./crudOperationFunctions.js")
const serverFunctions = require("./serverFunctions.js")
const passport = require('passport');


// Middlewares

// Middle ware for parsing JSON 
app.use(express.json());

// Middle ware to expose static content ( CSS, Javascript, Images ) in the public folder
app.use(express.static('public'));
//app.use('/static', express.static('views'));

// Middleware to create in-memory session store
// In-memory vs persistent datastore (Database based)
// Session data is lost when the server is stopped with in-memory store
// Session data is not lost when the server is stopped
// Below is the configuration for in-memory datastore
app.use(sessionObj({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}));

// Initialize passport auth middleware
app.use(passport.initialize())
app.use(passport.session())

// Initialise the "Local" Strategy for passport authentication
const passportAuth = require('./passportAuth.js');
passportAuth.passportInit();        // Initialize local Passport Straregy for session based authentication

// ***********   Below are all the endpoints where requests are sent ( GET, POST ) ***********


/*
* GET ENDPOINTS
*/
// Make the / -> /
app.get('/', (req, res) => {
    // req.isAuthenticated() is used to check if the user is authenticated already with a session
    // Whenever this route '/' page is accessed and if the browser / client has a cookie , it is sent along with the request
    // If this cookie is valid then req.isAuthenticated() returns true  
    if (!req.isAuthenticated()){
        res.sendFile('./views/login.html', {root: __dirname })
    }
    else{
        res.sendFile('./views/dashboard.html', {root: __dirname })
    }
   
})

app.get('/create-user', (req, res) => {
   res.sendFile('./views/create_user.html', {root: __dirname })
})

app.get('/update-user', (req, res) => {
    if(req.isAuthenticated()){
        res.sendFile('./views/update_user.html', {root: __dirname })
    }else{
        res.redirect('/');
    }
   
})

app.get('/delete-user', (req, res) => {
    if(req.isAuthenticated()){
        res.sendFile('./views/delete_user.html', {root: __dirname })
    }else{
        res.redirect('/');
    }
   
})

app.get('/dashboard', (req, res) => {
    if(req.isAuthenticated()){
        res.sendFile('./views/dashboard.html', {root: __dirname })
    }else{
        res.redirect('/');
    }
   
})
 
app.get('/logout', (req, res)=>{
    req.logOut(()=>{
        console.log("Logging out")
    });
    res.redirect('/')
})

app.get("/get_service_requests", (req, res)=>{
    console.log(req.headers)
    //console.log("Buttton CLicked")
    if (req.isAuthenticated()){
        crudOperations.getServiceList((err, data)=>{
            if(err != null){
                console.log(err);
                res.json({"msg" : "There was some issue with fetching service request list. Check server logs"});
            }
            if (data != null && data != false){
                console.log("Fetched Data Successfuly ");
                res.json({"msg" : data});
            }else{
                res.json({"msg" : []})
            }
        })
    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
})


/*
* POST ENDPOINTS
*/

app.post('/create_user', (req, res) => {
   
    // Parse the data from the request
    // Note - there are two roles - admin, customer . Admin is stored as 'true' and customer is stored as 'false'
    let {firstname, lastname, emailId, password, role} = req.body;

    // Check if user exists or not
    crudOperations.checkUser(emailId, firstname, lastname, password, role, (err, data)=>{
        if (err != null){
            console.log(err);
            res.json({"msg" : false});
            return;
           
        }
        console.log("Got callbacked as -" + data);
        if (data == true){
            // Call the operation to create the user 
            // Password Encrpted at dbFunctions.js
            crudOperations.createUser(firstname, lastname, emailId, password, role, (err, data)=>{
                    if (err != null){
                        console.log(err);
                        res.json({"msg" : "Error While Creating User in Dbfunctions"})
                    }
                    if ( data == true) {
                        console.log(`User Created with email id ${emailId}`);
                        res.json({"msg" : true});
                        //res.send("User Successfully Created")
                    }else{
                        res.json({"msg" : false})
                    }   
            });
            
        }else{
            // If there is not err and checkUser didn't return true. Send the data to frontend
            console.log(`Problems Creating a new user - ${data}`)
            res.json({"msg" : data})
        }

    });
})

// Endpoint called when a user is trying to log-in
app.post("/login", passport.authenticate("local") ,(req, res)=>{
    res.redirect('/dashboard');
})

app.post("/update_user", (req, res)=>{
    // Check if the user is authenticated
    if (req.isAuthenticated()){
        let {firstname, lastname, emailId} = req.body;

        crudOperations.updateUser(firstname, lastname, emailId, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Updating User. See Server Logs for Details"});
            }
            if (data == true) {
                console.log(`User Updated with email id ${emailId}`);
                res.json({"msg" : true})
            }else{
                console.log(`Unable to update user for email id ${emailId}`);
                console.log(`Problem while updating the user - ${data}`)
                res.json({"msg" : data})
            }   
        })


    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
})

app.post("/delete_user", (req, res)=>{
    // Check if the user is authenticated
    if (req.isAuthenticated()){

        let {emailId} = req.body;

        crudOperations.deleteUser(emailId, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Deleting User. See Server Logs for Details"});
            }
            if ( data == true) {
                console.log(`User Deleted with email id ${emailId}`);
                res.json({"msg" : true});
            }else{
                console.log(`Unable to delete user for email id ${emailId}`);
                console.log(`Problem while deleting the user - ${data}`);
                res.json({"msg" : data})
            }
        })
        
    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
    
})

app.post("/create_service_request", (req, res)=>{
    if (req.isAuthenticated()){

        console.log(req.session);

        let {name, sdescription, emailId, ldescription } = req.body;

        crudOperations.createServiceReq(name, sdescription, emailId, ldescription, (err, data)=>{
            if (err != null){
                console.log(err);
                res.json({"msg" : "Error While Creating Service Request. See Server Logs for Details"});
            }
            if ( data == true) {
                console.log(`Service Request Created for  email id ${emailId}`);
                res.json({"msg" : true});
            }else{
                console.log(`Unable to create service request`);
                console.log(data);
                res.json({"msg" : data})
            }
        })
    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
})


app.post("/approve_service_request", (req, res)=>{
    if (req.isAuthenticated()){
        if (req.session.passport.user[1] == true){
            crudOperations.approveServiceReq(req.body.id, (err, data)=>{
                if(err != null){
                    console.log(err);
                    res.json({"msg" : "There was some issue in approving service request. Check server logs"});
                }
                if (data == true){
                    console.log(`Approved Request for id -> ${req.body.id}`);

                    // Get data about the service request
                    crudOperations.getServiceReqFromId(req.body.id, (err, data)=>{
                        if (err != null){
                            console.log(err);
                            return;
                        }
                        if (data != null){
                            serverFunctions.sendEmailViaMailgun(`Request with id ${req.body.id} is completed`, data.email)
                        }else{
                            console.log("Some issues while fetching the data and sending email for service completion");
                            return;
                        }
                    })

                    
                    res.json({"msg" : true});
                }else{
                    console.log(data);
                    res.json({"msg" : false});
                }
            })
        }else{
            res.json({"msg" : false});
        }
    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
})

app.post("/cancel_service_request", (req, res)=>{
    if (req.isAuthenticated()){
        if (req.session.passport.user[1] == false){
            crudOperations.cancelServiceReq(req.body.id, (err, data)=>{
                if(err != null){
                    console.log(err);
                    res.json({"msg" : "There was some issue in cancelling service request. Check server logs"});
                }
                if (data == true){
                    console.log(`Cancelled Service Request for id -> ${req.body.id}`);
                    res.json({"msg" : true});
                }else{
                    console.log(data);
                    res.json({"msg" : false});
                }
            })
        }else{
            res.json({"msg" : false});
        }
    }else{
        //res.status(401, "Unauthorized");
        res.json({"msg" : false})
    }
})



// Application setup / entry to create a server on a port which is given as an argument
app.listen(port, () => {
  console.log(`Server Up and Listening at http://localhost:${port}/`)
})



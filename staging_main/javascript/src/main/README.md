# CS484_Homework1 - Crud App

This Homework is about securing a CRUD App that is provided to you with a session based authentication using passport.js. Once you are done, please submit the github repo on Gradescope.  

## Overview
Homework1 is about implementing session-based authentication using passport.js and also implementing few of the frontend functions in frontendFunctions.js. 

The webapplication that is provided to you has the following features - 

1. Create a user ('/create_user')
2. Update user details ('/update_user')
3. Request Information about the user ('/get_user')
4. Delete a user ('/delete_user')
5. Create a service request ('/create_service_request') 
6. Mark a service request as completed ('/approve_service_request'). This could only be performed by an admin user
7. Cancel a user's service request ('cancel_service_request')

Checkout 'Exploring the webapplication' section on details about the functionality of webapp.

## Pre-requisite 

Please have `Node.js` installed for starting this project. For installing `Node.js` checkout this webpage https://nodejs.org/en/ and download the LTS version of Node.js for your laptop.

## Cloning your homework assignment

`TO DO`


## Installing required packages

Open the terminal window and type in `npm install`. This will install all the dependencies listed in the `package.json` file and will create a folder `node_modules` where all these dependencies will be installed. This will also setup the database `HW1_DB.db` in the folder `database`. To start the server, type in `npm start` or `node server.js` and this should start the server and log following messages on the console.

```
Server Up and Listening at http://localhost:8080/landing
Connected to the database HW1_DB.db

```

For stopping express js, press Ctrl + c

## Project Details

This homework uses ExpressJS for quick and easy server setup along with SQlite to store user data and credentials(in encrypted format). Please find below information on different files used in this HW.

1. server.js - Main file used to start/ stop server. This file contains all the endpoints (GET, POST) and the middlewares useful for setting session-based authentication
2. serverFunctions.js - Helper file containing functions for validations of user input (Name, emailId, password)
3. testServerFunctions.test.js - JEST framework unit testing file containing unit tests for functions validating username, email and password
5. package.json - JSON file containing information about the project, dependencies, starter commands, etc
6. .gitignore - Contains information on what should be ignored from the local project while uploading to Git Repository

### New Files Used for setting Passport.js and Database connection 
7. passportAuth.js (**IMP FILE**) - File containing initialization for local strategy and functions to serialize and deserialize the user data
8. dbFunctions.js - Database connection and SQL Statements for performing CRUD Operations
9. crudOperationsFunctions.js - Intermediate file containing functions which will call functions in 'dbFunctions.js'. This approach is helpful to do any sanity checks/ data manipulation before hitting database queries 
10. views folder - The views folder contains all the .html pages that are used for this web application
11. public folder - contains all the JS enabling frontend logics

## Exploring the webapplication

Consider this web application as a place where a customer can create a service request about any issue and then the admin takes a look at the service request and if  the service request is completed, marks it complete. For simplicity, admin can view / create all the service requests and mark them complete BUT cannot cancel a request. On the other hand, customers can create / view all service request and cancel any service request BUT cannot complete a request. 

Once you are successfully able to start the server, go to the landing page by accessing 'http://localhost:<port>/landing' page. Please replace the <port> with the port that you have used to setup the server. If you are able to see this page, you have successfully started the application. Start by creating a user
1. Create a user by accessing 'http://localhost:<port>/create-user'. There are two types of user - admin and customers. Admin can create and complete a request. Customer can create and delete a service request but cannot complete the request. For simplicity everyone can view the list of requests. 
2. Once the user is created, Login using those credentials. This should take you to the dashboard. Note - With the code provided you can login with any email and password (even if its not created) as there is no authentication implemented.
3. Create a service request 
4. Use the navigation bar to access other routes
5. You can also list the service requests by clicking on the 'List Requests' button on the dashboard.

Note - For any issues encountered check the server logs for more details

## ToDo For HW1

This web application doesn't have authentication and you need to add code that enables authentication. You need to modify `passportAuth.js` and `server.js` files to enable passport session authentication and also add code to enable authentication on each route that is visited. 

Once a service request is marked complete or if a service request is cancelled the web application should send an email to the customer about the same. Check out `approve_service_request` & `cancel_service_request` routes in `server.js` for comments about this implementation.

Apart from that, you also have to complete the `listServiceRequest()` functions inside the `./public/frontEndFunctions.js` file. 

## Checking your work 

Once you have completed with your work , you should be able to create a user and login. Once you login, the `req.session`, should have an extra passport entry. This confirms that you are able to authenticate using passport.js. Visit other routes and see if you able to access them. Now logout of the application and try accessing a route where you have implemented authentication (e.g. http://localhost:8080/dashboard). This should take you to the `landing` page. 

For checking email notification. Create a request and complete the request and this should send your email notification. Similarly for cancelling a service. 

To check `listServiceRequest()`, go to `/dashboard` by logging in and then create some requests and `List Requests`. This should list all the requests you have created ( plus any previous ones if any ) and if you are logged in via admin user you should be able to complete the request. Now again press `List Requests` and you shouldn't be able to view that service request. Now login with a customer user and try and completing the request. If you have implemented authentication and proper access control, you shouldn't be able to complete the request.

## Submitting your work

After you are confident that your code works, you can push the code to GitHub, and then submit it via Gradescope. You can find the link to our class gradescope at the bottom of this page. If you have issues with the autograder, please contact us via Piazza ASAP. **Please keep in mind that technical issues while submitting your assignment is not an acceptable excuse for improper or late submissions.**

# Points 

TO DO

#Due Date

TO DO
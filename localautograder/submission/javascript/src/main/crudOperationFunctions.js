/**
 * Contains CRUD functions for operating users data
 * Also functions for creating, completing , cancelling a service request
 * 
 */

const dbOperations = require("./dbFunctions.js")
const serverFunctions = require("./serverFunctions.js")

// Function to check if user exits 
// return true or false OR message string about error
async function checkUser(emailId, firstname, lastname, password, role, callback){

    if (!serverFunctions.checkString(firstname) || !serverFunctions.checkString(lastname) || !serverFunctions.checkString(role)){
        return callback(null, "Please enter correct first and lastname or role");
    }

    if (!serverFunctions.checkPasswordLength(password)){
        return callback(null, "Please enter password with more than 8 characters");
    }

    if (!serverFunctions.checkEmailId(emailId)){
        return callback(null, "Invalid email Id");
    }

    const dbData = await dbOperations.checkUserExists(emailId);
    return callback(null, dbData)

}

// Function to create user in Database
// return true or false 
async function createUser(firstname, lastname, emailId, password, role, callback){
    if (role == 'worker') {
        role = true;
    } else {
        role = false;
    }

    const dbResult = await dbOperations.createUser(firstname, lastname, emailId, password, role);
    return callback(null, dbResult);

}

// Function to check if the users exists and return data
// This function will return entire data about a user i.e. (name, password, salt, role, etc)
// return user data OR null
async function checkUserAndGet(emailId, callback){
    const dbResult = await dbOperations.checkUserExistsAndGet(emailId);
    if (dbResult != false){
        return callback(null, dbResult);
    }
    return callback(null, null);
}

// Function to update users data (firstname, lastname, emailId) in Database
// return true or false 
async function updateUser(firstname, lastname, emailId, callback){

    // Check the firstname, lastname emailId format and password strength
    if (!serverFunctions.checkString(firstname) || !serverFunctions.checkString(lastname)){
        return callback(null, "Please enter correct first and lastname");
    }

    if (!serverFunctions.checkEmailId(emailId)){
        return callback(null, "Invalid email Id");
    }

    const dbResult = await dbOperations.updateUser(firstname, lastname, emailId);
    return callback(null, dbResult);

}

// Function to delete users data in Database
// return true or false 
async function deleteUser(emailId, callback){

    if (!serverFunctions.checkEmailId(emailId)){
        return callback(null, "Invalid email Id");
    }

    const dbResult = await dbOperations.deleteUser(emailId);
    return callback(null, dbResult)
}

// Function to create service request in database
// return true or false
async function createServiceReq(name, sdesc, email, ldesc, callback){

    if (!serverFunctions.checkString(name) || !serverFunctions.checkString(sdesc) || !serverFunctions.checkString(ldesc)){
        return callback(null, "Please enter correct first and lastname");
    }

    if (!serverFunctions.checkEmailId(email)){
        return callback(null, "Invalid email Id");
    }

    const dbResult = await dbOperations.createServiceReq(name, sdesc, email, ldesc);
    return callback(null, dbResult);
}


// Function to get list of service request
// return list or error with false
async function getServiceList(callback){
    const dbResult = await dbOperations.getServiceReqList();
    return callback(null, dbResult);
}

// Function to approve a service request
// return true if the logged in user has the "service-worker / Admin" permission 
async function approveServiceReq(id, callback){ 
    const dbResult = await dbOperations.approveRequest(id);
    return callback(null, dbResult);
}

// Function to cancel a service request
// return true if the logged in is a "customer / owner" 
// ** Any customer can cancel any request 
async function cancelServiceReq(id, callback){ 
    const dbResult = await dbOperations.cancelRequest(id);
    return callback(null, dbResult);

}

// Function to fetch information about the service request from id
async function getServiceReqFromId(id, callback){ 
    const dbResult = await dbOperations.getServiceReqDataFromId(id);
    return callback(null, dbResult);
}


// Another Way of exporting functions 
exports.checkUser = checkUser;
exports.checkUserAndGet = checkUserAndGet;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.createServiceReq = createServiceReq;
exports.getServiceList = getServiceList;
exports.approveServiceReq = approveServiceReq;
exports.cancelServiceReq = cancelServiceReq;
exports.getServiceReqFromId = getServiceReqFromId;
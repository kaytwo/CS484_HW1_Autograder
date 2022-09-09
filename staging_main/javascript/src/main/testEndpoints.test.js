let request = require('supertest');
request = request('http://localhost:8080');
let cookieGlobal
let cookieCustomer
// const frontEndFunctions = require("./public/frontendFunctions.js")
// let testHTML = `<html><body> <div class="list-container" style="display:none;"><table class="table table-striped"><thead><tr><th scope="col"> </th><th scope="col">#</th><th scope="col">Name</th><th scope="col">Short Description</th><th scope="col">Email Id</th><th scope="col">Long Description</th><th scope="col">Complete a Request</th></tr></thead><tbody id="main-table-body"></tbody></table><div></body></html>`
const dbFunctions = require('./dbFunctions.js')
// Test for Checking If Authentication Rules have been added to the routes
// Login (/) , update-user, delete-user, dashboard -> All Should redirect to /
// get_service_requests, /update_user, /delete_user, /create_service_request, /approve_service_request, /cancel_service_request,  -
// --> All Above should return json {"msg" : false}

// Now create a user by calling the createUser from dbFunctions.js
// Login with this user to '/login' with json data
// This should return a cookie 

// Now go to the update-user route
// This should take you there 

// Now go to the delete user route 

// Now create two requests in the 

// Now logout and then go to the update-user route and check if it again redirects to login page
// Also 

beforeAll(async()=>{
    // Create a admin user 
    console.log("Creating User For testing")
    let payload = {"emailId" : "admin@mail.com", "firstname" : "AdminFirstName", "lastname" : "AdminLastName", "password" :"password123", "role" : "worker"}
    const res1 = await request.post('/create_user').set('Content-type', 'application/json').send(payload) 
    let payload2 = {"emailId" : "customer@mail.com", "firstname" : "TestFirstName", "lastname" : "TestLastName", "password" :"password123", "role" : "customer"}
    const res2 = await request.post('/create_user').set('Content-type', 'application/json').send(payload2) 
    //await dbFunctions.createUser("AdminFirstName", "AdminLastName",  "admin@mail.com" , "password123", true);
    //await dbFunctions.createUser("TestFirstName", "TestLastName",  "customer@mail.com" , "password123", false);

})

afterAll(async()=>{
    // Create a customer user
    console.log("Deleting User For testing")
    const resDelAdmin = await dbFunctions.deleteUser("admin@mail.com");
    const resDelCustomer = await dbFunctions.deleteUser("customer@mail.com")
})


test('Test for Authentication (Not Logged-in ) - /update-user ', async function(){
    const response = await request.get('/update-user')
    //console.log(response.text);
    expect(response.text).toBe("Found. Redirecting to /");   
})

test('Test for Authentication (Not Logged-in ) - /delete-user ', async function(){
    const response = await request.get('/delete-user')
    //console.log(response.text);
    expect(response.text).toBe("Found. Redirecting to /");   
})

test('Test for Authentication (Not Logged-in ) - /dashboard ', async function(){
    const response = await request.get('/dashboard')
    //console.log(response.text);
    expect(response.text).toBe("Found. Redirecting to /");   
})

test('Test for Authentication (Not Logged-in ) - /get_service_requests ', async function(){
    const response = await request.get('/get_service_requests')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})

// POST
test('Test for Authentication (Not Logged-in ) - /get_service_requests ', async function(){
    const response = await request.get('/get_service_requests')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})

test('Test for Authentication (Not Logged-in ) - /update_user ', async function(){
    const response = await request.post('/update_user')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})

test('Test for Authentication (Not Logged-in ) - /delete_user ', async function(){
    const response = await request.post('/delete_user')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})

test('Test for Authentication (Not Logged-in ) - /create_service_request ', async function(){
    const response = await request.post('/create_service_request')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})

test('Test for Authentication (Not Logged-in ) - /approve_service_request ', async function(){
    const response = await request.post('/approve_service_request')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})


test('Test for Authentication (Not Logged-in ) - /cancel_service_request ', async function(){
 
    const response = await request.post('/cancel_service_request')
    //console.log(response.text);
    expect(response.text).toBe("{\"msg\":false}");   
})


test('Test for logging-in - /login', async function(){
    payload = JSON.stringify({
        "emailId" : "admin@mail.com",
        "password" : "password123"
    })
    const response = await request.post('/login')
                    .set('Content-type', 'application/json')
                    .send(payload)
    //console.log(response);
    console.log(response.headers["set-cookie"][0])
    cookieGlobal = response.headers["set-cookie"][0]
    cookieGlobal = cookieGlobal.split(';')[0];
    console.log(cookieGlobal)
    expect(response.text).toBe("Found. Redirecting to /dashboard");   


     // Now Login by the customer user and then approve second request
     payload2 = JSON.stringify({
        "emailId" : "customer@mail.com",
        "password" : "password123"
    })
    const response2 = await request.post('/login')
                    .set('Content-type', 'application/json')
                    .send(payload2)
    cookieCustomer = response2.headers["set-cookie"][0]
    cookieCustomer = cookieCustomer.split(';')[0];
    console.log(cookieCustomer)

})

test('Test after logging-in - /update-user', async function(){
    //console.log(cookieGlobal)
    const response = await request.get('/update-user')
                        .set('Cookie', [cookieGlobal])

    expect(response.text).toEqual(expect.stringContaining("Update User Information"));   
})

test('Test after logging-in - /delete-user', async function(){
    //console.log(cookieGlobal)
    const response = await request.get('/delete-user')
                        .set('Cookie', [cookieGlobal])

    expect(response.text).toEqual(expect.stringContaining("Delete User"));   
})

test('Test after logging-in - Creating a service request', async function(){
    //console.log(cookieGlobal)
    payload = {
        "emailId" : "a@g.com",
        "name" : "Some Name",
        "sdescription" : "Test Description",
        "ldescription" : "This is some one long description"
    }
    var response = await request.post('/create_service_request')
                        .set('Cookie', [cookieGlobal])
                        .set('Content-type', 'application/json')
                        .send(payload)

    expect(response.text).toBe("{\"msg\":true}")  

    payload = {
        "emailId" : "abc@g.com",
        "name" : "Some Name",
        "sdescription" : "Test Description",
        "ldescription" : "This is some one long description"
    }
    response = await request.post('/create_service_request')
                        .set('Cookie', [cookieGlobal])
                        .set('Content-type', 'application/json')
                        .send(payload)

    expect(response.text).toBe("{\"msg\":true}")  
})

// Now approve a service request as a admin
// Cancel Request as a admin
// TO DO
test('Test after logging-in - /approve_service_request', async function(){
    //console.log(cookieGlobal)
    payload = {
        "id" : 1
    }
    const response = await request.post('/approve_service_request')
                        .set('Cookie', [cookieGlobal])
                        .set('Content-type', "application/json")
                        .send(payload)

    expect(response.text).toBe("{\"msg\":true}")     

   
     
    payload = {
        "id" : 2
    }
    const response3 = await request.post('/approve_service_request')
                        .set('Cookie', [cookieCustomer])
                        .set('Content-type', "application/json")
                        .send(payload)

    expect(response3.text).toBe("{\"msg\":false}")   
})


test('Test after logging-in - /cancel_service_request', async function(){
    //console.log(cookieGlobal)
    payload = {
        "id" : 2
    }
    const response = await request.post('/cancel_service_request')
                        .set('Cookie', [cookieGlobal])
                        .set('Content-type', "application/json")
                        .send(payload)

    expect(response.text).toBe("{\"msg\":false}")     

    payload = {
        "id" : 2
    }
    const response3 = await request.post('/cancel_service_request')
                        .set('Cookie', [cookieCustomer])
                        .set('Content-type', "application/json")
                        .send(payload)

    expect(response3.text).toBe("{\"msg\":true}")   
})



// Now login as a customer and approve the request 
// Cancel a request as a customer
// TO DO

// test('Test For Logging out - /logout', async function(){
//     console.log(cookieGlobal)
//     const response = await request.get('/logout')
//                         .set('Cookie', [cookieGlobal])
//     expect(response.text).toBe("Found. Redirecting to /"); 

//     // Now go to the update-user page
//     const response_after = await request.get('/update-user')
//                             .set('Cookie', [cookieGlobal])

//     expect(response_after.text).toBe("Found. Redirecting to /"); 
// })


// test('Test to List Requests', async function(){
//     console.log(cookieGlobal)

//     // document.documentElement.innerHTML = testHTML;
//     //document.cookie = cookieGlobal;

//     const returnVal = await frontEndFunctions.listServiceRequest();

//     //console.log(document.getElementById('main-table-body').innerHTML)
// })


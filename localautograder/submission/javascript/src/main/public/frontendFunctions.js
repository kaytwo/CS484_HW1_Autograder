// Function called for logging process
async function loginSubmit(){

    // Fetch Login Form Inputs
    const emailId = document.getElementById('emailId').value;
    const password = document.getElementById('password').value;
    
    if (!checkEmailId(emailId)){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Incorrect Email Id"
        return ;
    }

    data = {
        "emailId" : emailId,
        "password" : password
    }

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        redirect: "follow" 
    });

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please enter correct credentials"
        return ;
    }

    const HTMLtext = await response.text();
    document.open();
    document.write(HTMLtext);
    document.close();

}

// Function for calling endpoint to create a new user
async function createUserSubmit(){

    // Fetch Input from Forms
    const emailId = document.getElementById('emailId').value;
    const password = document.getElementById('password').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const role = document.getElementById('role-selector').value;

    payload = {
        "emailId" : emailId,
        "password" : password,
        "firstname" : firstname,
        "lastname" : lastname,
        "role" : role
    }

    const response = await fetch('/create_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please enter correct credentials"
        return ;
    }

    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `Successfully created user with email-id - ${emailId}`
    }else{
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `There was some issue while creating the user. Check server logs for more details`
    }


}

// Function for calling NodeJS Endpoint for updating user
async function updateUserSubmit(){

    // Fetch the input form data
    const emailId = document.getElementById('emailId').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;

    payload = {
        "emailId" : emailId,
        "firstname" : firstname,
        "lastname" : lastname
    }

    const response = await fetch( '/update_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please Login Again"
        return;
    }

    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `Successfully udpated user with email-id - ${emailId}`
    }else{
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `There was some issue while updating the user.  Check server logs for more details`
    }

}

// Function for calling NodeJS Endpoint for Deleting user
async function deleteUserSubmit(){
    // Fetch input form data
    const emailId = document.getElementById('emailId').value;

    payload = {
        "emailId" : emailId,
    }

    const response = await fetch( '/delete_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please Login Again"
        return;
    }
    
    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `Successfully Deleted user with email-id - ${emailId}`
    }else{
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `There was some issue while deleting the user.  Check server logs for more details`
    }

}

// Function to call endpoint for creating a new service request
async function createServiceRequest(){
    const emailId = document.getElementById('emailId').value;
    const fname = document.getElementById('name').value;
    const sdesc = document.getElementById('sdescription').value;
    const ldesc = document.getElementById('ldescription').value;

    payload = {
        "emailId" : emailId,
        "name" : fname,
        "sdescription" : sdesc,
        "ldescription" : ldesc
    }

    const response = await fetch( '/create_service_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please Login Again"
        return;
    }
    
    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `Service Request Successfully Created`
    }else{
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `There was some issue while creating the service request.  Check server logs for more details`
    }

}


// Function to list Service Requests and display them on the page in a tabular format
async function listServiceRequest(){

    const response = await fetch( '/get_service_requests', {
        method: 'GET',
        credentials: "same-origin",
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure').innerHTML = "Unauthorized. Please Login Again"
        return;
    }

    const jsonData = await response.json();
    if (jsonData.msg.length >= 0){
        document.getElementById('main-table-body').innerHTML = "";
        // Create a list of requests in the form of table
        for (i = 0; i < jsonData.msg.length; i++){
            document.getElementById('main-table-body').innerHTML += 
            `<tr><td><button type="button" id="cancel-btn-${jsonData.msg[i].id}" class="btn-close" aria-label="Close" onClick="cancelRequest(${jsonData.msg[i].id})"></button></td>` 
            +`<td>${jsonData.msg[i].id}</td>` 
            +`<td>${jsonData.msg[i].name}</td>`
            +`<td>${jsonData.msg[i].short_desc}</td>`  
            +`<td>${jsonData.msg[i].email}</td>`  
            +`<td>${jsonData.msg[i].service_desc}</td>` 
            +`<td><button type="button" id="complete-btn-${jsonData.msg[i].id}" class="btn btn-primary" onClick="accpRej(${jsonData.msg[i].id})">Complete</button></td></tr>`
        }
        document.getElementsByClassName("list-container")[0].style.display = "block";
    }else{
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = `There was some issue while creating the service request. Check server logs for more details`
    }
}

// Called when 'Complete' button is clicked .
// This calls the endpoint to accept the service request
async function accpRej(id){
    payload = {
        "id" : id,
    }

    const response = await fetch( '/approve_service_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = "Unauthorized. Please Login Again"
        return;
    }    

    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = "Approved Service Request for Id  - " + id
        document.getElementById(`complete-btn-${id}`).classList.add("btn-secondary");
        document.getElementById(`complete-btn-${id}`).setAttribute('disabled', '');
    }else{
        alert("You don't have permissions to approve the service request");
    }
}

// Called when a 'X' button is pressed 
// This calls the endpoint to cancel the service request
async function cancelRequest(id){
    payload = {
        "id" : id,
    }

    const response = await fetch( '/cancel_service_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify(payload),
    })

    if (response.status == 401){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = "Unauthorized. Please Login Again"
        return;
    }    

    const jsonData = await response.json();
    if (jsonData.msg == true){
        document.getElementsByClassName('hidden-info')[0].style.display="block";
        document.getElementById('msg-for-failure-sucess').innerHTML = "Concelled Service Request for Id  - " + id
        document.getElementById(`cancel-btn-${id}`).setAttribute('disabled', '');
    }else{
        alert("You don't have permissions to cancel the service request. You are not the owner of the service request");
    }
}

// Function to check if the email Id has '@' and contains '.' and the email Id is string@string.string.* format
function checkEmailId(emailID){
    var re = /\S+@\S+\.\S+/;
    return re.test(emailID);
}


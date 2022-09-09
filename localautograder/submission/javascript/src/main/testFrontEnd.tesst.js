
//  let request = require('supertest');
//  request = request('http://localhost:8080');
//  let cookieGlobal
//  const frontEndFunctions = require("./public/frontendFunctions.js")
  //let testHTML = `<html><body id="entireBody"><button id="click" onclick="listServiceRequest()">Button</button> <div class="hidden-info" style="display:none; margin-top: 15px;"><p id="msg-for-failure-sucess"></p></div> <div class="list-container" style="display:none;"><table class="table table-striped"><thead><tr><th scope="col"> </th><th scope="col">#</th><th scope="col">Name</th><th scope="col">Short Description</th><th scope="col">Email Id</th><th scope="col">Long Description</th><th scope="col">Complete a Request</th></tr></thead><tbody id="main-table-body"></tbody></table><div><script src="/frontendFunctions.js"></script></body></html>`
 let testHTML = `<html>
 <body id="entireBody">
   <button id="click" onclick="listServiceRequest()">Button</button>
   <div class="hidden-info" style="display:none; margin-top: 15px;">
     <p id="msg-for-failure-sucess"></p>
   </div>
   <div class="list-container" style="display:none;">
     <table class="table table-striped">
       <thead>
         <tr>
           <th scope="col"></th>
           <th scope="col">#</th>
           <th scope="col">Name</th>
           <th scope="col">Short Description</th>
           <th scope="col">Email Id</th>
           <th scope="col">Long Description</th>
           <th scope="col">Complete a Request</th>
         </tr>
       </thead>
       <tbody id="main-table-body"></tbody>
     </table>
     </div>
       <script id="scriptMain" src="/frontendFunctions.js"></script>
 </body>
</html>`

//  test('Test for logging-in - /login', async function(){
//     payload = JSON.stringify({
//         "emailId" : "a@g.com",
//         "password" : "password123"
//     })
//     const response = await request.post('/login')
//                     .set('Content-type', 'application/json')
//                     .send(payload)
//     cookieGlobal = response.headers["set-cookie"][0]
//     cookieGlobal = cookieGlobal.split(';')[0];
//     console.log(cookieGlobal)
//     expect(response.text).toBe("Found. Redirecting to /dashboard");   
// })

// /**
//  * @jest-environment jsdom
//  */
//  test('Test to List Requests', async function(){
//     console.log(cookieGlobal)

//     document.documentElement.innerHTML = testHTML;
//     document.cookie = cookieGlobal;

//     const returnVal = await frontEndFunctions.listServiceRequest();

//     console.log(document.getElementById('main-table-body').innerHTML)
// })


const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetchMethod = require('node-fetch');

//const cookieJar = await new jsdom.CookieJar('connect.sid=s%3AItQKJUo8wDwlUQTyGgixAe3rpI8WSjdH.LyDxkZ46Bbo8juu2JKPwIvnPJvXHWP0tsUUobGNihU8')
const dom = new JSDOM(testHTML, {
    url: "http://localhost:8080",
    // referrer: "https://example.com/",
    contentType: "text/html",
    runScripts: "dangerously",
    resources: "usable",
    // cookieJar
    // includeNodeLocations: true,
    // storageQuota: 10000000
});

//dom.window.fetch = fetch
function fetch(URL, options){
    URL = 'http://localhost:8080' + URL
    return fetchMethod(URL, {
        method: 'GET',
        headers: {
            cookie: 'connect.sid=s%3AQYrtivz6X5MsfIS0hZLRgmQW8CNym2lL.fAtRJ07v8tHenk0L2r2xLNJOWcXu80vLH7STEE2ShCs'
        }
    })
}

dom.window.fetch = fetch


dom.window.document.getElementById("scriptMain").addEventListener('load', function(){
    dom.window.document.cookie = "connect.sid=s%3Ag0RIizuLKVoh35ymjNf5L1t21Nls8S3V.%2BVDYi0p4hismj1eYJTyv6bhLRfxV10hZrwaM6DLuk4g; domain=localhost; Expires=Thu, 08 Sep 2022 22:26:20 GMT;"
    console.log(dom.window.document.cookie)
    console.log("Completed Loading of scripts ");
    //console.log(dom.window.listServiceRequest)
    someFunc()
})


async function someFunc(){
    console.log("Inside the somfunct")
    await dom.window.listServiceRequest()
    console.log(dom.window.document.getElementById("entireBody").innerHTML);
}



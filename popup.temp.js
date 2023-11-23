let changeColor = document.getElementById('changeColor');
let autoFill = document.getElementById('autoFill');
let userlist = document.getElementById("userlist");
// let autoFillByServer = document.getElementById("autoFillByServer")

let p = document.createElement("p");
p.textContent = 'bapun hansdah';



autoFill.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setInputFields,
    });
});


function constructUsers(users) {

        for (let [index, user] of users.entries()) {
            let p = document.createElement("p");
            p.textContent = user.name;
            p.classList.add("users");
        
            // Add a click event listener with the index
            p.addEventListener("click", function () {
                handleUserClick(index);
            });
        
            userlist.appendChild(p);
        }
}


function handleUserClick(index){
    chrome.storage.sync.set({userIndex: index});
}

// document.getElementById('fileInput').addEventListener('change', function (event) {
//     const file = event.target.files[0]; // Get the selected file

//     if (file) {
//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const data = new Uint8Array(e.target.result);
//             const workbook = XLSX.read(data, { type: 'array' });

//             // Assuming you have a single sheet, you can access it like this
//             const sheet = workbook.Sheets[workbook.SheetNames[0]];

//             // Now you can access the data in the sheet
//             const jsonData = XLSX.utils.sheet_to_json(sheet);
            

//             console.log(jsonData); // This will log the Excel data as an array of objects
//             if(jsonData.length > 0){
//                 constructUsers(jsonData)
//                 chrome.storage.sync.set({jsonData: jsonData});
//             }

//             };

//         reader.readAsArrayBuffer(file);
//     }
// });



async function getUserData(cookie) {
    const url = `http://localhost:8080`
    const res = await fetch(`${url}/api/auth/login/success`, {
      withCredentials: true,
              headers: {
                  Cookie: cookie
              }
               
    });
    
    if (!res.ok) {
      console.log('error!')
      window.open("http://localhost:3000/login","_target")
    }
   
    return res.json()
  }
  
  async function getProfile(cookie) {
    const url = `http://localhost:8080`
    const res = await fetch(`${url}/api/profile/`, {
      withCredentials: true,
              headers: {
                  Cookie: cookie
              }
    });
    
    if (!res.ok) {
      console.log('error!')
    }
   
    return res.json()
  }


document.getElementById("getData").addEventListener("click", async function() {
   chrome.runtime.sendMessage({ action: "getCookies" },async function(response) {
            console.log("Cookies:", response.cookies);
            const userData = await getUserData(response.cookies)
            const profileData = await getProfile(response.cookies)
            const jsonData = [{
                name:userData?.user?.firstName,
                email:userData?.user?.email,
                altMobileNo:profileData?.profile?.altMobileNo,
                dateOfBirth:profileData?.profile?.dateOfBirth,
                gender:profileData?.profile?.gender,
                middleName:profileData?.profile?.middleName,
                mobileNo:profileData?.profile?.mobileNo
            }]
            constructUsers(jsonData)
            chrome.storage.sync.set({jsonData: jsonData});
        });
});

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    
//     if (request.action === "updateCookies") {
//         // const userData = await getUserData(request.cookies)
//         // const profileData = await getProfile(request.cookies)

//         // const jsonData = [{
//         //     name:userData?.user?.firstName,
//         //     email:userData?.user?.email,
//         //     altMobileNo:profileData?.profile?.altMobileNo,
//         //     dateOfBirth:profileData?.profile?.dateOfBirth,
//         //     gender:profileData?.profile?.gender,
//         //     middleName:profileData?.profile?.middleName,
//         //     mobileNo:profileData?.profile?.mobileNo
//         // }]

//         // constructUsers(jsonData)
//         // chrome.storage.sync.set({jsonData: jsonData});
//     }
// });


// function setInputFieldsByServer(){
//     const nameInput = document.getElementById("name");
//     const emailInput = document.getElementById("email");
//     const phoneInput = document.getElementById("phone");
//     const messageTextarea = document.getElementById("message");
//     const maleRadio = document.getElementById("male");
//     const femaleRadio = document.getElementById("female");
//     const birthdateInput = document.getElementById("birthdate");
//     const musicCheckbox = document.getElementById("music");
//     const sportsCheckbox = document.getElementById("sports");
//     const booksCheckbox = document.getElementById("books");
//     const countrySelect = document.getElementById("country");
//     const commentsInput = document.getElementById("comments");


//     chrome.storage.sync.get('jsonData', (data) => {
//         const {jsonData} = data
        
//         chrome.storage.sync.get('userIndex',(index)=>{
//             const {userIndex}  = index
//             nameInput.value = jsonData[userIndex]?.name || "Bapun Hansdah";
//             emailInput.value = jsonData[userIndex]?.email || "bapun@gmail.com";
//             phoneInput.value = jsonData[userIndex]?.phone || "1241241";
//             messageTextarea.value = jsonData[userIndex]?.message || "This is a sample message.";
//             maleRadio.checked = true; 
//             birthdateInput.value ="1990-01-01"; 
//             musicCheckbox.checked = true; 
//             sportsCheckbox.checked = true; 
//             booksCheckbox.checked = false; 
//             countrySelect.value = "India"; 
//             commentsInput.value = jsonData[userIndex]?.comments || "test";
//         })
//     });


// }

function setInputFields() {

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageTextarea = document.getElementById("message");
    const maleRadio = document.getElementById("male");
    const femaleRadio = document.getElementById("female");
    const birthdateInput = document.getElementById("birthdate");
    const musicCheckbox = document.getElementById("music");
    const sportsCheckbox = document.getElementById("sports");
    const booksCheckbox = document.getElementById("books");
    const countrySelect = document.getElementById("country");
    const commentsInput = document.getElementById("comments");


    chrome.storage.sync.get('jsonData', (data) => {
        const {jsonData} = data
        
        chrome.storage.sync.get('userIndex',(index)=>{
            const {userIndex}  = index
            // console.log(userIndex)
            // console.log(jsonData[userIndex].name)
            nameInput.value = jsonData[userIndex]?.name || "Bapun Hansdah";
            emailInput.value = jsonData[userIndex]?.email || "bapun@gmail.com";
            phoneInput.value = jsonData[userIndex]?.phone || "1241241";
            messageTextarea.value = jsonData[userIndex]?.message || "This is a sample message.";
            maleRadio.checked = true; 
            birthdateInput.value ="1990-01-01"; 
            musicCheckbox.checked = true; 
            sportsCheckbox.checked = true; 
            booksCheckbox.checked = false; 
            countrySelect.value = "India"; 
            commentsInput.value = jsonData[userIndex]?.comments || "test";
        })
        // document.body.style.backgroundColor = data.color;
    });



}


// function setPageBackgroundColor() {
//     chrome.storage.sync.get('color', (data) => {
//         document.body.style.backgroundColor = data.color;
//     });
// }


// popup.js

// document.getElementById("getCookies").addEventListener("click", function() {
//     // Send a message to the background script to get cookies
//     chrome.runtime.sendMessage({ action: "getCookies" }, function(response) {
//         console.log("Cookies:", response.cookies);
//     });
// });

// document.getElementById("setCookie").addEventListener("click", function() {
//     // Send a message to the background script to set a cookie
//     chrome.runtime.sendMessage({
//         action: "setCookie",
//         cookieName: "exampleCookie",
//         cookieValue: "exampleValue"
//     });
// });



// chrome.storage.sync.get('color', (data) => {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// } );


// changeColor.addEventListener("click", async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: setPageBackgroundColor,
//     });
// });

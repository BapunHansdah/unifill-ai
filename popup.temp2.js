let changeColor = document.getElementById("changeColor");
let autoFill = document.getElementById("autoFill");
let userlist = document.getElementById("userlist");
let fillInputs = document.getElementById("updateFieldsButton");
let p = document.createElement("p");
p.textContent = "bapun hansdah";

// let scrap = document.getElementById("scrap");

// scrap.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: scrapeFields,
//   });
// });


fillInputs.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setFields,
  });
});


function constructUsers(users) {
  for (let [index, user] of users.entries()) {
    let p = document.createElement("p");
    p.textContent = `${user.firstName} ${user.lastName}`;
    p.classList.add("user");

    // Add a click event listener with the index
    p.addEventListener("click", function () {
      handleUserClick(index);
    });

    // <button id="autoFill">Auto Fill</button>
    let btn = document.createElement("button");
    btn.textContent = "Auto Fill";
    btn.id = `autoFill-${index}`;

    btn.addEventListener("click", async () => {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setInputFields,
      });
    });

    userlist.appendChild(p);
    userlist.appendChild(btn);
  }
}

function handleUserClick(index) {
  chrome.storage.sync.set({ userIndex: index });
}

async function getUserData(cookie) {
  const url = `http://localhost:8080`;
  const res = await fetch(`${url}/api/auth/login/success`, {
    withCredentials: true,
    headers: {
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    console.log("error!");
    window.open("http://localhost:3000/login", "_target");
  }

  return res.json();
}

async function getProfile(cookie) {
  const url = `http://localhost:8080`;
  const res = await fetch(`${url}/api/profile/`, {
    withCredentials: true,
    headers: {
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    console.log("error!");
  }

  return res.json();
}

// document.getElementById("getData").addEventListener("click", async function() {
chrome.runtime.sendMessage({ action: "getCookies" }, async function (response) {
  // console.log("Cookies:", response.cookies);
  // const userData = await getUserData(response.cookies);
  // const profileData = await getProfile(response.cookies);
  // const jsonData = [
  //   {
  //     firstName: userData?.user?.firstName,
  //     lastName: userData?.user?.lastName,
  //     email: userData?.user?.email,
  //     altMobileNo: profileData?.profile?.altMobileNo,
  //     dateOfBirth: profileData?.profile?.dateOfBirth,
  //     gender: profileData?.profile?.gender,
  //     middleName: profileData?.profile?.middleName,
  //     mobileNo: profileData?.profile?.mobileNo,
  //   },
  // ];
  // constructUsers(jsonData);
  // chrome.storage.sync.set({ jsonData: jsonData });
});
// });

function setInputFields() {
  chrome.storage.sync.get("jsonData", (data) => {
    const { jsonData } = data;

    const name = jsonData[0]?.firstName;

    const nameInput = document.getElementById("name");

    nameInput.value = name || "Bapun Hansdah";
  });
}

// chrome.storage.sync.get('userIndex',(index)=>{
//   const {userIndex}  = index
//   nameInput.value = jsonData[userIndex]?.firstName || "Bapun Hansdah";
// })

// async function scrapeFields() {

// console.log('scrapping..')
// const inputFields = document.querySelectorAll('input');
// console.log(inputFields)
// const fieldData = [];

// inputFields.forEach((field) => {
//   const label = field.parentElement.querySelector('label');
//   const labelValue = label ? label.innerText.trim() : null;

//   fieldData.push({
//     label: labelValue,
//     id: field.id,
//   });
// });

// console.log(fieldData)

// return fieldData;

// }

document.getElementById("scrape").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "scrapeFields" });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fieldsScraped") {
    const scrapedFieldNames = request.data;
    const jsonData = { name: "Bapun Hansdah", email: "bapun@gmail.com" };
    
    const matchingFieldNames = scrapedFieldNames.filter((name) => {
      // return Object.keys(jsonData).includes(name.name);
    });


    if (matchingFieldNames.length > 0) {
      chrome.storage.sync.set({matchingFieldNames:jsonData});
      console.log(matchingFieldNames)
    } else {
      console.log("No matching field names found.");
    }
  }
});

function setFields() {
  chrome.storage.sync.get("matchingFieldNames", (data) => {
    const { matchingFieldNames } = data;
    console.log(matchingFieldNames)
    // const myObject = {name:'bapun',email:'bapun@gmail'}

    for (const key in matchingFieldNames) {
      if (matchingFieldNames.hasOwnProperty(key)) {
        // Get the input element by its id (assuming the id is the same as the key)
        const inputElement = document.getElementById(key);
  
        // Check if the input element exists before trying to set its value
        if (inputElement) {
          inputElement.value = matchingFieldNames[key];
        }
      }
    }

    // matchingFieldNames.forEach(name => {
    //   const nameInput = document.getElementById(name.name);
    //   nameInput.value = name.value
    // });
  });
}

// popup.js
// document
//   .getElementById("updateFieldsButton")
//   .addEventListener("click", function () {
//     console.log("Button clicked");

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       var activeTab = tabs[0];

//       console.log("tabs....");
//       chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//         port = chrome.tabs.connect(tabs[0].id, { name: "channelName" });
//         console.log(port, "port");
//         port.postMessage({ url: tabs[0].url });
//       });

//       // Send a message to the content script to scrape and match fields
//       chrome.tabs.sendMessage(activeTab.id, { action: 'scrapeAndMatchFields' }, function(response) {
//         console.log('Response from content script:', response);

//         if (response && response.action === 'fieldNamesScraped') {
//           const scrapedFieldNames = response.data;
//           const jsonData = { name: "Bapun Hansdah", email: 'bapun@gmail.com' };

//           // Check if scraped field names match JSON data keys
//           const matchingFieldNames = scrapedFieldNames.filter(name => Object.keys(jsonData).includes(name));

//           if (matchingFieldNames.length > 0) {
//             console.log('Matched Field Names:', matchingFieldNames);

//             // Proceed with updating input values based on matching names
//             matchingFieldNames.forEach(name => {
//               jsonData[name] = 'Your Updated Value'; // Replace with your own updated value
//             });

//             console.log('Updated JSON Data:', jsonData);
//           } else {
//             console.log('No matching field names found.');
//           }
//         }
//       });
//     });
//   });

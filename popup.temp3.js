let userlist = document.getElementById("userlist");
let status = document.getElementById("status");

let fillInputs = document.getElementById("updateFieldsButton");

// fillInputs.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setFields,
//   });
// });

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

async function getFormData(data) {
  const url = `http://localhost:8080`;
  const res = await fetch(`${url}/api/profile/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adjust the content type based on your server's expectations
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("error!");
  }

  return res.json();
}

chrome.runtime.sendMessage({ action: "getCookies" }, async function (response) {
  // return;
  console.log("Cookies:", response.cookies);
  const userData = await getUserData(response.cookies);
  const profileData = await getProfile(response.cookies);
  console.log(profileData);
  const jsonData = [
    {
      firstName: userData?.user?.firstName,
      lastName: userData?.user?.lastName,
      email: userData?.user?.email,
      ...profileData?.profile
    },
  ];
  // constructUsers(jsonData);
  chrome.storage.sync.set({ jsonData: jsonData });
});

// document.getElementById("scrape").addEventListener("click", function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { action: "scrapeFields" });
//   });
// });

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === "fieldsScraped") {
    const dataToSend = {
      html: request.data,
    };

    let p = document.createElement("p");
    status.appendChild(p);
    p.textContent = `analyzing website...`;
    console.log('analyzing...')
    const formData = await getFormData(dataToSend);
    console.log('analyzed successfully!')

    p.textContent = `analyzed successfully!`;

    chrome.storage.sync.set({ formData: formData });

  }
});






fillInputs.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: handleAutoFill,
  });
});


function handleAutoFill() {
  chrome.storage.sync.get("jsonData", async (data) => {
    const { jsonData } = data;
    chrome.storage.sync.get("formData", async (data) => {
     const {formData} = data

    const dataToSend = {
      my_object:jsonData[0],
      form_object:formData.info
    }

    let p = document.createElement("p");

    console.log('matching fields...')

  //   const matchedData = {
  //     "fullname": "Barun",
  //     "cfullname": "Barun",
  //     "middlename": "kumar",
  //     "cmiddlename": "kumar",
  //     "lastname": "Hansdah",
  //     "clastname": "Hansdah",
  //     "fmlname": "Barun Hansdah",
  //     "txtmobile": "9876543210",
  //     "txtcmobile": "9876543210",
  //     "txtaltphone": "8978675645",
  //     "txtemail": "bapunhansdah777@gmail.com",
  //     "seldomain": "Domain Names",
  //     "txtothdomain": "Others",
  //     "txtcemail": "bapunhansdah777@gmail.com",
  //     "txtCode": "Security Code"
  // }

    async function getMatchData(data) {
      const url = `http://localhost:8080`;
      const res = await fetch(`${url}/api/profile/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Adjust the content type based on your server's expectations
        },
        body: JSON.stringify(data),
      });
    
      if (!res.ok) {
        console.log("error!");
      }
    
      return res.json();
    }


    const matchedData = await getMatchData(dataToSend)

    console.log(matchedData)

    for (const key in matchedData) {

        // Get the input element by its id (assuming the id is the same as the key)
        const inputElement = document.getElementById(key);

        // Check if the input element exists before trying to set its value
        if (inputElement) {
          inputElement.value = matchedData[key];
        }
    }
  });
    
  });
}




// function setFields() {
//   chrome.storage.sync.get("matchingFieldNames", (data) => {
//     const { matchingFieldNames } = data;
//     console.log(matchingFieldNames);

//     for (const key in matchingFieldNames) {
//       if (matchingFieldNames.hasOwnProperty(key)) {
//         const inputElement = document.getElementById(key);
//         if (inputElement) {
//           inputElement.value = matchingFieldNames[key];
//         }
//       }
//     }

//     // matchingFieldNames.forEach(name => {
//     //   const nameInput = document.getElementById(name.name);
//     //   nameInput.value = name.value
//     // });
//   });
// }

// document.getElementById('analyzeButton').addEventListener('click', function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { action: 'analyzeFields' });
//   });
// });

function analyzeInputFields() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "analyzeInputFields" });
  });
}

// Attach the analyzeInputFields function to the button click event
document
  .getElementById("analyzeButton")
  .addEventListener("click", analyzeInputFields);

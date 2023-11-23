let userlist = document.getElementById("userlist");
let status = document.getElementById("status");
let fillInputs = document.getElementById("updateFieldsButton");

const dev=true;

const server_url = dev ? 'http://localhost:8080':'https://unifill.onrender.com'
const client_url = dev ? 'http://localhost:3000':'https://unifill.vercel.app'

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
//   const server_url = `http://localhost:8080`;
  const res = await fetch(`${server_url}/api/auth/login/success`, {
    withCredentials: true,
    headers: {
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    console.log("error!");
    window.open(`${client_url}/login`, "_target");
  }

  return res.json();
}

async function getProfile(cookie) {
//   const server_url = `http://localhost:8080`;
  const res = await fetch(`${server_url}/api/profile/`, {
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
//   const server_url = `http://localhost:8080`;
  const res = await fetch(`${server_url}/api/profile/parse`, {
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
  let p = document.createElement("p");
  status.appendChild(p);
  p.textContent = `matching fields...`;
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

    console.log('matching fields...')

    async function getMatchData(data) {
    //   const server_url = `http://localhost:8080`;
      const res = await fetch(`${server_url}/api/profile/match`, {
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
        const inputElement = document.getElementById(key);
        if (inputElement) {
          inputElement.value = matchedData[key];
        }
    }
  });
    
  });
}

function analyzeInputFields() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "analyzeInputFields" });
  });
}

document.getElementById("analyzeButton").addEventListener("click", analyzeInputFields);

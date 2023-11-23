let color = "#" + Math.floor(Math.random() * 16777215).toString(16);

const dev=true;
const server_url = dev ? 'http://localhost:8080':'https://unifill.onrender.com'
const client_url = dev ? 'http://localhost:3000':'https://unifill.vercel.app'


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: color });
  console.log("Default background color set to", `${color}`);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ name: "anmeex" });
  console.log("Default name set to", `anmeex`);
});

chrome.runtime.onInstalled.addListener(function () {
//   getCookies();
});

// function getCookies() {
//   chrome.cookies.getAll({ url: "http://localhost:3000/" }, function (cookies) {
//     console.log(cookies);
//         sendMessageToPopup({ action: "updateCookies", cookies: cookies });
//   });
// }

// function sendMessageToPopup(message) {
//   chrome.runtime.sendMessage(message);
// }

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getCookies") {
    chrome.cookies.getAll(
      { url: url },
      function (cookies) {
        console.log(cookies);
        sendResponse({ cookies: cookies });
      }
    );
  } else if (request.action === "setCookie") {
    chrome.cookies.set({
      url: url,
      name: request.cookieName,
      value: request.cookieValue,
    });
  }
  return true;
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'sendData') {
    // Use ChatGPT API to analyze the data (similar to the previous Python example)

    // For demonstration purposes, log the data to the console
    console.log('Data to analyze:', request.data);
  }
});
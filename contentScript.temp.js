
// content.js

// Function to find the nearest text element before the given input field
function findNearestTextElement(inputField) {
  var currentNode = inputField;

  // Traverse the DOM upwards until a text node with non-empty content is found
  while ((currentNode = currentNode.previousSibling) !== null) {
      console.log("cuurent node" ,currentNode)
      console.log("cuurent node type" ,currentNode.nodeType)
      console.log("cuurent node text content" ,currentNode.textContent)

      console.log("------------------------------------------")

      if (currentNode.textContent.trim() !== "") {
          return currentNode;
      }
  }





  // If no text node is found, you can handle it accordingly (e.g., return null or an empty string)
  return null;
}

function getParentText(element) {

  console.log("element",element)
  console.log("element parent node",element.parentNode)

  if (!element || !element.parentNode) {
      return '';
  }

  var currentText = element.parentNode.textContent.trim();
  var parentText = getParentText(element.parentNode);
  
  console.log("current text",currentText)
  console.log("parents text",parentText)
  return parentNode
}

// Function to analyze input fields and their labels
function analyzeInputFields() {
  // Get all input fields in the document
  var inputFields = document.getElementsByTagName('input');

  // Create an array to store the result objects
  var resultArray = [];

  // Loop through each input field
  for (var i = 0; i < inputFields.length; i++) {
      var inputField = inputFields[i];

      // Find the nearest text element before the input field
      var textElement = getParentText(inputField);

      // If a valid text element is found
      if (textElement) {
          // Create an object with the input field name, id, and the text content of the nearest text element
          var resultObject = {
              name: inputField.getAttribute('name'),
              id: inputField.id,
              label: textElement.textContent.trim()
          };

          // Add the result object to the array
          resultArray.push(resultObject);
      }
  }

  // Display the result array (you can modify this part based on your needs)
  console.log(resultArray);
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "analyzeInputFields") {
    console.log('analyze started!')  
    analyzeInputFields();
  }
});

// Listen for messages from the popup script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "analyzeInputFields") {
//       analyzeInputFields();
//   }
// });


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'scrapeFields') {
//       const inputFields = document.querySelectorAll('input');
//       const fieldData = [];
  
//       inputFields.forEach((field) => {
//         const label = field.parentElement.querySelector('label');
//         const labelValue = label ? label.innerText.trim() : null;
  
//         fieldData.push({
//           label: labelValue,
//           id: field.id,
//         });
//       });
  
//       // Send the scraped data back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldsScraped', data: fieldData });
//     }
//   });
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action === 'scrapeFields') {
//       const inputFields = document.querySelectorAll('input');
//       const fieldData = [];

//       inputFields.forEach((field) => {
//           const previousElement = field.previousElementSibling;

//           // Check if the previous element exists and is not null
//           if (previousElement && previousElement.textContent) {
//               const labelValue = previousElement.textContent.trim();

//               // Check if the label text meets your criteria (not one letter and excludes specified characters)
//               if (labelValue.length > 1 && !/^[*&!@#$*,.\d]+$/.test(labelValue)) {
//                   fieldData.push({
//                       label: labelValue,
//                       id: field.id,
//                   });
//               }
//           }
//       });

//       // Send the scraped data back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldsScraped', data: fieldData });
//   }
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.action === 'scrapeFields') {
//       const inputFields = document.querySelectorAll('input:not([type="hidden"])');
//       const fieldData = [];

//       inputFields.forEach((field) => {
//           // Exclude hidden fields explicitly
//           if (field.type === 'hidden') {
//               return;
//           }

//           const parentRow = field.closest('tr');
//           if (parentRow) {
//               const labelCell = parentRow.querySelector('td.tb-r1, td.tb-r2');
//               if (labelCell) {
//                   const label = labelCell.textContent.trim();
//                   const labelWithoutStar = label.replace(/\*/g, '').trim(); // Remove asterisks
//                   const id = field.id;

//                   // Check if the label text meets your criteria
//                   if (labelWithoutStar.length > 1 && !/^[*&!@#$*,.\d]+$/.test(labelWithoutStar)) {
//                       fieldData.push({
//                           label: labelWithoutStar,
//                           id: id,
//                       });
//                   }
//               }
//           }
//       });

//       // Send the scraped data back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldsScraped', data: fieldData });
//   }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'scrapeFields') {
      const formFields = document.querySelectorAll('input, select');
      const fieldData = [];

      formFields.forEach((field) => {
          // Exclude hidden and submit fields
          if (field.type !== 'hidden' && field.type !== 'submit') {
              const precedingElement = getPrecedingElement(field);
              if (precedingElement) {
                  const textContent = precedingElement.textContent.trim();
                  const value = field.value;
                  fieldData.push({
                      textContent: textContent,
                      value: value,
                  });
              }
          }
      });

      // Send the scraped data back to the popup
      chrome.runtime.sendMessage({ action: 'fieldsScraped', data: fieldData });
  }
});

function getPrecedingElement(field) {
  // Look for the closest preceding td element
  const precedingElement = field.closest('td');
  if (precedingElement) {
      return precedingElement;
  }

  return null;
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'analyzeFields') {
//     const inputFields = Array.from(document.querySelectorAll('input'));
//     const fieldNames = inputFields.map(field => field.name || field.id || 'No Name');
//     const dataToAnalyze = fieldNames.join(', ');

//     // Send data to background script
//     chrome.runtime.sendMessage({ action: 'sendData', data: dataToAnalyze });
//   }
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'scrapeFields') {
//       const inputFields = document.querySelectorAll('input[name]'); // Select input fields with a name attribute
//       const fieldData = [];
  
//       inputFields.forEach((field) => {
//         const fieldName = field.name;
//         const fieldId = field.id;
  
//         fieldData.push({
//           name: fieldName,
//           id: fieldId,
//         });
//       });
  
//       // Send the scraped data back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldsScraped', data: fieldData });
//     }
//   });


  // contentScript.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'scrapeAndMatchFields') {
//       const inputFields = document.querySelectorAll('input[name]'); // Select input fields with a name attribute
//       const fieldData = {};
  
//       inputFields.forEach((field) => {
//         const fieldName = field.name;
//         fieldData[fieldName] = field.value;
//       });
  
//       // Send the scraped data back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldsScrapedAndMatched', data: fieldData });
//     }
//   });


// contentScript.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'scrapeAndMatchFields') {
//       const inputFields = document.querySelectorAll('input[name]'); // Select input fields with a name attribute
//       const fieldNames = Array.from(inputFields, field => field.name);
  
//       // Send the list of matched field names back to the popup
//       chrome.runtime.sendMessage({ action: 'fieldNamesScraped', data: fieldNames });
//     }
//   });

chrome.runtime.onConnect.addListener(function(port) {
    console.log("port started",port)
    if(port.name == "channelName"){
    console.log("found channel")
    port.onMessage.addListener(function(response) {
        if(response.url == window.location.href){

        }
    }); 
}
});
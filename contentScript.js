chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "analyzeInputFields") {
      console.log('analyze started!')  
      analyzeInputFields();
    }
  });

  function analyzeInputFields() {
    
    // Select forms using a specific CSS selector
    const forms = document.querySelectorAll('form');
    const modifiedForms = [];

    // Iterate through the selected forms and create HTML strings of clones with removed attributes
    forms.forEach(function(form) {
        const modifiedFormHTML = removeAttributes(form);
        modifiedForms.push(modifiedFormHTML);
    });

    // Log the modified forms (for demonstration purposes)
    console.log(modifiedForms);

    const yourHTMLString = modifiedForms[0];
    const modifiedHTML = removeAttributesFromHTML(yourHTMLString);
    console.log(modifiedHTML);
    chrome.runtime.sendMessage({ action: 'fieldsScraped', data: modifiedHTML });

  }



  
  function removeAttributes(element) {
    const clonedElement = element.cloneNode(true);

    const attributes = clonedElement.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
        const attributeName = attributes[i].name;
        // Keep only id and name attributes, remove others
        if (attributeName !== 'id' && attributeName !== 'name') {
            clonedElement.removeAttribute(attributeName);
        }
    }

    // Recursively remove attributes from child elements
    const childElements = clonedElement.children;
    for (let i = 0; i < childElements.length; i++) {
        removeAttributes(childElements[i]);
    }

    return clonedElement.outerHTML;
}

function removeAttributesFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    function removeAttributes(element) {
        const attributes = element.attributes;
        for (let i = attributes.length - 1; i >= 0; i--) {
            const attributeName = attributes[i].name;
            // Keep only id and name attributes, remove others
            if (attributeName !== 'id' && attributeName !== 'name') {
                element.removeAttribute(attributeName);
            }
        }

        // Recursively remove attributes from child elements
        const childElements = element.children;
        for (let i = 0; i < childElements.length; i++) {
            removeAttributes(childElements[i]);
        }
    }

    // Remove attributes from the root element
    removeAttributes(doc.body.firstElementChild);

    // Return the modified HTML string
    return doc.body.innerHTML;
}


  
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
document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById('capture');
  const reportButton = document.getElementById('report');
  const trashButton = document.getElementById('clear')


  // Initialize cumulative_biases in storage if it doesn't exist
  chrome.storage.local.get('cumulative_biases', (data) => {
    if (!data.cumulative_biases) {
      chrome.storage.local.set({
        cumulative_biases: {
          racial_bias: [],
          gender_bias: [],
          age_bias: [],
          religious_bias: [],
          class_bias: [],
          disability_bias: [],
          sexual_orientation_bias: [],
          cultural_bias: [],
          body_size_bias: [],
          nationalism_ethnocentrism: [],
          intersectional_bias: [],
          generalizations: [],
          stereotypes: [],
          unfair_statements: [],
        }
      });
    }
  });


  // CAPTURE BUTTON

  captureButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: extractTextFromPage
      }, (results) => {
        const text = results[0].result;
        console.log("text sent for bias analysis:", text)

        if (text) {
          getBiasAnalysis(text);

        } else {
          console.error('Failed to perform bias analysis');
        }
      });
    });
  });


  function extractTextFromPage() {
   const walker = document.createTreeWalker(
       document.body,
       NodeFilter.SHOW_TEXT,
       {
           acceptNode(node) {
               // Filter out certain nodes you don't want text from
               if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentNode.nodeName)) {
                   return NodeFilter.FILTER_REJECT;
               }
               return NodeFilter.FILTER_ACCEPT;
           }
       },
       false
   );
   
   let extractedText = '';
   while (walker.nextNode()) {
       const nodeValue = walker.currentNode.nodeValue.trim();
       if (nodeValue !== '') {
           extractedText += nodeValue + '\n';
       }
   }
   return extractedText.trim();
}


  function extendBiases(response) {
    let cumulative_biases = chrome.storage.local.get('cumulative_biases')

    if (!cumulative_biases || Object.keys(cumulative_biases).length === 0) {
      cumulative_biases = {
        racial_bias: [],
        gender_bias: [], 
        age_bias: [],
        religious_bias: [],
        class_bias: [],
        disability_bias: [],
        sexual_orientation_bias: [],
        cultural_bias: [],
        body_size_bias: [],
        nationalism_ethnocentrism: [],
        intersectional_bias: [],
        generalizations: [],
        stereotypes: [],
        unfair_statements: [],
      };
    }

    if (response.racial_bias) {
      cumulative_biases.racial_bias = cumulative_biases.racial_bias || []; // Ensure it exists
      cumulative_biases.racial_bias.push(...response.racial_bias);
    }
    if (response.gender_bias) {
      cumulative_biases.gender_bias = cumulative_biases.gender_bias || [];
      cumulative_biases.gender_bias.push(...response.gender_bias);
    }
    if (response.age_bias) {
      cumulative_biases.age_bias = cumulative_biases.age_bias || [];
      cumulative_biases.age_bias.push(...response.age_bias);
    }
    if (response.religious_bias) {
      cumulative_biases.religious_bias = cumulative_biases.religious_bias || [];
      cumulative_biases.religious_bias.push(...response.religious_bias);
    }
    if (response.class_bias) {
      cumulative_biases.class_bias = cumulative_biases.class_bias || [];
      cumulative_biases.class_bias.push(...response.class_bias);
    }
    if (response.disability_bias) {
      cumulative_biases.disability_bias = cumulative_biases.disability_bias || [];
      cumulative_biases.disability_bias.push(...response.disability_bias);
    }
    if (response.sexual_orientation_bias) {
      cumulative_biases.sexual_orientation_bias = cumulative_biases.sexual_orientation_bias || [];
      cumulative_biases.sexual_orientation_bias.push(...response.sexual_orientation_bias);
    }
    if (response.cultural_bias) {
      cumulative_biases.cultural_bias = cumulative_biases.cultural_bias || [];
      cumulative_biases.cultural_bias.push(...response.cultural_bias);
    }
    if (response.body_size_bias) {
      cumulative_biases.body_size_bias = cumulative_biases.body_size_bias || [];
      cumulative_biases.body_size_bias.push(...response.body_size_bias);
    }
    if (response.nationalism_ethnocentrism) {
      cumulative_biases.nationalism_ethnocentrism = cumulative_biases.nationalism_ethnocentrism || [];
      cumulative_biases.nationalism_ethnocentrism.push(...response.nationalism_ethnocentrism);
    }
    if (response.intersectional_bias) {
      cumulative_biases.intersectional_bias = cumulative_biases.intersectional_bias || [];
      cumulative_biases.intersectional_bias.push(...response.intersectional_bias);
    }
    if (response.generalizations) {
      cumulative_biases.generalizations = cumulative_biases.generalizations || [];
      cumulative_biases.generalizations.push(...response.generalizations);
    }
    if (response.stereotypes) {
      cumulative_biases.stereotypes = cumulative_biases.stereotypes || [];
      cumulative_biases.stereotypes.push(...response.stereotypes);
    }
    if (response.unfair_statements) {
      cumulative_biases.unfair_statements = cumulative_biases.unfair_statements || [];
      cumulative_biases.unfair_statements.push(...response.unfair_statements);
    }

    return cumulative_biases; 
  }


  async function getBiasAnalysis(text) {
   try {
      const response = await fetch('http://127.0.0.1:8000/api/get-analysis', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ text })
      });
     const data = await response.json();
     console.log("response data", data)
      extendBiases(data);
   } catch (error) {
      console.error('Error:', error);
   } finally {
      const captureButtonImg = captureButton.querySelector('img');
      captureButtonImg.src = 'images/send.png';
      captureButtonImg.classList.remove('loading-spinner');
   }
}

  // REPORT BUTTON 
 
  reportButton.addEventListener('click', function() {
    chrome.storage.local.get('cumulative_biases', (data) => {
      console.log("local storage data:", data)
      if (data.cumulative_biases) {
          // Send data to the API endpoint
          getCumulativeBiasAnalysis(cumulative_biases);

        } else {
          console.error('Failed to perform bias analysis');
        }
    }) 
  });
  
  function getCumulativeBiasAnalysis(text) {
  const reportButtonImg = reportButton.querySelector('img');

    // Change the src attribute to the loading indicator
    reportButtonImg.src = 'images/spinner-gap.png';
    reportButtonImg.classList.add('loading-spinner');

    fetch('http://127.0.0.1:8000/api/get-cumulative-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from your server...
        console.log("response data:", data)
        const completionText = data.completion.text;
  
        // once results are available, add them to the popup text
        updatePopupText(completionText);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        // Revert the src attribute after fetch request complete
        reportButtonImg.classList.remove('loading-spinner');
        reportButtonImg.src = 'images/send.png'
      });
}


  // Function to update the text in your popup
  function updatePopupText(text) {
      // Assuming you have an element with the ID "popupText" to display the text
      const popupTextElement = document.getElementById('popupText');
      if (popupTextElement) {
      popupTextElement.innerHTML = text;
      }
  }

   
  // TRASH BUTTON
  
  trashButton.addEventListener('click', () => {
    chrome.storage.local.remove('cumulative_biases', () => {
      // After removing the item, update the popup text
      updatePopupText('');
    });
  });

  


});
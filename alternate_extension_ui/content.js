console.log("hello")

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlightPage") {
        // Perform your action here
        console.log("Action triggered from popup:", request.data);
        highlightPage();
        // You can also send a response back if needed
        sendResponse({status: "done"});
    }
});

window.onload = async function() {
    // Your JavaScript code here
    console.log("Page has fully loaded!");
    let min = 0;
    let max = 0;
    await chrome.storage.local.get(["minC"], (value) => {
        console.log(value, "MIN CHARS")
        min = value.minC
    })
    await chrome.storage.local.get(["maxC"], (value) => {
        console.log(value, "MAX CHARS")
        max = value.maxC
    })

    console.log("MIN AND MAX", min, max)

    await chrome.storage.local.get(["highlightOn"], (value) => {
        if(value.highlightOn){
            //run highlight!
            const clone = document.body.cloneNode(true);
            clone.querySelectorAll('script, style').forEach(el => el.remove());
            const textContent = clone.innerText;
            const totalLength = textContent.length;
            if(totalLength<max && totalLength>min){
            console.log("HIGHLIGHT THE PAGE")
            highlightPage(); 

            }
            else{
                console.log("NOT HIGHLIGHTING, OUTSIDE MIN OR MAX")
            }
        }else{
            console.log("NOT HIGHLIGHTING, DISABLED")
        }
    })
  };


  const highlightPage = async () => {

    const style = document.createElement('style');
    style.innerHTML = `
        .highlight {
            position: relative; /* Needed for positioning the tooltip */
            display: inline-block; /* Allows padding and margins */
            font-weight: bold; /* Optional: Make text bold */
            padding: 8px; /* Adjust padding */
            border-radius: 5px; /* Optional: rounded corners */
        }
        .highlight::after {
            content: attr(type-name) ": " attr(data-tooltip);
            position: absolute; /* Position it relative to the highlight */
            bottom: 110%; /* Position above the highlight */
            left: 50%; /* Center horizontally */
            transform: translateX(-50%); /* Adjust for the width of the tooltip */
            background-color: #ffcc00; /* Bright, cheerful background color */
            color: #333; /* Darker text color for contrast */
            padding: 10px 15px; /* More padding for a chunkier look */
            border-radius: 12px; /* More rounded edges */
            white-space: normal; /* Prevent line breaks */
            opacity: 0; /* Initially hidden */
            transition: opacity 0.3s, transform 0.3s; /* Smooth transition */
            transform: translateX(-50%) translateY(10px); /* Add a slight upward float effect */
                    max-width: 600px; /* Set your desired max width */
                    min-width: 400px;
        }
        .highlight:hover::after {
            opacity: 1; /* Show tooltip on hover */
            z-index:9999999;
            transform: translateX(-50%) translateY(0); /* Lift into place */
        }
    .A {
        background-color: #B0C4DE; /* Light Steel Blue */
    }
    
    .A::after {
        background-color: #A0B3C7; /* Slightly darker shade */
    }
    
    .B {
        background-color: #FFD700; /* Gold */
    }
    
    .B::after {
        background-color: #FFC300; /* Slightly darker shade */
    }
    
    .C {
        background-color: #98FB98; /* Pale Green */
    }
    
    .C::after {
        background-color: #88D88D; /* Slightly darker shade */
    }
    
    .D {
        background-color: #FFB6C1; /* Light Pink */
    }
    
    .D::after {
        background-color: #FFA3B2; /* Slightly darker shade */
    }
    
    .E {
        background-color: #ADD8E6; /* Light Blue */
    }
    
    .E::after {
        background-color: #A0C1DB; /* Slightly darker shade */
    }
    
    .F {
        background-color: #d46ea1; /* Hot Pink */
    }
    
    .F::after {
        background-color: #ba7599; /* Slightly darker shade */
    }
    
    .G {
        background-color: #FFA07A; /* Light Salmon */
    }
    
    .G::after {
        background-color: #FF8F6A; /* Slightly darker shade */
    }
    
    .H {
        background-color: #DDA0DD; /* Plum */
    }
    
    .H::after {
        background-color: #C87BCE; /* Slightly darker shade */
    }
    
    .I {
        background-color: #F0E68C; /* Khaki */
    }
    
    .I::after {
        background-color: #E2D35D; /* Slightly darker shade */
    }
    
    .J {
        background-color: #87CEFA; /* Light Sky Blue */
    }
    
    .J::after {
        background-color: #74B7E0; /* Slightly darker shade */
    }
    
    .K {
        background-color: #FFDEAD; /* Navajo White */
    }
    
    .K::after {
        background-color: #FFD1A0; /* Slightly darker shade */
    }
    
    .L {
        background-color: #B0E0E6; /* Powder Blue */
    }
    
    .L::after {
        background-color: #A3D4E0; /* Slightly darker shade */
    }
    
    .M {
        background-color: #FFC0CB; /* Pink */
    }
    
    .M::after {
        background-color: #FFB2C6; /* Slightly darker shade */
    }
    
    .N {
        background-color: #D3D3D3; /* Light Gray */
    }
    
    .N::after {
        background-color: #C0C0C0; /* Slightly darker shade */
    }
    `;
    document.head.appendChild(style);
    
    const colorMap = {
        age_bias: {
            name: "Age Bias",
            className: "A"
        },
        body_size_bias: {
            name: "Body Size Bias",
            className: "B"
        },
        class_bias: {
            name: "Class Bias",
            className: "C"
        },
        cultural_bias: {
            name: "Cultural Bias",
            className: "D"
        },
        disability_bias: {
            name: "Disability Bias",
            className: "E"
        },
        gender_bias: {
            name: "Gender Bias",
            className: "F"
        },
        generalizations: {
            name: "Generalization",
            className: "G"
        },
        intersectional_bias: {
            name: "Intersectional Bias",
            className: "H"
        },
        nationalism_ethnocentrism: {
            name: "Nationalism/Ethnocentrism",
            className: "I"
        },
        racial_bias: {
            name: "Racial Bias",
            className: "J"
        },
        religious_bias: {
            name: "Religious Bias",
            className: "K"
        },
        sexual_orientation_bias: {
            name: "Sexual Orientation Bias",
            className: "L"
        },
        stereotypes: {
            name: "Stereotypes",
            className: "M"
        },
        unfair_statements: {
            name: "Unfair Statements",
            className: "N"
        }
      };
      
      console.log(colorMap);
      
    
    console.log(colorMap);
    
    // const script = document.createElement('script');
    // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js';
    // document.head.appendChild(script);
    
    
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script, style').forEach(el => el.remove());
    const textContent = clone.innerText;
    const textArray = textContent.split(/\n+|\s{2,}/).filter(line => line.trim() !== '');
    
    console.log(textArray);
    
    const longEntries = textArray.filter(line => line.trim().split(/\s+/).length >= 4);
    
    //script.onload = async () => {
        let cumulative_biases = await chrome.storage.local.get('cumulative_biases')
        console.log("TOTAL BIAS",cumulative_biases)
        categorizeSentences(longEntries)
        .then(biases => {
          for (const object in biases) {
            console.log(object)
            const bias =biases[object]
                for(const argument in bias){
                  const specific = bias[argument];
                  const excerpt = specific.excerpt;
                  const explanation = specific.explanation
                  highlightInstance(excerpt,"highlightB", explanation,object)
                  console.log(specific)
                  //console.log(cumulative_biases.cumulative_biases[object], cumulative_biases,cumulative_biases.cumulative_biases, object)
                  cumulative_biases.cumulative_biases[object].push(excerpt)
                }
            }
            console.log(cumulative_biases)
            chrome.storage.local.set({"cumulative_biases": cumulative_biases});
        })
        .catch(error => console.error('Error:', error));
    //};
    
    async function categorizeSentences(longEntries) {
        console.log("CALLING AIIIIIIIIIIIIIIIIIIIIII")
        const apiKey = 'sk-proj-jhw8';
        const endpoint = 'https://api.openai.com/v1/chat/completions';
    
        // Define the function schema for categorization
        const functions = [
            {
                name: "categorizeSentences",
                description: "Return sentences, or parts of sentences that are generalizations--applying a specifical view on a broad topic or a broad view on a specific topic, stereotype--oversimplified image of something, unfair assumption--negative viewpoint without a given reason, or none.",
                parameters: {
                    type: "object",
                    "properties": {
          "racial_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "gender_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "age_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "religious_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "class_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "disability_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "sexual_orientation_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "cultural_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "body_size_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "nationalism_ethnocentrism": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "intersectional_bias": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "stereotypes": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "unfair_statements": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
          },
          "generalizations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "excerpt": {
                  "type": "string"
                },
                "explanation": {
                  "type": "string"
                }
              },
            },
        }
                    },
                    required: ["racial_bias", "gender_bias", "age_bias", "religious_bias", "class_bias","disability_bias"],
                    additionalProperties: false
                }
            }
        ];
        
    
        console.log(longEntries.join('\n'));
        // Prepare the request body
        const messages = [
            {
                role: 'user',
                content: `system_content = "You are a social bias detection tool. Analyze the following text and identify how the narrative contains or perpetuates social biases. You will return your response as a JSON object. Return any text fragments that include the following biases in the narrative: racial_bias, gender_bias, age_bias, religious_bias, class_bias, disability_bias, sexual_orientation_bias, cultural_bias, body_size_bias, marginalism_ethnocentrism, intersectional_bias, also look for 'generalizations', 'unfair_statements', and 'stereotypes'. Return the EXACT TEXT FRAGMENTS that contain these aspects along with an analysis of how that fragment relates to that particular bias.":\n\n${longEntries.join('\n')}`
            }
        ];
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // or your preferred model
                messages,
                functions,
                function_call: { name: "categorizeSentences" }
            })
        });
        console.log(response)
        const data = await response.json();
        console.log(data)
        const result = data.choices[0].message;
        // Extract categorized arrays
        const parsedArguments = JSON.parse(result.function_call.arguments);
        console.log(parsedArguments)
    
        return parsedArguments;
    }
    
    const highlightArray = (array,style) => {
        const instance = new Mark(document.body); // Target the whole body
        console.log("instance started")
        array.forEach(entry => {
            console.log(entry)
            instance.mark(entry, {
                className: style, // Use the custom highlight class
                separateWordSearch: false,// Disable separate word search
                "acrossElements": true,
                "ignoreJoiners": true,
                "wildcards": "withSpaces",
                each: (node) => {
                    node.setAttribute('data-tooltip', 'Your custom tooltip text here');
                }
            });
        });
        console.log(instance)
    }
    
    
    const highlightInstance = (string,style,tooltip,type) => {
        const classs = colorMap[type].className;
        console.log("COLOR: ", classs)
        const ttColor = colorMap[type].tooltip;
        const name = colorMap[type].name;
      const instance = new Mark(document.body); // Target the whole body
      console.log("instance started")
    
          console.log(string)
          instance.mark(string, {
              className: `highlight ${classs}`, // Use the custom highlight class
              separateWordSearch: false,// Disable separate word search
              "acrossElements": true,
              "ignoreJoiners": true,
              "wildcards": "withSpaces",
              each: (node) => {
                  node.setAttribute('data-tooltip', tooltip);
                  node.setAttribute('type-name', name);
              }
          });
      console.log(instance)
    }
    
    }
    
    const summarizeBias = async (bias) => {
        const apiKey = 'sk-proj-jhw';
        const endpoint = 'https://api.openai.com/v1/chat/completions';

        const messages = [
            {
                role: 'user',
                content: `system_content = "You are a social bias analyzer. Analyze the following text and identify the most prevelant bias. Just summarize, dont give your opinion.
                Content: ${bias}`
            }
        ];
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // or your preferred model
                messages,
                functions,
                function_call: { name: "categorizeSentences" }
            })
        });
    }
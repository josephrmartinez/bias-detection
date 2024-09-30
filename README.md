## Bias Detector Chrome Extension
A simple Chrome extension that enables users to detect social bias on the page they are currently viewing and then generate a report of the cumulative social bias that they have been exposed to. 

## Overview
Bias Detection Chrome Extension is a tool that helps users identify and track patterns of bias in their web experience. This extension is designed to raise awareness about 11 different types of biases. With just one click, users can instantly see which biases might be present in the content they are viewing. Over time, the extension also summarizes and provides insights into the biases users encounter, helping to inform them about patterns in their browsing history.

## Features
#### 1. Bias Detection

When a user clicks on the extension, they are presented with a report highlighting 11 potential biases:

&emsp; Racial Bias: Prejudices or discrimination based on race.

&emsp; Gender Bias: Prejudices or discrimination based on gender identity.

&emsp; Age Bias: Prejudices or discrimination based on age.

&emsp; Religious Bias: Prejudices or discrimination based on religion.

&emsp; Class Bias: Prejudices or discrimination based on socioeconomic status.

&emsp; Disability Bias: Prejudices or discrimination against individuals with disabilities.

&emsp; Sexual Orientation Bias: Prejudices or discrimination based on sexual orientation.

&emsp; Cultural Bias: Prejudices based on cultural background or norms.

&emsp; Body Size Bias: Prejudices based on body size or weight.

&emsp; Nationalism & Ethnocentrism: Prejudices favoring one’s own nation or ethnicity over others.

&emsp; Intersectional Bias: Biases that arise from the interaction of multiple factors, such as race, gender, and class.


#### 2. Bias Tracking and Summary
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;![image](https://github.com/user-attachments/assets/fa6b0936-538a-49a9-8737-f88368b73e68)

The extension also keeps track of the biases users have encountered during their web sessions. It assembles this data and provides summaries that can reveal patterns in the user's browsing, such as:

* Which types of bias you’ve encountered most frequently. 
* A timeline of when and where these biases were detected. 
* Insights to help raise awareness about how biases may influence your browsing habits.

#### 3. Delete History
The delete history option will delete all the previous data of the biases stored and essentialy creates a new timeline for which new summmaries can be provided.


## How to Run the Project

1. Download the Repository
- Clone or download the entire repository to your local machine.

2. Install the Chrome Extension
- Open your Chrome browser and go to "chrome://extensions."
- Toggle the "developer mode" switch to ON.
- Click "Load unpacked" on the upper left and select the "chrome-extension" folder from the local repository.
- The Bias Detection extension should now appear in your list of 'All Extensions.' Copy the displayed ID (a string of random lower-case letters).

3. Run the FastAPI Server
- Open main.py in the fastapi-server folder.
- Paste the extension ID into the allow_origins middleware:

```allow_origins=["chrome-extension://PASTE_ID_HERE"],  # Use correct extension ID```

- Save the main.py file.

- Navigate to the fastapi-server folder. Create a virtual environment inside the fastapi-server folder, activate it, and install dependencies:
```
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

4. Use the extension
- To use the extension locally, you will need to first start the FastAPI server. Ensure the server is running for the extension to send requests to the API.

- For regular use, consider deploying the FastAPI server and updating the code to securely access your API endpoint.



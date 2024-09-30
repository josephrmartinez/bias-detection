## Bias Detector Chrome Extension
A simple Chrome extension that enables users to detect social bias on the page they are currently viewing and then generate a report of the cumulative social bias that they have been exposed to. 


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



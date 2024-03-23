## AskYouTube
A simple Chrome extension that enables users to leverage the OpenAI Chat Completions endpoint on any YouTube video.

<p align="center" width="100%">
    <img width="33%" src="/askyoutube.png">
</p>

This extension simply pulls down a transcript for the video you are currently viewing and sends this to the OpenAI API with your task request. 

"Generate a vegetarian version of this recipe."

"Extract the materials list for this project."

"What was the book they recommended?"

This extension does **not** use a speech to text model to transcribe the video or an image recognition model to actually pass along information about what took place in the video. Automatically generated YouTube transcripts are not great quality, but they tend to be totally fine for the lightweight use cases when you just have a simple question on a video.  

gpt-3.5-turbo-1106 with the 16k token context window is used by default for videos under about ten minutes. For longer videos, the gpt-4-1106-preview model with a 128k context window is automatically selected. You should be able to use this for videos of to about four hours in length, but this is highly dependent on the volume of dialogue. 


## Demo Video

[![AskYouTube demo](/demo%20screenhot.png 'AskYouTube demo')](https://youtu.be/M1zq9NKIcbw?t=54)

## How to Run the Project

1. Download the Repository
- Clone or download the entire repository to your local machine.

2. Install the Chrome Extension
- Open your Chrome browser and go to "chrome://extensions."
- Toggle the "developer mode" switch to ON.
- Click "Load unpacked" on the upper left and select the "chrome-extension" folder from the local repository.
- The AskYouTube extension should now appear in your list of 'All Extensions.' Copy the displayed ID (a string of random lower-case letters).

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

At this stage, make sure you have set your OPENAI_API_KEY in your environment variables. If not, do so now.

Setting an environmental variable is a way to provide specific information to a program or script that it needs to function properly. In this case, the program requires an environmental variable called OPENAI_API_KEY to be set in order to access a service provided by OpenAI.

Here's how you can set the OPENAI_API_KEY environmental variable on different operating systems:

For Windows:
Open the Start menu and search for "Environment Variables" and select "Edit the system environment variables."
In the System Properties window, click on the "Environment Variables" button.
In the Environment Variables window, under "System Variables," click "New."
In the "Variable Name" field, enter OPENAI_API_KEY.
In the "Variable Value" field, paste your OpenAI API key.
Click "OK" to save the changes.

For macOS and Linux:
Open a terminal window.
Type the following command:
```
export OPENAI_API_KEY=your-api-key-here
```

Replace your-api-key-here with your actual OpenAI API key.
Press Enter.

After setting the environmental variable, you may need to restart your computer or terminal session for the changes to take effect. Once done, the program will be able to access the OpenAI service using the provided API key.

4. Use the extension
- To use the extension locally, you will need to first start the FastAPI server. Ensure the server is running for the extension to send requests to the API.

- For regular use, consider deploying the FastAPI server and updating the code to securely access your API endpoint.



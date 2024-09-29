from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
from pydantic import BaseModel
import os
from decouple import config
import openai
import tiktoken


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://fnfbhokfegnjapailpmakhehpajlpdii"],  # Use correct extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a Pydantic model for the request body
class TaskRequestData(BaseModel):
    url: str
    task: str

# Function to count the number of tokens in a given text. Uses gpt 3.5 embedding model
def count_tokens(text: str):
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = len(encoding.encode(text))
    return num_tokens

# Function to get the YouTube transcript from a given URL
def get_youtube_transcript(url):
    print("get_youtube_transcript url:", url)
    try:
        transcript = YouTubeTranscriptApi.get_transcript(url)
        text = " ".join([item['text'] for item in transcript])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get transcript: {str(e)}")


# Define the API route for performing a task
@app.post("/api/get-analysis")
async def perform_task(request_data: TaskRequestData):
    text = request_data.text

    # Declare model variable with gpt-3.5-turbo-1106 as default (16k token context window)
    model = "gpt-3.5-turbo-1106"

    # Get OpenAI API key 
    openai.api_key = config('OPENAI_API_KEY')

    messages = [
        {"role": "system", "content": "You are a helpful assistant. I will provide a transcript of a youtube video and ask you to perform a task."},
        {"role": "user", "content": f"Perform this task: {task} /// Using the following YouTube transcript:\n\n{transcript} /// Provide a response that includes various HTML elements (h1, h2, li, p, etc.). DO NOT include backticks or 'html' at the beginning or end of response. DO NOT include doctype information, a <title> element, or any new line characters. Just return the HTML ELEMENTS. "}
    ]

    try:
        completion = openai.ChatCompletion.create(
            model=model,
            messages=messages
        )
        
        

        return {'completion': {
            'text': completion.choices[0].message['content'], 
            'cost': total_cost
            }}
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")
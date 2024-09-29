from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from decouple import config
import openai
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://fnfbhokfegnjapailpmakhehpajlpdii"],  # Use correct extension ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a Pydantic model for the request body
class TextInput(BaseModel):
    text: str

JSON_schema = {
    "type": "object",
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
      }
  }


# Define the API route for performing a task
@app.post("/api/get-analysis")
async def perform_task(request_data: TextInput):
    print("calling get-analysis endpoint")
    user_content = request_data.text

    system_content = "You are a social bias detection tool. Analyze the following text and identify how the narrative contains or perpetuates social biases. You will return your response as a JSON object. Return any text fragments that include the following biases in the narrative: racial_bias, gender_bias, age_bias, religious_bias, class_bias, disability_bias, sexual_orientation_bias, cultural_bias, body_size_bias, marginalism_ethnocentrism, intersectional_bias, also look for 'generalizations', 'unfair_statements', and 'stereotypes'. Return the EXACT TEXT FRAGMENTS that contain these aspects along with an analysis of how that fragment relates to that particular bias."
    model='gpt-4o-mini'

    openai.api_key = config('OPENAI_API_KEY')

    try:
        response = openai.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": user_content},
            ],
            temperature=1,
            response_format={"type": "json_object"},
            tools=[{
                "type": "function",
                "function": {
                    "name": "JSON_biases_detected",
                    "description":"Extract biases from a given text; return a JSON object",
                    "parameters": JSON_schema
                }
            }],
            tool_choice={"type": "function", "function": {"name": "JSON_biases_detected"}},
        )

        completion_string = response.choices[0].message.tool_calls[0].function.arguments
        
        try:
            completion_data = json.loads(completion_string)
        except json.JSONDecodeError:
            pass

        return completion_data
        
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")
    


# Define the API route for performing a task
@app.post("/api/get-cumulative-analysis")
async def perform_task(request_data: TextInput):
    print("calling get-cumulative-analysis endpoint")
    user_content = request_data.text

    system_content = "The following object represents cumulative bias that a reader has been exposed to over a series of articles. Come up with an analysis of the social biases that the user is exposing themselves to. Pay particular attention to the subtle ways in which biases show up. Return your analysis as a short, readable analysis. Get straight to the point, do not provide an intro or conclusion. Keep in mind this analysis is over a SERIES of articles. You are generating a report on the RANGE of different biases the reader has been exposed to. Your response should be returned as styled HTML. Use different header sizes, unordered lists, list items, etc."
    model='gpt-4o-mini'

    openai.api_key = config('OPENAI_API_KEY')

    try:
        response = openai.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": f"Cumulative bias object: {user_content}"},
            ],
            temperature=1,
        )

        completion_string = response.choices[0].message.content

        return completion_string
        
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")
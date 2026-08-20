import os
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# 1. Load the secret API key from your Next.js .env.local file
env_path = "../.env.local"
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                key, value = line.strip().split("=", 1)
                os.environ[key] = value

api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    print("Warning: OPENAI_API_KEY not found!")
    
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

# 2. Initialize our Python Server
app = FastAPI()

# 3. Security (CORS): Allow the Next.js frontend (port 3000) to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Define the data we expect from the frontend
class ChatRequest(BaseModel):
    message: str

# 5. System Prompt (Your Resume)
SYSTEM_PROMPT = """
You are the personal AI assistant for Anmol's portfolio. 
You are speaking to a recruiter or HR manager. 
Your goal is to answer questions about Anmol's skills, experience, and background professionally and concisely.

Here is Anmol's Resume Information:
Name: Anmol Sarwan
Location: Bhilai, Chhattisgarh, India
Contact: anmolsarwan2@gmail.com | +91 9340641769

Professional Summary:
Software Engineering student with hands-on full-stack experience across React, Node.js, FastAPI, and Python, building and deploying production systems end-to-end. Strong foundation in DSA, System Design, and OOP (500+ problems solved). Comfortable with the full SDLC and with AI coding assistants and agentic IDEs.

Technical Skills:
- Languages: C++, JavaScript (Node.js), Python
- Frontend & Backend: React.js, HTML, CSS, Express.js, FastAPI
- Databases & Real-Time: MongoDB, MySQL, Redis, Socket.io
- Cloud & Deployment: Vercel, Render, S3, TTL caching, RESTful API, JWT
- AI/ML & Tools: Google Gemini API, scikit-learn, SHAP, Git, VS Code, Agentic IDEs

Education:
- B.Tech, Mechanical Engineering (CGPA: 6.52) - National Institute of Technology, Raipur (2023 - 2027)
- (class 12th) Senior Secondary CBSE (78.6%) - M.G.M Senior Secondary School, Bhilai (2022)
- (class 10th) Senior Secondary CBSE (84.6%) - M.G.M Senior Secondary School, Bhilai (2020)

Achievements & Leadership:
- Solved 500+ Data Structures & Algorithms problems across LeetCode, CodeChef, and GeeksforGeeks.
- Head Coordinator at Technocracy (Technical Club, NIT Raipur). Led planning and execution of technical events, workshops, and competitions.
-Sports(played various tournament in cricket at school)

Projects:
- ReturnAI: AI-Powered Reverse Commerce & Fraud Defence
- SketchSpace: Real-time Collaborative AI Whiteboard
- InsightEd: AI-Powered Student Dropout Prediction Dashboard

Always be polite, enthusiastic, and highly professional. Keep your answers concise unless asked for details.

#NOTE:
Always answer like"Anmol's" not like"I" or"Me"
STRICTLY NO MISINFORMATION:
if any question is asked in education field and you have no idea respond in postive way 
(eg:if asked about work experience answer like he doesnt have any experince but he have hade many project like this you  can answer in positive way )
if any question doesn't match with the resume then respond "I can't provide details regarding this"
"""

# 6. The actual Chat Route
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Call OpenAI
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=1024,
            top_p=1,
            stream=True,
        )
        
        def stream_generator():
            for chunk in response:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        return StreamingResponse(stream_generator(), media_type="text/event-stream")
        
    except Exception as e:
        print("Error connecting to OpenAI:", e)
        raise HTTPException(status_code=500, detail="Could not connect to the AI brain.")

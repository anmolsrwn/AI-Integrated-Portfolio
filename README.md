# 💻 AI-Integrated Portfolio

Welcome to my personal portfolio! This is a highly interactive, retro-modern web application built with a macOS-inspired windowing system and a fully integrated AI assistant. 

### 🌟 [Live Demo - Click Here!](https://your-vercel-deployment-url.vercel.app/) 
*(Replace the link above with your actual Vercel link once it's deployed!)*

---

## 🚀 Features

- **Integrated AI Assistant**: A built-in chat window powered by **Groq / LLaMA 3**. You can ask the AI questions about my experience, projects, or resume, and it streams the response back with a cool typewriter effect!
- **Draggable Glass Windows**: A custom window management system. You can open, close, maximize, and drag around floating windows (like a real OS).
- **Retro CSS TV**: A custom, pure-CSS retro television sits on the desktop, complete with deep space grid animations, scanlines, and flickering neon text.
- **Dynamic Desktop**: Includes a functional upper menu bar, a spotlight search (`Cmd/Ctrl + K`), and a sleek macOS-style bottom dock.
- **Focus Mode**: Opening any window instantly dims and blurs the background to keep you focused on the content.

## 🛠 Tech Stack

### Frontend
- **Next.js (React)**: Powers the UI, layout, and component system.
- **Vanilla CSS**: Fully custom styling, glassmorphism (`backdrop-filter`), and complex keyframe animations (no Tailwind!).

### Backend
- **FastAPI (Python)**: A lightning-fast backend API to handle AI requests.
- **OpenAI SDK / Groq**: Used to stream lightning-fast LLM responses to the frontend.

---

## 📦 Running Locally

If you want to clone this repository and run it on your own machine, you'll need to run both the frontend and the backend simultaneously.

### 1. Start the Backend
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env.local` file in the root directory of the project and add your Groq/OpenAI key:
```env
OPENAI_API_KEY=your_api_key_here
```
Run the FastAPI server:
```bash
uvicorn main:app --reload
```

### 2. Start the Frontend
Open a second terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🚀 Deployment 

This application is split-stack and deployed across two platforms:
- **Backend**: Hosted on [Render](https://render.com) using the `backend/` directory.
- **Frontend**: Hosted on [Vercel](https://vercel.com) using the `frontend/` directory with `BACKEND_URL` mapped in the environment variables.

---

*Designed and built by Anmol Sarwan.*
